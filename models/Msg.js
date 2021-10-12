const mogoose = require('mongoose')

const msgSchema = new mogoose.Schema({
    msg:{type:Array, required:true},
    // name:{type:String, required:true},
    // createdAt: {type: Date, default: Date.now}
})

module.exports = mogoose.model('Msg', msgSchema)