/* eslint-disable no-console */
const { ObjectId } = require('mongodb');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { getDb } = require('./utils/dbConnection');
const { logger } = require('./utils/logger');
exports.addNote = async (req, res, next) => {
  try {
    const db = getDb();
    const { title } = req.body;

    if (!title) {
      logger.error(`${req.originalUrl} - ${req.ip} - title is missing `);
      throw new Error('title is missing');
    }

    const data = {
      ...req.body,
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      username: req.user.username
    };

    // Insert data to collection
    const result = await db.collection('notes').insertOne(data);

    const objResult = JSON.parse(result);

    logger.info(`${req.originalUrl} - ${req.ip} - Data successfully saved`);

    res.status(200).json({ message: 'Data successfully saved', _id: objResult.insertedId });
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.getAllNotes = async (req, res, next) => {
  try {
    const db = getDb();
    // find all Notes
    const result = await db.collection('notes').find({ username: req.user.username }).sort({ _id: -1 }).toArray();

    logger.info(`${req.originalUrl} - ${req.ip} - All notes retrieved`);

    res.status(200).json(result);
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const db = getDb();
    // find Notes based on id
    const result = await db.collection('notes').findOne({ _id: ObjectId(req.params.id) });

    logger.info(`${req.originalUrl} - ${req.ip} - Notes retrieved`);

    res.status(200).json(result);
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { title, note } = req.body;
    const db = getDb();

    if (!title) {
      logger.error(`${req.originalUrl} - ${req.ip} - title is missing `);
      throw new Error('title is missing');
    }
    // update data collection
    await db
      .collection('notes')
      .updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { title, note, updatedAt: new Date(Date.now()).toISOString() } }
      );

    logger.info(`${req.originalUrl} - ${req.ip} - Data successfully updated`);

    res.status(200).json('Data successfully updated');
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const db = getDb();
    // delete data collection
    await db.collection('notes').deleteOne({ _id: ObjectId(req.params.id) });

    logger.info(`${req.originalUrl} - ${req.ip} - Data successfully deleted`);

    res.status(200).json('Data successfully deleted');
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.register = async (req, res, next) => {
  passport.authenticate('register', { session: false }, async (err, user, info) => {
    if(user) {
      res.status(200).json({
        message: 'Register Successful',
        user: user
      });
    } else {
      res.status(200).json({
        message: 'Email already registered',
      });
    }

  })(req, res, next);
};

exports.login = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };
        const token = jwt.sign(body, 'mys3cret');

        return res.json({ user: body, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
