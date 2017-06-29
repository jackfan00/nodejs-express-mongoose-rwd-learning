var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleSchema = new Schema(
  {
    chaptername:      { type: String },
    book:      { type: Schema.ObjectId, ref: 'Book' },
    des:       { type: String },
    words:     { type: Number },
    status:    { type: String, enum: ['draft', 'published', 'deleted']},
    create_at: { type: Date, default: Date.now }

  }
);

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
