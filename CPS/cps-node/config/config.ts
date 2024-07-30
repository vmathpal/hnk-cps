require("dotenv").config(); // this is important!
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_SERVER,
    logging: false,
    dialectOptions: {
      options: {
        encrypt: false,
        requestTimeout: 300000,
      },
      pool: {
        max: 64,
        min: 2,
        acquire: 30000,
        idle: 10000,
      },
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
