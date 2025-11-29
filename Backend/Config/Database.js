const mongoose=require("mongoose")
function Database(){
    try{
         mongoose.connect(process.env.DB_LOCAL_URI).then(()=>{
            console.log("MOGODB CONNECTED");
            
         })
    }
    catch(err){
        console.log(err);
        
    }
}

module.exports=Database