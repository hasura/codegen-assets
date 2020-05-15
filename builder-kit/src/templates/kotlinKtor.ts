import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

export const kotlinKtorTemplate = (params: CodegenTemplateParams) => {
  const { actionName } = params

  return template`
    package org.hasura.my_action_handler

    import io.ktor.application.*
    import io.ktor.response.*
    import io.ktor.request.*
    import io.ktor.routing.*
    import io.ktor.http.*
    import com.fasterxml.jackson.databind.*
    import io.ktor.jackson.*
    import io.ktor.features.*

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
            post("/${actionName}") {
                val input = call.receive<${actionName}Args>()
                // Business logic here
                call.respond(mapOf("hello" to "world"))
            }
        }
    }`
}
