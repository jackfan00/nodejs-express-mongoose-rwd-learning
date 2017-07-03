var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myrwdapp_mongnDB');

module.exports = mongoose;
