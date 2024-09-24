const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
