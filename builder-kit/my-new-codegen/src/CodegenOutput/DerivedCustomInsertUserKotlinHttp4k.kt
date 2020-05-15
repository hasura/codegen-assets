package org.hasura.my_action_handler
 
import org.http4k.core.Body
import org.http4k.core.Method.DELETE
import org.http4k.core.Method.GET
import org.http4k.core.Method.OPTIONS
import org.http4k.core.Method.PATCH
import org.http4k.core.Method.POST
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.NOT_FOUND
import org.http4k.core.Status.Companion.OK
import org.http4k.core.then
import org.http4k.core.with
import org.http4k.filter.CorsPolicy.Companion.UnsafeGlobalPermissive
import org.http4k.filter.DebuggingFilters
import org.http4k.filter.ServerFilters.CatchLensFailure
import org.http4k.filter.ServerFilters.Cors
import org.http4k.format.Jackson.auto
import org.http4k.lens.Path
import org.http4k.lens.string
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.Jetty
import org.http4k.server.asServer
 
data class Mutation(var CustomInsertUser: CustomInsertUserOutput?)

data class CustomInsertUserOutput(var email: String, var id: Int, var name: String, var enum_value: SOME_ENUM?, var nullable_field: Float?, var nullable_list: List<Int?>?)

data class CustomInsertUserArgs(var email: String, var name: String)

enum class SOME_ENUM {
  TYPE_A, TYPE_B, TYPE_C
}
 
fun main(args: Array<String>) {
    val port = if (args.isNotEmpty()) args[0] else "5000"
    val baseUrl = if (args.size > 1) args[1] else "http://localhost:$port"
 
    val CustomInsertUserArgsLens = Body.auto<CustomInsertUserArgs>().toLens()
 
    fun CustomInsertUserHandler(CustomInsertUserArgs: CustomInsertUserArgsLens): HttpHandler = { request: Request ->
        // Business logic here
        Response(OK).with(stringBody of "$CustomInsertUserArgs")
    }
 
    DebuggingFilters
        .PrintRequestAndResponse()
        .then(Cors(UnsafeGlobalPermissive))
        .then(CatchLensFailure)
        .then(routes(
            "/{any:.*}" bind OPTIONS to  { _: Request -> Response(OK) },
            "/" bind POST to CustomInsertUserHandler(CustomInsertUserArgsLens) },
        ))
        .asServer(Jetty(port.toInt())).start().block()
}