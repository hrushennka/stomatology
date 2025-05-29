import { Sequelize } from "sequelize";
import { config } from "dotenv";

config({ override: true });

const sequelize = new Sequelize(
  process.env.POSTGRE_DATABASE,
  process.env.POSTGRE_USER,
  process.env.POSTGRE_PASSWORD,
  {
    host: process.env.POSTGRE_ADDRESS,
    port: process.env.POSTGRE_PORT,
    dialect: "postgres",
  }
);

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Соединение с базой данных установлено успешно.");

    const [results, metadata] = await sequelize.query("SELECT NOW()");
    console.log("Подключение к базе данных:", results);
  } catch (error) {
    console.error("Не удалось установить соединение с базой данных:", error);
  }
};

authenticate();

export default sequelize;
