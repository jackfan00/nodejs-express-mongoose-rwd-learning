var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema(
  {
    displayname:      { type: String },
	headimg:     { type: String, default: "/images/user_photo_default.png" },
    username:     { type: String, require: true },
    password:    { type: String, require: true },
    email:     { type: String },
    birth_year:       { type: Number },
    birth_mon:       { type: Number },
    birth_day:       { type: Number },
	gender:       { type: Number },
    mybooks:     [{ type: Schema.ObjectId, ref: 'Book' }],
    mybooksreadstatus: [{ type: Number }],
    coins:     { type: Number, default: 5000 },
    tickets:   { type: Number, default: 10 },
    viewhistory: [{ type: Schema.ObjectId, ref: 'Book' }],
	viewhistorydate: [{type: Date}],
    author:    { type: Schema.ObjectId, ref: 'Author' },
    create_at: { type: Date, default: Date.now }

  }
);

var User = mongoose.model('User', UserSchema);

module.exports = User;
