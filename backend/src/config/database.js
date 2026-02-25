import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// console.log("DB_USERNAME:", process.env.DB_USERNAME);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_NAME:", process.env.DB_NAME);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('Successful connection'))
  .catch(err => console.error(err))


export default sequelize;

