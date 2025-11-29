const express=require("express")
const router=express.Router()
const getDashboardData=require("../Controller/DashBoardController")


router.get("/dashboardkpi", getDashboardData)

module.exports=router;

