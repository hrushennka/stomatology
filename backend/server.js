import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./config/swagger.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.SERVER_PORT || 5000;
const address = process.env.SERVER_ADDRESS || "localhost";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const server = app.listen(port, address, () => {
  console.log(
    `Server listening on ${server.address().address}:${server.address().port}`
  );
});
export default server;
