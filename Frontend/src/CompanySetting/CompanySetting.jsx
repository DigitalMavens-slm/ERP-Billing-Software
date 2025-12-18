
import React, { useState, useEffect } from "react";
import api from "../api";

export default function CompanySettingsForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    mobile1: "",
    mobile2: "",
    email: "",
    website: "",
    industry: "",
    // currentFinancialYear: "",
    // financialYearStart: "",
    // financialYearEnd: "",
    currency: "",
    gstType: "",
    compositionScheme: false,
    gstNo: "",
    panNo: "",
    address: { street: "", city: "", state: "", pincode: "" },
    bankDetails: { accountNumber: "", ifsc: "", bankName: "" },
    logoUrl: "",
    paymentUrl: "",
    extraPaymentUrl: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [extraPaymentFile, setExtraPaymentFile] = useState(null);
  const [invoiceLocked, setInvoiceLocked] = useState(false);


  const API_URL = import.meta.env.VITE_API_URL;

  // ----------------------------------------------
  // 🔥 Load Existing Company (if any)
  // ----------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/api/company-settings", { withCredentials: true });
        if (res.data) {
          setFormData(res.data);
        }
        if (res.data) {
        setFormData(res.data);

        if (res.data.invoiceStartNumber) {
          setInvoiceLocked(true); 
        }
      }
      } catch (err) {
        console.log("Error loading company:", err);
      }
    };
    loadData();
  }, []);

  // ----------------------------------------------
  // 🔥 Input Change
  // ----------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name.includes("bankDetails.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [key]: value },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ----------------------------------------------
  // 🔥 File Change
  // ----------------------------------------------
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "logoUrl") setLogoFile(files[0]);
    if (name === "paymentUrl") setPaymentFile(files[0]);
    if (name === "extraPaymentUrl") setExtraPaymentFile(files[0]);
  };

  // ----------------------------------------------
  // 🔥 Submit (ONLY POST)
  // ----------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // append simple & nested values
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "object") {
        Object.keys(formData[key]).forEach((subKey) => {
          data.append(`${key}.${subKey}`, formData[key][subKey]);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    // append files
    if (logoFile) data.append("logoUrl", logoFile);
    if (paymentFile) data.append("paymentUrl", paymentFile);
    if (extraPaymentFile) data.append("extraPaymentUrl", extraPaymentFile);

    try {
      await api.post("/api/company-settings", data, { withCredentials: true });
      alert("Company settings saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving company settings");
    }
  };

  return (
    <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          Company Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
                                           {/* invoice num handler */}
          <Section title="Invoice Settings" color="blue">
  <div className="grid md:grid-cols-2 gap-6">
  <>
  <InputField
  label="Invoice Start Number"
  placeholder="Number only Must enter"
hint={invoiceLocked ? "Locked (cannot be changed)" : "Set carefully. One-time only"}
  name="invoiceStartNumber"
  value={formData.invoiceStartNumber}
  // type="number"
  onChange={handleChange}
  disabled={invoiceLocked}
/>
</>
  
 
  </div>
         </Section>
         

          {/* BASIC */}
          <Section title="Basic Information" color="indigo">
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
              <InputField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
              <InputField label="Mobile 1" name="mobile1" value={formData.mobile1} onChange={handleChange} />
              <InputField label="Mobile 2" name="mobile2" value={formData.mobile2} onChange={handleChange} />
              <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
              <InputField label="Website" name="website" value={formData.website} onChange={handleChange} />
              <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} />
            </div>
          </Section>

          {/* ADDRESS */}
          <Section title="Address" color="green">
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Street" name="address.street" value={formData.address?.street} onChange={handleChange} />
              <InputField label="City" name="address.city" value={formData.address?.city} onChange={handleChange} />
              <InputField label="State" name="address.state" value={formData.address?.state} onChange={handleChange} />
              <InputField label="Pincode" name="address.pincode" value={formData.address?.pincode} onChange={handleChange} />
            </div>
          </Section>


          {/* BANK */}
          <Section title="Bank Details" color="orange">
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Account Number" name="bankDetails.accountNumber" value={formData.bankDetails?.accountNumber} onChange={handleChange} />
              <InputField label="IFSC" name="bankDetails.ifsc" value={formData.bankDetails?.ifsc} onChange={handleChange} />
              <InputField label="Bank Name" name="bankDetails.bankName" value={formData.bankDetails?.bankName} onChange={handleChange} />
            </div>
          </Section>

          {/* GST */}
          <Section title="GST Information" color="purple">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">GST No</label>
                <select
                  name="gstNo"
                  className="input-box"
                  value={formData.gstNo}
                  onChange={handleChange}
                >
                  <option value="UNREGISTERED">UNREGISTERED</option>
                  <option value="REGISTERED">REGISTERED</option>
                </select>
              </div>
              <InputField label="GST Type" name="gstType" value={formData.gstType} onChange={handleChange} />

              <div className="flex items-center gap-3 mt-6">
                <input type="checkbox" name="compositionScheme" checked={formData.compositionScheme} onChange={handleChange} />
                <label className="text-gray-700">Composition Scheme</label>
              </div>


              <InputField
                label="PAN Number"
                name="panNo"
                value={formData.panNo}
                disabled={formData.gstNo !== "REGISTERED"}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* UPLOADS */}
          <Section title="Uploads" color="gray">
            <div className="grid md:grid-cols-3 gap-6">
              <UploadField label="Company Logo" name="logoUrl" filePath={formData.logoUrl} API_URL={API_URL} onChange={handleFileChange} />
              <UploadField label="UPI QR" name="paymentUrl" filePath={formData.paymentUrl} API_URL={API_URL} onChange={handleFileChange} />
              <UploadField label="Extra UPI" name="extraPaymentUrl" filePath={formData.extraPaymentUrl} API_URL={API_URL} onChange={handleFileChange} />
            </div>
          </Section>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg text-lg shadow">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <section>
      <h3 className={`text-xl font-semibold text-${color}-600 mb-3 border-l-4 border-${color}-500 pl-3`}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function InputField({ label, name, value, onChange,hint, type = "text", disabled }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {hint && (
          <span className="text-xs text-red-500">
            {hint}
          </span>
        )}
      <input
        type={type}
        name={name}
        disabled={disabled}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
      />
    </div>
  );
}

function UploadField({ label, name, filePath, onChange, API_URL }) {
  return (
    <div>
      <label className="form-label">{label}</label>

      {filePath && (
        <img
          src={`${API_URL}/${filePath.replace(/\\/g, "/")}`}
          className="h-24 w-24 object-cover rounded border mb-2"
        />
      )}

      <input type="file" name={name} onChange={onChange} className="input-box" />
    </div>
  );
}
