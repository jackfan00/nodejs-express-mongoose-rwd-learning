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
    collectusers:     { type: Number , default:0},
    peoplereads:     [{ type: Schema.ObjectId, ref: 'User' }],
    dailyclicks:    [ {day:{ type: Date}, clicks:{type: Number}} ],
	allclicks: { type: Number, default:0 },
    dailytickets:   [{day:{ type: Date}, tickets:{type: Number}}],
	alltickets: { type: Number, default:0 },
	bookwordcount: { type: Number, default:0 },
    comments:  [{ type: Schema.ObjectId, ref: 'Comment' }],
    publishedupdate_at: { type: Date, default: Date.now },
    create_at: { type: Date, default: Date.now }

  }
);

var Book = mongoose.model('Book', BookSchema);

module.exports = Book;
