"use strict";
import swaggerJSDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Blog API",
      description: "API endpoints for a mini blog services documented on swagger",
      contact: {
        name: "Minh Phong",
        url: "https://github.com/Sukiphong",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Điền access token vào đây",
        },
        // clientIdAuth: {
        //   type: "apiKey",
        //   name: "X-client-id",
        //   in: "header",
        //   description: "Điền id của user vào đây",
        // },
      },
    },
  },
  // looks for configuration in specified directories
  apis: ["./Routers/*.js"],
};
const openApiSpecification = swaggerJSDoc(options);
export default openApiSpecification;
