const mogoose = require('mongoose')

const userSchema = new mogoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    admin:{type:Boolean, default:false},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mogoose.model('User', userSchema)