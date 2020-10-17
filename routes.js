/* eslint-disable no-console */
const express = require('express');

const router = express.Router();

const { addNote, getAllNotes, getNote, updateNote, deleteNote } = require('./handler');

router.post('/note', addNote);

router.get('/notes', getAllNotes);

router.get('/note/:id', getNote);

router.put('/note/:id', updateNote);

router.delete('/note/:id', deleteNote);

module.exports = router;
