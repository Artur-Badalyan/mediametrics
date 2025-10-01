import swaggerJSDoc, { Options, SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.1.0",
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
  tags: [],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "jwt",
      },
      api_key: {
        type: "apiKey",
        in: "header",
        name: "api_key",
      },
    },
  },
};

const options: Options = {
  definition: swaggerDefinition,
  apis: ["src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
