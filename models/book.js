var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BookSchema = new Schema(
  {
    name:      { type: String },
    coverimg:  { type: String, default: "/images/bookcover.jpg" },
    authorID:    { type: Schema.ObjectId, ref: 'Author' },
    des:       { type: String },
    category:  { type: Number },
    status:    { type: String, enum:['連載', '完本'], default: '連載'},
    articles:  [{ type: Schema.ObjectId, ref: 'Article' }],
    collectusers:     [{ type: Schema.ObjectId, ref: 'User' }],
    peoplereads:     { type: Number },
    dailyclicks:    [{ type: Date, type: Number}],
	allclicks: { type: Number },
	weekclicks: { type: Number },
	monthclicks: { type: Number },
    dailytickets:   [{ type: Date, type: Number}],
	alltickets: { type: Number },
	weektickets: { type: Number },
	monthtickets: { type: Number },
	bookwordcount: { type: Number },
    comments:  [{ type: Schema.ObjectId, ref: 'Comment' }],
    publishedupdate_at: { type: Date, default: Date.now },
    create_at: { type: Date, default: Date.now }

  }
);

var Book = mongoose.model('Book', BookSchema);

module.exports = Book;
