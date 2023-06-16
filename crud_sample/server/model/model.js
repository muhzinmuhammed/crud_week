const mongoose=require('mongoose')

var schema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    isBlocked: {
        type: Boolean,
        default: false
      },
   gender:String,
   status:String,
   password:String
})


const UserDb=mongoose.model('users',schema)
module.exports=UserDb
