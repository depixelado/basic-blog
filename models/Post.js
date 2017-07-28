const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Post title required'] 
    },
    slug: { 
        type: String, 
        required: [true, 'Post slug required'] 
    },
    body: { 
        type: String, 
        required: [true, 'Post body required'] 
    },
    tags: Array,
    createdAt: Date,
    updatedAt: Date,
});

module.exports = mongoose.model('posts', PostSchema);
