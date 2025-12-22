
import React, { useState } from "react";
// import axios from "axios";
import { useAppLocation } from "../Context/LocationContext";
import { ExportExcel } from "../Utills/ExportExcel";
import { ImportExcel } from "../Utills/ImportExcel";
// const API_URL=import.meta.env.VITE_API_URL
import api from "../api"

// console.log(API_URL)

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;

const initialAddress = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function SupplierForm() {
  const {location,Goback} = useAppLocation();
// console.log(location)
  const [supplier, setSupplier] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    billingAddress: { ...initialAddress },
    shippingAddress: { ...initialAddress },
  });

  const [copyBilling, setCopyBilling] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file,setFile]=useState("");

  const handleChange = (path) => (e) => {
    const value = e.target.value;

    if (path.includes(".")) {
      const [parent, key] = path.split(".");
      setSupplier((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [key]: value },
      }));

      if (copyBilling && parent === "billingAddress") {
        setSupplier((prev) => ({
          ...prev,
          shippingAddress: { ...prev.shippingAddress, [key]: value },
        }));
      }
    } else {
      setSupplier((prev) => ({ ...prev, [path]: value }));
    }
  };

  const toggleCopy = (e) => {
    const checked = e.target.checked;
    setCopyBilling(checked);
    if (checked) {
      setSupplier((prev) => ({
        ...prev,
        shippingAddress: { ...prev.billingAddress },
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!supplier.name.trim()) errs.name = "Supplier name is required";
    if (supplier.email && !/^\S+@\S+\.\S+$/.test(supplier.email))
      errs.email = "Invalid email";
    if (supplier.phone && !/^[0-9]{10,13}$/.test(supplier.phone))
      errs.phone = "Invalid phone (10-13 digits)";
    if (supplier.gstin && !gstRegex.test(supplier.gstin))
      errs.gstin = "Invalid GSTIN (format mismatch)";

    if (!supplier.billingAddress.line1.trim())
      errs.billingLine1 = "Billing address line1 required";
    if (!supplier.billingAddress.city.trim()) errs.billingCity = "City required";
    if (!supplier.billingAddress.state.trim()) errs.billingState = "State required";
    if (!/^[0-9]{6}$/.test(supplier.billingAddress.pincode))
      errs.billingPincode = "Pincode must be 6 digits";

    if (!copyBilling) {
      if (!supplier.shippingAddress.line1.trim())
        errs.shippingLine1 = "Shipping address line1 required";
      if (!supplier.shippingAddress.city.trim())
        errs.shippingCity = "Shipping city required";
      if (!supplier.shippingAddress.state.trim())
        errs.shippingState = "Shipping state required";
      if (!/^[0-9]{6}$/.test(supplier.shippingAddress.pincode))
        errs.shippingPincode = "Shipping pincode must be 6 digits";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault()
  console.log("button clicked")
    setMessage("");
    // if (!validate()) return;

    setLoading(true);
    try {
      await api.post(`/api/suppliers`, supplier);
      setMessage("Supplier saved successfully");
      setSupplier({
        name: "",
        phone: "",
        email: "",
        gstin: "",
        billingAddress: { ...initialAddress },
        shippingAddress: { ...initialAddress },
      });
      setCopyBilling(false);
      setErrors({});
    } catch (err) {
      console.error(err);
      setMessage(
        err?.response?.data?.message || "Server error — could not save supplier"
      );
    } finally {
      setLoading(false);
    }
  };

 return (
  <>
    {location.pathname === "/setting/supplier" && (
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md mt-6 border"
      >
        <button
          onClick={Goback}
          type="button"
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Supplier Details
        </h2>

        <div className="space-y-6">
          {/* Supplier Name */}
          <div>
            <label className="block font-medium mb-1">Supplier Name *</label>
            <input
              value={supplier.name}
              onChange={handleChange("name")}
              placeholder="Supplier name"
              className="input-box"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              value={supplier.phone}
              onChange={handleChange("phone")}
              placeholder="10-13 digits"
              className="input-box"
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              value={supplier.email}
              onChange={handleChange("email")}
              placeholder="example@mail.com"
              className="input-box"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* GSTIN */}
          <div>
            <label className="block font-medium mb-1">GSTIN</label>
            <input
              value={supplier.gstin}
              onChange={(e) =>
                setSupplier((p) => ({ ...p, gstin: e.target.value.toUpperCase() }))
              }
              placeholder="GSTIN (15 chars)"
              maxLength={15}
              className="input-box"
            />
            {errors.gstin && <p className="error-text">{errors.gstin}</p>}
            <p className="text-sm text-gray-500">
              Format: 2-digit state code + PAN + etc. (15 chars)
            </p>
          </div>

          {/* Billing Address */}
          <fieldset className="border p-5 rounded-lg">
            <legend className="text-lg font-semibold">Billing Address</legend>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block font-medium mb-1">Address Line 1 *</label>
                <input
                  value={supplier.billingAddress.line1}
                  onChange={handleChange("billingAddress.line1")}
                  placeholder="Street / building"
                  className="input-box"
                />
                {errors.billingLine1 && (
                  <p className="error-text">{errors.billingLine1}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Address Line 2</label>
                <input
                  value={supplier.billingAddress.line2}
                  onChange={handleChange("billingAddress.line2")}
                  className="input-box"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1">City *</label>
                  <input
                    value={supplier.billingAddress.city}
                    onChange={handleChange("billingAddress.city")}
                    className="input-box"
                  />
                  {errors.billingCity && (
                    <p className="error-text">{errors.billingCity}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">State *</label>
                  <input
                    value={supplier.billingAddress.state}
                    onChange={handleChange("billingAddress.state")}
                    className="input-box"
                  />
                  {errors.billingState && (
                    <p className="error-text">{errors.billingState}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">Pincode *</label>
                  <input
                    value={supplier.billingAddress.pincode}
                    onChange={handleChange("billingAddress.pincode")}
                    maxLength={6}
                    className="input-box"
                  />
                  {errors.billingPincode && (
                    <p className="error-text">{errors.billingPincode}</p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Copy Billing Checkbox */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={copyBilling}
                onChange={toggleCopy}
                className="h-4 w-4"
              />
              <span>Shipping same as billing</span>
            </label>
          </div>

          {/* Shipping Address */}
          <fieldset className="border p-5 rounded-lg">
            <legend className="text-lg font-semibold">Shipping Address</legend>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block font-medium mb-1">Address Line 1 *</label>
                <input
                  value={supplier.shippingAddress.line1}
                  onChange={handleChange("shippingAddress.line1")}
                  className="input-box"
                  disabled={copyBilling}
                />
                {errors.shippingLine1 && (
                  <p className="error-text">{errors.shippingLine1}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Address Line 2</label>
                <input
                  value={supplier.shippingAddress.line2}
                  onChange={handleChange("shippingAddress.line2")}
                  disabled={copyBilling}
                  className="input-box"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1">City *</label>
                  <input
                    value={supplier.shippingAddress.city}
                    onChange={handleChange("shippingAddress.city")}
                    disabled={copyBilling}
                    className="input-box"
                  />
                  {errors.shippingCity && (
                    <p className="error-text">{errors.shippingCity}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">State *</label>
                  <input
                    value={supplier.shippingAddress.state}
                    onChange={handleChange("shippingAddress.state")}
                    disabled={copyBilling}
                    className="input-box"
                  />
                  {errors.shippingState && (
                    <p className="error-text">{errors.shippingState}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">Pincode *</label>
                  <input
                    value={supplier.shippingAddress.pincode}
                    onChange={handleChange("shippingAddress.pincode")}
                    maxLength={6}
                    disabled={copyBilling}
                    className="input-box"
                  />
                  {errors.shippingPincode && (
                    <p className="error-text">{errors.shippingPincode}</p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Saving..." : "Save Supplier"}
            </button>
          </div>

          {message && (
            <div className="mt-3 text-center text-green-600 font-medium">
              {message}
            </div>
          )}
        </div>
      </form>
    )}

    {/* Import Excel */}
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white shadow rounded-lg">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await ImportExcel("Supplier", file);
        }}
        className="space-y-2"
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".xlsx, .xls"
          className="block w-full border p-2 rounded-md"
        />
        <button
          type="submit"
          disabled={!file}
          className="btn-green"
        >
          Import Excel
        </button>
      </form>
    </div>

    <div className="max-w-xl mx-auto mt-4">
      <button
        onClick={() => ExportExcel("Supplier")}
        className="btn-blue"
      >
        Export
      </button>
    </div>
  </>
);

}



