var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myexpressapp_mongnDB');

module.exports = mongoose;
