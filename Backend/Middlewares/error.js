modeule.exports=(err,req,res,next)=>{
    statuscode=err.statuscode || 500;
    message=err.message ||500

    if(proccess.env.NODE_ENV==="DEVELOPMENT"){

        res.status(statuscode).json({
            success:false,
            statuscode:err.statuscode,
            message:err.message,
            stack:err.stack,
            error:err

        })
    }    



    if(process.env.NODE_ENV=="PRODUCTION"){


    let message=err.message;    
    let error={...err};

    if(err.name=="ValidationError"){
        message=Object.values(err.errors).map(value=>value.message)
        error= new Error(message,400)

    }
    if(err.name=='CastError'){
        message=`Resource not fount ${err.path}`
        error=new Error(message)
    }

    res.status(statusCode).json({
        success:false,
        message:error.message|| "internal server Error",        
    })
}
}