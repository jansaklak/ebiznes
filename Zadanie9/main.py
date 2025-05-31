from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Google Gemini Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # W produkcji należy ograniczyć do konkretnych domen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "gemini-1.5-flash"
    max_tokens: Optional[int] = 1000
    temperature: Optional[float] = 0.7

class ChatResponse(BaseModel):
    response: str
    model_used: str
    tokens_used: Optional[int] = None

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY nie został ustawiony w zmiennych środowiskowych!")
else:
    genai.configure(api_key=GEMINI_API_KEY)

@app.get("/")
async def root():
    return {"message": "Google Gemini Service API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "gemini-service"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_gemini(request: ChatRequest):
    """
    Endpoint do komunikacji z Google Gemini
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=500, 
                detail="Google Gemini API key nie został skonfigurowany"
            )
        
        if not request.message.strip():
            raise HTTPException(
                status_code=400, 
                detail="Wiadomość nie może być pusta"
            )
        
        logger.info(f"Wysyłanie zapytania do Gemini: {request.message[:50]}...")
        
        generation_config = {
            "temperature": request.temperature,
            "max_output_tokens": request.max_tokens,
            "top_p": 0.95,
            "top_k": 64,
        }
        
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
        ]
        
        model_name = request.model
        if model_name not in ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]:
            model_name = "gemini-1.5-flash"
        
        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        response = model.generate_content(request.message)
        
        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="Gemini nie zwrócił odpowiedzi (prawdopodobnie filtr bezpieczeństwa)"
            )
        
        estimated_tokens = len(request.message.split()) + len(response.text.split())
        
        logger.info(f"Otrzymano odpowiedź z Gemini (szacowane tokeny: {estimated_tokens})")
        
        return ChatResponse(
            response=response.text,
            model_used=model_name,
            tokens_used=estimated_tokens
        )
        
    except Exception as e:
        if "API_KEY_INVALID" in str(e):
            logger.error("Nieprawidłowy klucz API Gemini")
            raise HTTPException(
                status_code=401, 
                detail="Nieprawidłowy klucz API Google Gemini"
            )
        elif "QUOTA_EXCEEDED" in str(e):
            logger.error("Przekroczono limit zapytań Gemini API")
            raise HTTPException(
                status_code=429, 
                detail="Przekroczono limit zapytań. Spróbuj ponownie później."
            )
        else:
            logger.error(f"Błąd Gemini API: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail=f"Błąd komunikacji z Google Gemini: {str(e)}"
            )

@app.post("/analyze-text")
async def analyze_text(request: ChatRequest):
    """
    Endpoint do analizy tekstu przed wysłaniem do ChatGPT
    """
    try:
        text = request.message
        
        analysis = {
            "character_count": len(text),
            "word_count": len(text.split()),
            "sentence_count": text.count('.') + text.count('!') + text.count('?'),
            "has_questions": '?' in text,
            "language_detected": "pl" if any(char in text.lower() for char in "ąćęłńóśźż") else "en"
        }
        
        analyzed_prompt = f"""
        Przeanalizuj następujący tekst i odpowiedz na niego:
        
        Tekst: {text}
        
        Statystyki tekstu:
        - Liczba znaków: {analysis['character_count']}
        - Liczba słów: {analysis['word_count']}
        - Wykryty język: {analysis['language_detected']}
        
        Proszę o odpowiedź uwzględniającą kontekst i charakterystykę tego tekstu.
        """
        
        analyzed_request = ChatRequest(
            message=analyzed_prompt,
            model=request.model,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        
        return await chat_with_gemini(analyzed_request)
        
    except Exception as e:
        logger.error(f"Błąd podczas analizy tekstu: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Błąd podczas analizy tekstu"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)