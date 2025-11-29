const mongoose=require("mongoose")

const loginSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const loginmodel=mongoose.model("LoginSignup",loginSchema)

module.exports=loginmodel