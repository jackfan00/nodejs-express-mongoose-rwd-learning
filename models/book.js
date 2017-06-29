var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BookSchema = new Schema(
  {
    name:      { type: String },
    coverimg:  { type: String },
    author:    { type: Schema.ObjectId, ref: 'User' },
    des:       { type: String },
    category:  { type: Number },
    status:    { type: String, enum:['continue', 'complete']},
    articles:  [{ type: Schema.ObjectId, ref: 'Article' }],
    users:     [{ type: Schema.ObjectId, ref: 'User' }],
    reads:     { type: Number },
    clicks:    [{ type: Date, type: Number}],
    tickets:   [{ type: Date, type: Number}],
    comments:  [{ type: Schema.ObjectId, ref: 'Comment' }],
    publishedupdate_at: { type: Date, default: Date.now },
    create_at: { type: Date, default: Date.now }

  }
);

var Book = mongoose.model('Book', BookSchema);

module.exports = Book;
