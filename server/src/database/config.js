require('dotenv').config({
  path: require('path').resolve(process.cwd(), '../.env'),
});

const sslOptions = {
  require: true,
  rejectUnauthorized: false,
};

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },

  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: sslOptions,
    },
  },
};
