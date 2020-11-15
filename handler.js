/* eslint-disable no-console */
const { ObjectId } = require('mongodb');
const { logger } = require('./utils/logger');

exports.addNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;
  const { title } = req.body;

  try {
    if (!title) {
      logger.error(`${req.originalUrl} - ${req.ip} - title is missing `);
      throw new Error('title is missing');
    }
    // Insert data to collection
    await notesCollection.insertOne(req.body);

    logger.info(`${req.originalUrl} - ${req.ip} - Data successfully saved`);

    res.status(200).json('Data successfully saved');
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.getAllNotes = async (req, res, next) => {
  const { notesCollection } = req.app.locals;

  try {
    // find all Notes
    const result = await notesCollection.find().sort({_id:-1}).toArray();

    logger.info(`${req.originalUrl} - ${req.ip} - All notes retrieved`);

    res.status(200).json(result);
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;

  try {
    // find Notes based on id
    const result = await notesCollection.findOne({ _id: ObjectId(req.params.id) });

    logger.info(`${req.originalUrl} - ${req.ip} - Notes retrieved`);

    res.status(200).json(result);
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;
  const { title, note } = req.body;

  try {
    if (!title) {
      logger.error(`${req.originalUrl} - ${req.ip} - title is missing `);
      throw new Error('title is missing');
    }
    // update data collection
    await notesCollection.updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { title, note } }
    );

    logger.info(`${req.originalUrl} - ${req.ip} - Data successfully updated`);

    res.status(200).json('Data successfully updated');
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;

  try {
    // delete data collection
    await notesCollection.deleteOne({ _id: ObjectId(req.params.id) });
    
    logger.info(`${req.originalUrl} - ${req.ip} - Data successfully deleted`);
    
    res.status(200).json('Data successfully deleted');
  } catch (error) {
    logger.error(`${req.originalUrl} - ${req.ip} - ${error} `);
    next(error);
  }
};
