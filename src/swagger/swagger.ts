import swaggerJSDoc, { Options, SwaggerDefinition } from "swagger-jsdoc";
import { schemas } from "./schemas";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Mediametrics APP APIs",
    version: "1.0.0",
    description: "Mediametrics APP APIs Documentation",
  },
  servers: [
    {
      url: "http://localhost:4000/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas,
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options: Options = {
  definition: swaggerDefinition,
  apis: ["src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
