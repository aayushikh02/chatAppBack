var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userLoginSchema = new Schema({
  contact: { type: String, required: true },
  password: { type: String, required: true }
});

var userLogin = mongoose.model('userLogin', userLoginSchema);

module.exports = {"userLogin":userLogin}