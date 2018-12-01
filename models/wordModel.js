'use strict';
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    language: { type: String, required: true },
    definition: [{ type: String }],
    global: { type: Boolean },
    user_Id: { type: mongoose.Schema.Types.ObjectId 

    }
});

wordSchema.set('timestamps', true);

wordSchema.set ('toJSON', {
    virtuals: true,
    transform: (doc, result) => {
        delete result.__v;
        delete result._id;
    }
});

module.exports = mongoose.model('Word', wordSchema);