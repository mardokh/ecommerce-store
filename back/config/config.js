require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASS,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    use_env_variable: 'mysql://root:RMWqumUadjeDieUTeYfoajYGtvVrDkzT@junction.proxy.rlwy.net:50068/railway',
    dialect: 'mysql',
    logging: false,
  },
};
