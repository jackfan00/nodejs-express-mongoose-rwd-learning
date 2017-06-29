var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuthorSchema = new Schema(
  {
    penname:      { type: String },
    books:     [{ type: Schema.ObjectId, ref: 'Book' }],
    create_at: { type: Date, default: Date.now }

  }
);

var Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
