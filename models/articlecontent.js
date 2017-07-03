var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleContentSchema = new Schema(
  {
    articleID:      { type: Schema.ObjectId, ref: 'Article' },
    content:       { type: String },
    create_at: { type: Date, default: Date.now }

  }
);

var ArticleContent = mongoose.model('ArticleContent', ArticleContentSchema);

module.exports = ArticleContent;
