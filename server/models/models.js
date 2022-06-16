const { Schema } = require("mongoose");

const modelUser = mongoose.model('Test', new Schema({name:String}))


modelUser.findOne(function(error, result) {

})