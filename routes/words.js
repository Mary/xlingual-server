const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');


const Word = require('../models/wordModel');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

///////////// Get List belonging to User
router.get('/my-list', jwtAuth, (req, res, next) => {
    Word.find({ user_Id: req.user.id })
        .sort({ updatedAt: 'desc' })
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        });
});
//////////// Get Global words
router.get('/global', jwtAuth, (req, res, next) => {

    Word.find({ global: true })
        .sort({ createdAt: 'desc' })
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        })
})

////////////// Browse Languages
router.get('/browse/:language', jwtAuth, (req, res, next) => {

    Word.find({ language: req.params.language, global: true })
        .sort({ createdAt: 'desc' }).limit(10)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        })
})


////////////// Create Word
router.post('/', [jwtAuth, jsonParser], (req, res, next) => {
    const { name, language, definition, global } = req.body;
    const user_Id = req.user.id;

    if (!name || !language) {
        const err = new Error('Missing `name` or `language` in request body');
        err.status = 400;
        return next(err);
    }


    const newWord = { name, language, definition, global, user_Id };
    return Word.create(newWord)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            next(err);
        });
});


//////// Delete Word
router.delete('/delete/:id', jwtAuth, (req, res, next) => {
    const { id } = req.params;
    const user_Id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('The `id` is not valid');
        err.status = 400;
        return next(err);
    }

    Word.findOneAndRemove({ _id: id, user_Id })
        .then(() => {
            res.sendStatus(204);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;