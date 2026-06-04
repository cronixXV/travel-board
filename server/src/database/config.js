const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const baseConfig = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  logging: false,
};

module.exports = {
  development: baseConfig,

  test: baseConfig,

  production: {
    ...baseConfig,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
