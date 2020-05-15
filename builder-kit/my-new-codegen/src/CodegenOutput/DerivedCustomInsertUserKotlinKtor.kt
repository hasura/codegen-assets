package org.hasura.my_action_handler

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.http.*
import com.fasterxml.jackson.databind.*
import io.ktor.jackson.*
import io.ktor.features.*

data class Mutation(var CustomInsertUser: CustomInsertUserOutput?)

data class CustomInsertUserOutput(var email: String, var id: Int, var name: String, var enum_value: SOME_ENUM?, var nullable_field: Float?, var nullable_list: List<Int?>?)

data class CustomInsertUserArgs(var email: String, var name: String)

enum class SOME_ENUM {
  TYPE_A, TYPE_B, TYPE_C
}

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }

    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        method(HttpMethod.Patch)
        header(HttpHeaders.Authorization)
        header("MyCustomHeader")
        allowCredentials = true
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }

    routing {
        post("/CustomInsertUser") {
            val input = call.receive<CustomInsertUserArgs>()
            // Business logic here
            call.respond(mapOf("hello" to "world"))
        }
    }
}