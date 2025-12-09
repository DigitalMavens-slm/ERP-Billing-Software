// import './App.css'
import LoginSignupPage from './Components/Loginsignup/LoginSignup'
import Purchase from "./Components/Purchase/PurchaseApp"
import Inventory from "./Components/Inventory/Inventory"
import Settings from './Settings/Settings'
import SupplierForm from './SupplierForm/SupplierForm'
import CustomerForm from "./Components/CustomerForm/CustomerForm"
import BrandForm from './BrandForm/BrandForm'
import CategoryForm from './Components/CategoryForm/CategoryForm'
import SubCategoryForm from './Components/SubCategory/SubCategory'
import ProductForm from './Components/ProductForm/ProductForm'
import CompanySettingsForm from './CompanySetting/CompanySetting'
import InvoiceApp from './Invoice/InvoiceApp'
import InvoiceDetails from './Invoice/InvoiceDetail'
import PaymentUpdate from './Payment/PaymentUpdate'
import CustomerLedger from './Ledger'
import AllCustomerLedger from './Ledger/AllCustomerLedger'
import Report from './Reports/Reports'

import Mainpage from "./Pages/Mainpage"
import { Route, Routes } from "react-router-dom"
import DashBoard from './DashBoard/DashBoard'
import InvoiceList from "./Invoice/InvoiceList"
import PurchaseList from './Components/Purchase/PurchaseList'
import PurchaseLedger from "./Ledger/PurchaseLedger"
import ProtectedRoute from './ProtectedRoute'
import EditPurchase from './Components/Purchase/EditPurchase'
import AssignStaff from './Components/AssignStaff'

function App() {

  return (
    <>
    <Routes>

  {/* LOGIN PAGE */}
  <Route path="/login" element={<LoginSignupPage/>} />
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Mainpage />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<DashBoard />} />
    <Route path="index" element={<Purchase />} />
    <Route path="purchaselist" element={<PurchaseList />} />
    <Route path="/purchase/:id" element={<EditPurchase />} />

    <Route path="purchaseledger" element={<PurchaseLedger />} />
    <Route path="inventory" element={<Inventory />} />

    <Route path="setting" element={<Settings />}>
      <Route path="supplier" element={<SupplierForm />} />
      <Route path="customer" element={<CustomerForm />} />
      <Route path="product" element={<ProductForm />} />
      <Route path="brand" element={<BrandForm />} />
      <Route path="category" element={<CategoryForm />} />
      <Route path="subcategory" element={<SubCategoryForm />} />
    </Route>

    <Route path="company" element={<CompanySettingsForm />} />
    <Route path="assign-staff" element={<AssignStaff />} />
    <Route path="invoicecreate" element={<InvoiceApp />} />
    <Route path="invoicelist" element={<InvoiceList />} />
    <Route path="invoice-details" element={<InvoiceDetails />} />
    <Route path="payment-updation" element={<PaymentUpdate />} />
    <Route path="ledger" element={<CustomerLedger />} />
    <Route path="allcustomerledger" element={<AllCustomerLedger />} />
    <Route path="reports" element={<Report />} />
  </Route>

</Routes>
    </>
  )
}

export default App