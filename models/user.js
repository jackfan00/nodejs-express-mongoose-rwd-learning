var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema(
  {
    displayname:      { type: String },
    login:     { type: String, require: true },
    passwd:    { type: String, require: true },
    email:     { type: String },
    age:       { type: Number },
    books:     [{ type: Schema.ObjectId, ref: 'Book' }],
    booksreadstatus: [{ type: Number }],
    coins:     { type: Number, default: 5000 },
    tickets:   { type: Number, default: 10 },
    viewhistory: [{ type: Schema.ObjectId, ref: 'Book' }],
    author:    { type: Schema.ObjectId, ref: 'Author', default: 0 },
    create_at: { type: Date, default: Date.now }

  }
);

var User = mongoose.model('User', UserSchema);

module.exports = User;
