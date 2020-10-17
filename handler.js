/* eslint-disable no-console */
const { ObjectId } = require('mongodb');

exports.addNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;
  const { title } = req.body;

  try {
    if (!title) {
      throw new Error('title is missing');
    }
    // Insert data to collection
    const result = await notesCollection.insertOne(req.body);

    console.log(result);

    res.status(200).json('Data successfully saved');
  } catch (error) {
    next(error);
  }
};

exports.getAllNotes = async (req, res, next) => {
  const { notesCollection } = req.app.locals;

  try {
    // find all Notes
    const result = await notesCollection.find().sort({_id:-1}).toArray();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;

  try {
    // find Notes based on id
    const result = await notesCollection.findOne({ _id: ObjectId(req.params.id) });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;
  const { title, note } = req.body;

  try {
    if (!title) {
      throw new Error('title is missing');
    }
    // update data collection
    const result = await notesCollection.updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { title, note } }
    );

    console.log(result);

    res.status(200).json('Data successfully updated');
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;

  try {
    // delete data collection
    const result = await notesCollection.deleteOne({ _id: ObjectId(req.params.id) });
    console.log(result);
    res.status(200).json('Data successfully deleted');
  } catch (error) {
    next(error);
  }
};
