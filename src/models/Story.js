"module.exports = {};" 
const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema);
