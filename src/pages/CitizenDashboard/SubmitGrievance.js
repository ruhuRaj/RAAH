import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createGrievance as submitGrievance } from "../../services/grievanceService";
import { getAllDepartments as fetchDepartments } from "../../services/departmentService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function SubmitGrievance() {
  const { token } = useSelector((state) => state.auth);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    department: "",
    severity: "Low",
    addressText: "",
    attachments: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await fetchDepartments(token);
        setDepartments(res.departments || []);
      } catch (error) {
        toast.error("Failed to load departments");
      }
    };
    loadDepartments();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachments: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("department", formData.department);
    data.append("severity", formData.severity);

    // Important: Append both location.type and location.addressText
    data.append("addressText", formData.addressText); // required for GeoJSON

    // Append attachments
    formData.attachments.forEach((file) => {
     data.append("attachments", file);
    });


    try {
      const res = await submitGrievance(data, token);
      toast.success("Grievance submitted successfully!");
      console.log("Grievance created:", res);
      navigate("/dashboard/my-grievances");
    } catch (error) {
      toast.error(error.message || "Submission failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        📝 Submit New Grievance
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-xl p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
          <Input label="Category" name="category" value={formData.category} onChange={handleChange} required />
          <Input label="Sub-category" name="subCategory" value={formData.subCategory} onChange={handleChange} />
          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={departments.map((d) => ({ label: d.name, value: d._id }))}
            required
          />
          <Select
            label="Severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            options={[
              { label: "Low", value: "Low" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" },
              { label: "Critical", value: "Critical" },
            ]}
          />
          <Input label="Location (*Please add detailed location)" name="addressText" value={formData.addressText} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Images, Videos, PDFs)</label>
          <input
            type="file"
            name="attachments"
            accept="image/*,video/*,application/pdf"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          🚀 Submit Grievance
        </button>
      </form>
    </div>
  );
}

const Input = ({ label, name, value, onChange, required = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border border-gray-300 rounded-md px-4 py-2"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options, required = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border border-gray-300 rounded-md px-4 py-2"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SubmitGrievance;
