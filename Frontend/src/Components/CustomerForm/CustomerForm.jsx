import React, { useState } from "react";
// import axios from "axios";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Landmark,
  MapPin,
  Home,
  Globe,
  Hash,
  SquareGanttChart,
} from "lucide-react";
import { useAppLocation } from "../../Context/LocationContext";
import { ExportExcel } from "../../Utills/ExportExcel";
import { ImportExcel } from "../../Utills/ImportExcel";
import api from "../../api"
// const API_URL = import.meta.env.VITE_API_URL;

const initialAddress = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CustomerForm() {
  const { location, Goback } = useAppLocation();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    billingAddress: { ...initialAddress },
    shippingAddress: { ...initialAddress },
  });

  const [copyBilling, setCopyBilling] = useState(false);
  const [animateCopy, setAnimateCopy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  const handleChange = (path) => (e) => {
    const value = e.target.value;

    if (path.includes(".")) {
      const [parent, key] = path.split(".");
      setCustomer((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [key]: value },
      }));
    } else {
      setCustomer((prev) => ({ ...prev, [path]: value }));
    }
  };

  const toggleCopy = () => {
    setCopyBilling((prev) => !prev);

    setCustomer((prev) => ({
      ...prev,
      shippingAddress: { ...prev.billingAddress },
    }));

    setAnimateCopy(true);
    setTimeout(() => setAnimateCopy(false), 900);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(`/api/customers`, customer, );

      alert("Customer Saved Successfully!");

      setCustomer({
        name: "",
        phone: "",
        email: "",
        gstin: "",
        billingAddress: { ...initialAddress },
        shippingAddress: { ...initialAddress },
      });

      setCopyBilling(false);
    } catch (err) {
      alert("Error Saving Customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {location.pathname === "/setting/customer" && (
        <div className="p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-xl shadow">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customer Details</h2>
            <button
              onClick={Goback}
              className="flex items-center text-white gap-2 bg-red-600 px-4 py-2 rounded hover:shadow"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NAME */}
              <div>
                <label className="font-semibold">Customer Name *</label>
                <div className="input-box">
                  <input
                    value={customer.name}
                    onChange={handleChange("name")}
                    placeholder="Full Name"
                  />
                  <User className="input-icon-right" size={20} />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="font-semibold">Phone</label>
                <div className="input-box">
                  <input
                    value={customer.phone}
                    onChange={handleChange("phone")}
                    placeholder="10–13 digits"
                  />
                  <Phone className="input-icon-right" size={20} />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="font-semibold">Email</label>
                <div className="input-box">
                  <input
                    value={customer.email}
                    onChange={handleChange("email")}
                    placeholder="example@mail.com"
                  />
                  <Mail className="input-icon-right" size={20} />
                </div>
              </div>

              {/* GST */}
              <div>
                <label className="font-semibold">GSTIN</label>
                <div className="input-box">
                  <input
                    value={customer.gstin}
                    maxLength={15}
                    onChange={(e) =>
                      setCustomer((prev) => ({
                        ...prev,
                        gstin: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="GST 15 Characters"
                  />
                  <SquareGanttChart className="input-icon-right" size={20} />
                </div>
              </div>
            </div>

            {/* BILLING + SHIPPING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BILLING */}
              <fieldset className="p-4 rounded-lg border space-y-4">
                <legend className="font-bold">Billing Address</legend>

                <div className="input-box">
                  <input
                    placeholder="Address Line 1"
                    value={customer.billingAddress.line1}
                    onChange={handleChange("billingAddress.line1")}
                  />
                  <Landmark className="input-icon-right" size={20} />
                </div>

                <div className="input-box">
                  <input
                    placeholder="Address Line 2"
                    value={customer.billingAddress.line2}
                    onChange={handleChange("billingAddress.line2")}
                  />
                  <Home className="input-icon-right" size={20} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="input-box">
                    <input
                      placeholder="City"
                      value={customer.billingAddress.city}
                      onChange={handleChange("billingAddress.city")}
                    />
                    <MapPin className="input-icon-right" size={10} />
                  </div>

                  <div className="input-box">
                    <input
                      placeholder="State"
                      value={customer.billingAddress.state}
                      onChange={handleChange("billingAddress.state")}
                    />
                    <Globe className="input-icon-right" size={10} />
                  </div>

                  <div className="input-box">
                    <input
                      placeholder="Pincode"
                      maxLength={6}
                      value={customer.billingAddress.pincode}
                      onChange={handleChange("billingAddress.pincode")}
                    />
                    <Hash className="input-icon-right" size={0} />
                  </div>
                </div>
              </fieldset>

              {/* SHIPPING */}
              <fieldset
                className={`p-4 rounded-lg border space-y-4 transition-all duration-300 ${
                  animateCopy ? "copy-animate" : ""
                }`}
              >
                <legend className="font-bold">Shipping Address</legend>

                <div className="input-box">
                  <input
                    placeholder="Address Line 1"
                    value={customer.shippingAddress.line1}
                    onChange={handleChange("shippingAddress.line1")}
                    disabled={copyBilling}
                  />
                  <Landmark className="input-icon-right" size={20} />
                </div>

                <div className="input-box">
                  <input
                    placeholder="Address Line 2"
                    value={customer.shippingAddress.line2}
                    onChange={handleChange("shippingAddress.line2")}
                    disabled={copyBilling}
                  />
                  <Home className="input-icon-right" size={20} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="input-box">
                    <input
                      placeholder="City"
                      value={customer.shippingAddress.city}
                      onChange={handleChange("shippingAddress.city")}
                      disabled={copyBilling}
                    />
                    <MapPin className="input-icon-right" size={20} />
                  </div>

                  <div className="input-box">
                    <input
                      placeholder="State"
                      value={customer.shippingAddress.state}
                      onChange={handleChange("shippingAddress.state")}
                      disabled={copyBilling}
                    />
                    <Globe className="input-icon-right" size={20} />
                  </div>

                  <div className="input-box">
                    <input
                      placeholder="Pincode"
                      maxLength={6}
                      value={customer.shippingAddress.pincode}
                      onChange={handleChange("shippingAddress.pincode")}
                      disabled={copyBilling}
                    />
                    <Hash className="input-icon-right" size={20} />
                  </div>
                </div>
              </fieldset>
            </div>

            {/* SAME AS BILLING */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={copyBilling}
                onChange={toggleCopy}
              />
              Same as Billing
            </label>

            {/* SUBMIT */}
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700"
              type="submit"
            >
              {loading ? "Saving..." : "Save Customer"}
            </button>
          </form>
        </div>
      )}

      {/* IMPORT EXPORT */}
      <div className="p-4 flex relative">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await ImportExcel("Customer", file);
          }}
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".xlsx,.xls"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={!file}
            className="ml-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Import Excel
          </button>
        </form>

        <button
          onClick={() => ExportExcel("Customer")}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded absolute right-0 -top-0"
        >
          Export Excel
        </button>
      </div>
    </>
  );
}
