const mongoose=require("mongoose")
require("dotenv").config()
const NODE_ENV=process.env.NODE_ENV
function Database(){
    try{
         mongoose.connect(process.env.DB_LOCAL_URI).then(()=>{
            console.log("server connected on", NODE_ENV)
            console.log("MOGODB CONNECTED");
            
         })

    }
    catch(err){
        console.log(err);
        
    }
}

module.exports=Database