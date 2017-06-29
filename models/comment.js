var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema(
  {
    user:      { type: Schema.ObjectId, ref: 'User' },
    book:      { type: Schema.ObjectId, ref: 'Book' },
    des:       { type: String },
    create_at: { type: Date, default: Date.now }

  }
);

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
