/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv').config();

const routes = require('./routes');
const handleErrors = require('./middlewares/errorHandler');
const { connect } = require('./utils/dbConnection');
const { logger } = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// connect to database
connect((err, client) => {
  if (err) {
    console.log(err);
  }
});

// Routes
app.use('/', routes);

app.use(handleErrors);

app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`);
});
