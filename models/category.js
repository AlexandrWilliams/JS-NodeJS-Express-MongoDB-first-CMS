const mongoose = require('mongoose');

//Category Schema
const CategorySchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String
    }
});

module.exports = Category = mongoose.model('Category', CategorySchema);