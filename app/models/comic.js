var mongoose = require('mongoose');

// schema
var comicSchema = mongoose.Schema({
	// Immutable information
    title: String,			// Main comic title
    description: String,	// Describes the comic theme or concept
    tags: String,           // Tags ... list of Strings (e.g. "Funny,Sad,Happy")
    creatorID: String,			// Sole creator
    contributors: {},

    // Mutable 
    chapters: Array			// Array of images or chapters
});

// create the model
module.exports = mongoose.model('Comic', comicSchema);

