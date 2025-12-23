const express=require("express")
const app=express()
const path=require("path")
const dotenv=require("dotenv")
const cors = require("cors")
const cookieParser=require("cookie-parser")
const ConnectDB=require("./Config/Database")
const LoginRoutes=require("./Routes/LoginRoutes")
const SalesRoutes=require("./Routes/SalesRoutes")
const EmployeeRoutes=require("./Routes/EmployeeRoutes")
const InventoryRoutes=require("./Routes/InventoryRoutes")

const FinanceRoutes=require("./Routes/FinanceRoutes")

//       Setting Routes
const SupplierRoutes=require("./Routes/SupplierRouts")
const SubCategoryRoutes=require("./Routes/SubCategoryRoutes")
const BrandRoutes=require("./Routes/BrandRoutes")
const ProductFormRoutes=require('./Routes/ProductFormRoutes')
const CustomerRoutes=require("./Routes/CustomerRoutes")
const PaymentRoutes=require("./Routes/PaymentRoutes")
const LedgerRoutes=require("./Routes/LedgerRoutes")
const PurchaseRoutes=require("./Routes/PurchaseRoutes")
const PurchasePaymentRoutes=require("./Routes/PurchasePaymentRoutes")
const ReportsRoutes=require("./Routes/ReportsRoutes")
const DashBoardRoutes=require("./Routes/DashBoardRoutes")
const getUserRoute = require("./Routes/getUserRoute")
const logoutRoute = require("./Routes/logoutRoute")
const CompanySetting=require("./Routes/CompanysettingRoutes")
const assignStaffRoute = require("./Routes/assignStaffRoute")
const financialYear=require("./Middlewares/financialYear")
dotenv.config()


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://erp.digitalmavens.tech"
  ],
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.options("*", cors());


app.use(express.json());
app.use(cookieParser());
app.use(financialYear)


// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     // "https://erp-billing-software-12.onrender.com"   
//     "https://erp.digitalmavens.tech"
//   ],
//   credentials: true
// }));




app.use('/uploads', express.static('uploads'));

app.use("/api",LoginRoutes)
app.use("/api",SalesRoutes)
app.use("/api",EmployeeRoutes)
app.use("/api",InventoryRoutes)
app.use("/api",FinanceRoutes)


//   setting use
app.use("/api",CustomerRoutes)
app.use("/api",SupplierRoutes)
app.use("/api",SubCategoryRoutes)
app.use("/api",require("./Routes/CategoryRoutes"))
app.use("/api",BrandRoutes)
app.use("/api",ProductFormRoutes)
app.use('/api', CompanySetting);


app.use("/api",DashBoardRoutes)
app.use("/api",PaymentRoutes)
app.use("/api",LedgerRoutes)
app.use("/api",require("./Routes/InvoiceCreateRoutes"))
app.use("/api",ReportsRoutes)

app.use("/api",PurchaseRoutes)
app.use("/api",PurchasePaymentRoutes)

        // Export   and  import  Excel Route
// app.use("/api",require("./Routes/BrandRoutes"))
// app.use("/api",require("./Routes/CategoryRoutes"))
// app.use("/api",require("./Routes/SupplierRouts"))
// app.use("/api",require("./Routes/CustomerRoutes"))


//         invoice num Genrator routs
app.use("/api", require("./InvoiceGenrator/InvoiceCounter"));

app.use("/api", require("./Routes/checkAuthRoute"))
app.use("/api", getUserRoute)
app.use("/api", logoutRoute)
app.use("/api", assignStaffRoute)




app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`);
    ConnectDB()
    
})