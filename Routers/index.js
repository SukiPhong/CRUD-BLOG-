import authRouter from '../Routers/auth.js'
import BlogRouter from '../Routers/blog.js'
import swaggerUI from "swagger-ui-express";
import openApiSpecification from "../Config/swagger.js";
import {
    notFound,
    errHandler,
    badReqException
}
    from "../Middleware/Error.js"
const initRouters = (app) => {
    app.use(
        "/api-docs",
        swaggerUI.serve,
        swaggerUI.setup(openApiSpecification)
      );
    app.use("/auth", authRouter),
    app.use("/blog", BlogRouter)
    app.use(notFound)
    app.use(badReqException)
    app.use(errHandler)
}
export default initRouters