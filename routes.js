/* eslint-disable no-console */
const express = require('express');
const passport = require('passport');

const router = express.Router();

const { addNote, getAllNotes, getNote, updateNote, deleteNote, register, login } = require('./handler');

require('./utils/auth');

// notes
router.post('/note', passport.authenticate('jwt', { session: false }), addNote);

router.get('/notes', passport.authenticate('jwt', { session: false }), getAllNotes);

router.get('/note/:id', passport.authenticate('jwt', { session: false }), getNote);

router.put('/note/:id', passport.authenticate('jwt', { session: false }), updateNote);

router.delete('/note/:id', passport.authenticate('jwt', { session: false }), deleteNote);

// user
router.post('/register', register);

router.post('/login', login);

module.exports = router;
