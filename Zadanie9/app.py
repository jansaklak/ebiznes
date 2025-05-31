import streamlit as st
import requests
import json
from typing import Optional
import time

st.set_page_config(
    page_title="Google Gemini Client",
    page_icon="🤖",
    layout="wide"
)

BACKEND_URL = "http://localhost:8000"

class GeminiClient:
    def __init__(self, backend_url: str):
        self.backend_url = backend_url
    
    def check_backend_health(self) -> bool:
        """Sprawdza czy backend jest dostępny"""
        try:
            response = requests.get(f"{self.backend_url}/health", timeout=5)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False
    
    def send_message(self, message: str, model: str = "gemini-1.5-flash", 
                    max_tokens: int = 1000, temperature: float = 0.7) -> dict:
        """Wysyła wiadomość do Google Gemini przez backend"""
        try:
            payload = {
                "message": message,
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature
            }
            
            response = requests.post(
                f"{self.backend_url}/chat",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                error_detail = response.json().get("detail", "Nieznany błąd")
                return {"success": False, "error": error_detail}
                
        except requests.exceptions.Timeout:
            return {"success": False, "error": "Timeout - serwer nie odpowiada"}
        except requests.exceptions.ConnectionError:
            return {"success": False, "error": "Błąd połączenia z backendem"}
        except Exception as e:
            return {"success": False, "error": f"Nieoczekiwany błąd: {str(e)}"}
    
    def analyze_text(self, message: str, model: str = "gemini-1.5-flash",
                    max_tokens: int = 1000, temperature: float = 0.7) -> dict:
        """Analizuje tekst przed wysłaniem do Google Gemini"""
        try:
            payload = {
                "message": message,
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature
            }
            
            response = requests.post(
                f"{self.backend_url}/analyze-text",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                error_detail = response.json().get("detail", "Nieznany błąd")
                return {"success": False, "error": error_detail}
                
        except Exception as e:
            return {"success": False, "error": f"Błąd analizy: {str(e)}"}

# Client initialization
@st.cache_resource
def get_client():
    return GeminiClient(BACKEND_URL)

def main():
    st.title("🤖 Google Gemini Client")
    st.markdown("---")
    
    client = get_client()
    
    # Check backend status and configuration
    with st.sidebar:
        st.header("⚙️ Konfiguracja")
        
        # Backend status
        if client.check_backend_health():
            st.success("✅ Backend połączony")
        else:
            st.error("❌ Backend niedostępny")
            st.warning("Uruchom backend: `uvicorn main:app --reload`")
        
        st.markdown("---")
        
        model = st.selectbox(
            "Model Gemini:",
            ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"],
            index=0
        )
        
        max_tokens = st.slider(
            "Maksymalna liczba tokenów:",
            min_value=100,
            max_value=2000,
            value=1000,
            step=100
        )
        
        temperature = st.slider(
            "Temperatura (kreatywność):",
            min_value=0.0,
            max_value=2.0,
            value=0.7,
            step=0.1
        )
        
        st.markdown("---")
        
        # Tryb pracy
        mode = st.radio(
            "Tryb pracy:",
            ["Zwykły chat", "Analiza tekstu"],
            index=0
        )
    
    # Main interface
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("💬 Chat")
        
        user_message = st.text_area(
            "Wpisz swoją wiadomość:",
            height=150,
            placeholder="Napisz tutaj swoją wiadomość do Google Gemini..."
        )
        
        send_button = st.button("📤 Wyślij", type="primary")
        
        if send_button and user_message.strip():
            if not client.check_backend_health():
                st.error("Backend jest niedostępny. Sprawdź czy serwis działa.")
                return
            
            with st.spinner("Wysyłam zapytanie do Google Gemini..."):
                if mode == "Zwykły chat":
                    result = client.send_message(
                        user_message, model, max_tokens, temperature
                    )
                else:
                    result = client.analyze_text(
                        user_message, model, max_tokens, temperature
                    )
                
                if result["success"]:
                    data = result["data"]
                    
                    st.success("✅ Otrzymano odpowiedź!")
                    
                    st.markdown("### 🤖 Odpowiedź Google Gemini:")
                    st.markdown(data["response"])
                    
                    with st.expander("ℹ️ Szczegóły zapytania"):
                        st.write(f"**Model:** {data['model_used']}")
                        if data.get('tokens_used'):
                            st.write(f"**Użyte tokeny:** {data['tokens_used']}")
                        st.write(f"**Tryb:** {mode}")
                else:
                    st.error(f"❌ Błąd: {result['error']}")
        
        elif send_button and not user_message.strip():
            st.warning("⚠️ Proszę wpisać wiadomość przed wysłaniem!")
    
    with col2:
        st.header("📊 Historia")
        
        if "chat_history" not in st.session_state:
            st.session_state.chat_history = []
        
        if send_button and user_message.strip() and client.check_backend_health():
            if mode == "Zwykły chat":
                result = client.send_message(user_message, model, max_tokens, temperature)
            else:
                result = client.analyze_text(user_message, model, max_tokens, temperature)
                
            if result["success"]:
                st.session_state.chat_history.append({
                    "timestamp": time.strftime("%H:%M:%S"),
                    "user_message": user_message[:50] + "..." if len(user_message) > 50 else user_message,
                    "response": result["data"]["response"][:100] + "..." if len(result["data"]["response"]) > 100 else result["data"]["response"],
                    "mode": mode
                })
        
        if st.session_state.chat_history:
            for i, chat in enumerate(reversed(st.session_state.chat_history[-5:])):  # Ostatnie 5
                with st.expander(f"{chat['timestamp']} - {chat['mode']}"):
                    st.write(f"**Ty:** {chat['user_message']}")
                    st.write(f"**Gemini:** {chat['response']}")
        else:
            st.info("Historia chat-ów pojawi się tutaj")
        
        if st.button("🗑️ Wyczyść historię"):
            st.session_state.chat_history = []
            st.rerun()
    
    # Stopka
    st.markdown("---")
    st.markdown(
        """
        <div style='text-align: center'>
            <small>
                🔧 Backend: FastAPI | 🖥️ Frontend: Streamlit | 🤖 AI: Google Gemini
            </small>
        </div>
        """,
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()