import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Документация API для сервера",
    },
    servers: [
      {
        url: `http://${process.env.SERVER_ADDRESS || "localhost"}:${
          process.env.SERVER_PORT || 3000
        }`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;
