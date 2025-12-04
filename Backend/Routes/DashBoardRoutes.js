const express=require("express")
const router=express.Router()
const getDashboardData=require("../Controller/DashBoardController")
const auth=require("../Middlewares/auth")


router.get("/dashboardkpi",auth, getDashboardData)

module.exports=router;

