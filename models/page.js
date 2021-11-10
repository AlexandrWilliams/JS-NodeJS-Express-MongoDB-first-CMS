const mongoose = require('mongoose');

//Page Schema
const PageSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        require: true
    },
    sorting: {
        type: Number,
    }
});

module.exports = Page = mongoose.model('Page', PageSchema);