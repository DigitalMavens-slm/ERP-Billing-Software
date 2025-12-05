const express=require("express")
const router=express.Router()
const getDashboardData=require("../Controller/DashBoardController")
const auth=require("../Middlewares/auth")
const companyCheck=require("../Middlewares/companyCheck")


router.get("/dashboardkpi",auth,companyCheck, getDashboardData)

module.exports=router;

