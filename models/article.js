var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleSchema = new Schema(
  {
    chaptername:      { type: String },
	chapterbooknumber: {type: Number},
	chapternumber:   {type: Number},
    bookID:      { type: Schema.ObjectId, ref: 'Book' },
    contentID:       { type: Schema.ObjectId, ref: 'ArticleContent' },
    wordcount:     { type: Number },
    mode:    { type: String, enum: ['writing', 'published', 'deleted']},
    create_at: { type: Date, default: Date.now }

  }
);

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
