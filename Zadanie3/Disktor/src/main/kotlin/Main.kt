import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class DiscordMessage(val content: String)

fun main() {
    val webhookUrl = "WEBHOOK_LINK"
    val message1 = "Hello!"
    sendDiscordMessage(webhookUrl, message1)
}

fun sendDiscordMessage(webhookUrl: String, message: String) = runBlocking {
    val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                encodeDefaults = true
            })
        }
    }

    try {
        val response: HttpResponse = client.post(webhookUrl) {
            contentType(ContentType.Application.Json)
            setBody(DiscordMessage(message))
        }
        println("Wysłano wiadomość. Status: ${response.status}")
    } catch (e: Exception) {
        println("Błąd: ${e.message}")
    } finally {
        client.close()
    }
}