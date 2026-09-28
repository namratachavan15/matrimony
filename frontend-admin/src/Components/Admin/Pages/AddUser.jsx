// src/Component/Admin/AddUser.jsx - Matching Dark Blue Sidebar Theme
import React, { useState, useEffect } from "react";
import { useUserContext } from "../State/UserContext";
import { useSubcastContext } from "../State/SubcastContext";
import { useMarriageContext } from "../State/MarriageContext";
import { useEducationContext } from "../State/EducationContext";
import { useHeightContext } from "../State/HeightContext";
import { useCountryContext } from "../State/CountryContext";
import { useStateContextCustom } from "../State/StateContext";
import { useDistrictContext } from "../State/DistrictContext";
import { api } from "../../Config/api";
import { useIncomeContext } from "../State/IncomeContext";
import { useColorContext } from "../State/ColorContext";
import './AddUser.css';
import { useBloodContext } from "../State/BloodContext";

const AddUser = ({ editingUser, setEditingUser, theme: propTheme }) => {
  const { createUser, updateUser } = useUserContext();
  const { fetchEducations, educations } = useEducationContext();
  const { fetchSubcasts, subcasts } = useSubcastContext();
  const { fetchMarriages, marriages } = useMarriageContext();
  const { heights, fetchHeights } = useHeightContext();
  const { countries, fetchCountries } = useCountryContext();
  const { states, fetchStatesByCountry } = useStateContextCustom();
  const { districts, fetchDistrictsByState } = useDistrictContext();
  const { bloods, loadingBloods, bloodError, fetchBloods } = useBloodContext();
  const [casts, setCasts] = useState([]);
  const { incomes, loading, error, fetchIncomes } = useIncomeContext(); 
  const { colors, loadingColors, colorError, fetchColors } = useColorContext();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theme colors matching sidebar - Dark Blue/Navy
  const theme = propTheme || {
    primary: '#5b1730',
    primaryDark: '#421021',
    primaryLight: '#7b2946',
    secondary: '#c9a227',
    bgLight: '#fbf8f3',
    border: '#eadfd4',
    textDark: '#2f2426',
    textMuted: '#766a6d'
  };

  const initialFormData = {
    uname: "",
    umobile: "",
    altMobile: "",
    whatsappno: "",
    address: "",
    email: "",
    cnid: "",
    stid: "",
    dsid: "",
    sbeid: "",
    edid: "",
    marriageType: "",
    educationDetails: "",
    ctid: "",
    sctid: "",
    birthplace: "",
    dob: "",
    dobTime: "",
    height: "",
    weight: "",
    age: "",
    varn: "",
    gender: "",
    bloodgroup: "",
    inid: "",
    fincome: "",
    currentWork: "",
    cLocation: "",
    specs: "",
    drink: "",
    diet: "",
    smoking: "",
    dieses: "",
    diseaseDetails: "",
    otherinfo: "",
    expectation: "",
    familydetails: "",
    remark: "",
    uprofile: null,
    aadharBackPhoto: null,
    aadharFrontPhoto: null,
    upass: "",
    urole: "user",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState({
    uprofile: null,
    aadharBackPhoto: null,
    aadharFrontPhoto: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSubcasts();
    fetchEducations();
    fetchMarriages();
    fetchHeights();
    fetchCountries();
    fetchColors();
    fetchIncomes();
    fetchBloods();

    const fetchCasts = async () => {
      try {
        const { data } = await api.get("/api/admin/cast");
        setCasts(data || []);
      } catch (err) {
        console.error("Error fetching cast list:", err);
      }
    };
    fetchCasts();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        ...initialFormData,
        ...editingUser,
        ctid: editingUser.ctid ?? editingUser.cast?.ctid ?? editingUser.cacstid ?? "",
        sctid: editingUser.sctid ?? editingUser.subcast?.sctid ?? editingUser.subcacstid ?? "",
        edid: editingUser.edid ?? editingUser.education?.edid ?? editingUser.educationId ?? "",
        stid: editingUser.stid ?? "",
        dsid: editingUser.dsid ?? "",
        age: editingUser.age || "", 
        cLocation: editingUser.cLocation,
        upass: "",
      });

      if (editingUser.cnid) fetchStatesByCountry(editingUser.cnid);
      if (editingUser.stid) fetchDistrictsByState(editingUser.stid);

      const backendURL = "http://localhost:5454/";
      setPreview({
        uprofile: editingUser.uprofile
          ? `${backendURL}uploads/profile/${editingUser.uprofile}`
          : null,
        aadharBackPhoto: editingUser.aadharBackPhoto
          ? `${backendURL}uploads/aadharBack/${editingUser.aadharBackPhoto}`
          : null,
        aadharFrontPhoto: editingUser.aadharFrontPhoto
          ? `${backendURL}uploads/aadharFront/${editingUser.aadharFrontPhoto}`
          : null,
      });
    } else {
      setFormData(initialFormData);
      setPreview({
        uprofile: null,
        aadharBackPhoto: null,
        aadharFrontPhoto: null,
      });
    }
    setErrors({});
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCountryChange = (e) => {
    const cnid = e.target.value;
    setFormData((prev) => ({ ...prev, cnid, stid: "", dsid: "" }));
    setErrors((prev) => ({ ...prev, cnid: "", stid: "", dsid: "" }));
    if (cnid) fetchStatesByCountry(cnid);
  };

  const handleStateChange = (e) => {
    const stid = e.target.value;
    setFormData((prev) => ({ ...prev, stid, dsid: "" }));
    setErrors((prev) => ({ ...prev, stid: "", dsid: "" }));
    if (stid) fetchDistrictsByState(stid);
  };

const validate = () => {
  const newErrors = {};

  const isEmpty = (val) =>
    val === undefined ||
    val === null ||
    String(val).trim() === "";

  if (isEmpty(formData.uname)) {
    newErrors.uname = "Full name is required.";
  }

  if (isEmpty(formData.umobile)) {
    newErrors.umobile = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(formData.umobile)) {
    newErrors.umobile = "Enter valid 10-digit mobile number.";
  }

  if (
    !isEmpty(formData.altMobile) &&
    !/^\d{10}$/.test(formData.altMobile)
  ) {
    newErrors.altMobile = "Enter valid 10-digit mobile number.";
  }

  if (
    !isEmpty(formData.whatsappno) &&
    !/^\d{10}$/.test(formData.whatsappno)
  ) {
    newErrors.whatsappno = "Enter valid 10-digit WhatsApp number.";
  }

  if (isEmpty(formData.address)) {
    newErrors.address = "Address is required.";
  }

  if (isEmpty(formData.email)) {
    newErrors.email = "Email is required.";
  } else if (
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
  ) {
    newErrors.email = "Enter a valid email.";
  }

  if (!editingUser) {
    if (isEmpty(formData.upass)) {
      newErrors.upass = "Password is required.";
    } else if (formData.upass.length < 6) {
      newErrors.upass = "Password must be at least 6 characters.";
    }
  }

  if (isEmpty(formData.gender)) {
    newErrors.gender = "Gender is required.";
  }

  if (isEmpty(formData.cnid)) {
    newErrors.cnid = "Country is required.";
  }

  if (isEmpty(formData.stid)) {
    newErrors.stid = "State is required.";
  }

  if (isEmpty(formData.dsid)) {
    newErrors.dsid = "District is required.";
  }

  if (isEmpty(formData.ctid)) {
    newErrors.ctid = "Cast is required.";
  }

  if (isEmpty(formData.sctid)) {
    newErrors.sctid = "Subcast is required.";
  }

  if (isEmpty(formData.edid)) {
    newErrors.edid = "Education is required.";
  }

  if (isEmpty(formData.height)) {
    newErrors.height = "Height is required.";
  }

  if (isEmpty(formData.marriageType)) {
    newErrors.marriageType = "Marriage type is required.";
  }

  if (isEmpty(formData.bloodgroup)) {
    newErrors.bloodgroup = "Blood group is required.";
  }

  if (isEmpty(formData.fincome)) {
    newErrors.fincome = "Income is required.";
  }

  if (isEmpty(formData.specs)) {
    newErrors.specs = "Please select specs option.";
  }

  if (isEmpty(formData.diet)) {
    newErrors.diet = "Please select diet.";
  }

  if (isEmpty(formData.drink)) {
    newErrors.drink = "Please select drink option.";
  }

  if (isEmpty(formData.smoking)) {
    newErrors.smoking = "Please select smoking option.";
  }

  setErrors(newErrors);

  // Return both validity and errors
  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // NEVER submit before Documents tab
  if (activeTab !== "documents") {
    return;
  }

  setIsSubmitting(true);

  const validationResult = validate();

  if (!validationResult.isValid) {
    const firstErrorField = Object.keys(validationResult.errors)[0];

    if (firstErrorField) {
      const el = document.getElementsByName(firstErrorField)[0];

      if (el && el.scrollIntoView) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    setIsSubmitting(false);
    return;
  }

  try {
    if (editingUser) {
      await updateUser(editingUser.id, formData);
    } else {
      await createUser(formData);
    }

    setFormData(initialFormData);

    setPreview({
      uprofile: null,
      aadharBackPhoto: null,
      aadharFrontPhoto: null,
    });

    setErrors({});
    setEditingUser(null);
    setActiveTab("personal");

  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  const filteredSubcasts = formData.ctid && Array.isArray(subcasts)
    ? subcasts.filter((sc) => String(sc.ctid ?? sc.cacstid) === String(formData.ctid))
    : subcasts || [];

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "education", label: "Education & Work", icon: "🎓" },
    { id: "lifestyle", label: "Lifestyle", icon: "🌱" },
    { id: "documents", label: "Documents", icon: "📄" },
  ];

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <div className="py-3 px-4" style={{ background: theme.primary, color: 'white' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-semibold">
            <i className="bi bi-person-plus me-2"></i>
            {editingUser ? "Update User Profile" : "Create New User"}
          </h4>
          {editingUser && (
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={() => setEditingUser(null)}
              style={{ borderRadius: '20px' }}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to List
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-4">
        {/* Tabs - Blue Theme */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="d-flex align-items-center">
                <button
                  className={`btn btn-sm d-flex align-items-center transition-all`}
                  style={{
                    background: activeTab === tab.id ? theme.primary : 'white',
                    border: `1px solid ${activeTab === tab.id ? theme.primary : theme.border}`,
                    color: activeTab === tab.id ? 'white' : theme.textDark,
                    borderRadius: '30px',
                    padding: '8px 20px',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.borderColor = theme.primary;
                      e.currentTarget.style.background = theme.bgLight;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="me-2">{tab.icon}</span>
                  {tab.label}
                </button>
                {index < tabs.length - 1 && (
                  <div className="mx-2" style={{ color: theme.border }}>
                    <i className="bi bi-chevron-right"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="tab-content">
              <div className="row g-3">
                <div className="col-12">
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: theme.primary, borderBottomColor: theme.border }}>
                    <i className="bi bi-person-vcard me-2"></i>
                    Basic Information
                  </h5>
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Full Name *</label>
                  <input
                    type="text"
                    name="uname"
                    className={`form-control ${errors.uname ? "is-invalid" : ""}`}
                    value={formData.uname}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                  {errors.uname && <div className="invalid-feedback">{errors.uname}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Mobile No *</label>
                  <input
                    type="tel"
                    name="umobile"
                    className={`form-control ${errors.umobile ? "is-invalid" : ""}`}
                    value={formData.umobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                  />
                  {errors.umobile && <div className="invalid-feedback">{errors.umobile}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>
                    Password {editingUser ? "(leave blank to keep)" : "*"}
                  </label>
                  <input
                    type="password"
                    name="upass"
                    className={`form-control ${errors.upass ? "is-invalid" : ""}`}
                    value={formData.upass}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                  />
                  {errors.upass && <div className="invalid-feedback">{errors.upass}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Gender *</label>
                  <select
                    name="gender"
                    className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Birth Time *</label>
                  <input
                    type="time"
                    name="dobTime"
                    className={`form-control ${errors.dobTime ? "is-invalid" : ""}`}
                    value={formData.dobTime}
                    onChange={handleChange}
                  />
                  {errors.dobTime && <div className="invalid-feedback">{errors.dobTime}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Birth Place *</label>
                  <input
                    type="text"
                    name="birthplace"
                    className={`form-control ${errors.birthplace ? "is-invalid" : ""}`}
                    value={formData.birthplace}
                    onChange={handleChange}
                    placeholder="Enter birth place"
                  />
                  {errors.birthplace && <div className="invalid-feedback">{errors.birthplace}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Age *</label>
                  <input
                    type="number"
                    name="age"
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                  />
                  {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                </div>

                <div className="col-12 mt-4">
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: theme.primary, borderBottomColor: theme.border }}>
                    <i className="bi bi-geo-alt me-2"></i>
                    Location Information
                  </h5>
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Country *</label>
                  <select
                    name="cnid"
                    className={`form-control ${errors.cnid ? "is-invalid" : ""}`}
                    value={formData.cnid}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>{c.country}</option>
                    ))}
                  </select>
                  {errors.cnid && <div className="invalid-feedback">{errors.cnid}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>State *</label>
                  <select
                    name="stid"
                    className={`form-control ${errors.stid ? "is-invalid" : ""}`}
                    value={formData.stid}
                    onChange={handleStateChange}
                    disabled={!formData.cnid}
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>{s.state}</option>
                    ))}
                  </select>
                  {errors.stid && <div className="invalid-feedback">{errors.stid}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>District *</label>
                  <select
                    name="dsid"
                    className={`form-control ${errors.dsid ? "is-invalid" : ""}`}
                    value={formData.dsid}
                    onChange={handleChange}
                    disabled={!formData.stid}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.district}</option>
                    ))}
                  </select>
                  {errors.dsid && <div className="invalid-feedback">{errors.dsid}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Address *</label>
                  <textarea
                    name="address"
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter complete address"
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                <div className="col-12 mt-4">
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: theme.primary, borderBottomColor: theme.border }}>
                    <i className="bi bi-people me-2"></i>
                    Community Information
                  </h5>
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Cast *</label>
                  <select
                    name="ctid"
                    className={`form-control ${errors.ctid ? "is-invalid" : ""}`}
                    value={formData.ctid}
                    onChange={handleChange}
                  >
                    <option value="">Select Cast</option>
                    {casts.map((cast) => (
                      <option key={cast.id ?? cast.ctid} value={cast.id ?? cast.ctid}>
                        {cast.cast ?? cast.castName ?? cast.name}
                      </option>
                    ))}
                  </select>
                  {errors.ctid && <div className="invalid-feedback">{errors.ctid}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>SubCast *</label>
                  <select
                    name="sctid"
                    className={`form-control ${errors.sctid ? "is-invalid" : ""}`}
                    value={formData.sctid}
                    onChange={handleChange}
                  >
                    <option value="">Select SubCast</option>
                    {filteredSubcasts.map((subcast, idx) => (
                      <option
                        key={subcast.sctid ?? subcast.id ?? idx}
                        value={subcast.sctid ?? subcast.id}
                      >
                        {subcast.subcastName ?? subcast.name ?? subcast.subcast}
                      </option>
                    ))}
                  </select>
                  {errors.sctid && <div className="invalid-feedback">{errors.sctid}</div>}
                </div>

                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Varn *</label>
                  <select
                    name="varn"
                    className={`form-control ${errors.varn ? "is-invalid" : ""}`}
                    value={formData.varn}
                    onChange={handleChange}
                  >
                    <option value="">Select Varn</option>
                    {!loadingColors && !colorError && colors.map((clr) => (
                      <option key={clr.id} value={clr.color}>
                        {clr.color}
                      </option>
                    ))}
                  </select>
                  {errors.varn && <div className="invalid-feedback">{errors.varn}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Education & Work Tab */}
          {activeTab === "education" && (
            <div className="tab-content">
              <div className="row g-3">
                <div className="col-12">
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: theme.primary, borderBottomColor: theme.border }}>
                    <i className="bi bi-book me-2"></i>
                    Education Details
                  </h5>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Education Level *</label>
                  <select
                    name="edid"
                    className={`form-control ${errors.edid ? "is-invalid" : ""}`}
                    value={formData.edid}
                    onChange={handleChange}
                  >
                    <option value="">Select Education</option>
                    {educations.map((edu, idx) => (
                      <option key={edu.edid ?? edu.id ?? idx} value={edu.edid ?? edu.id}>
                        {edu.educationName ?? edu.name ?? edu.education}
                      </option>
                    ))}
                  </select>
                  {errors.edid && <div className="invalid-feedback">{errors.edid}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Education Details *</label>
                  <input
                    type="text"
                    name="educationDetails"
                    className={`form-control ${errors.educationDetails ? "is-invalid" : ""}`}
                    value={formData.educationDetails}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech Computer Science"
                  />
                  {errors.educationDetails && <div className="invalid-feedback">{errors.educationDetails}</div>}
                </div>

                <div className="col-12 mt-4">
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: theme.primary, borderBottomColor: theme.border }}>
                    <i className="bi bi-briefcase me-2"></i>
                    Professional Information
                  </h5>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Current Work *</label>
                  <input
                    type="text"
                    name="currentWork"
                    className={`form-control ${errors.currentWork ? "is-invalid" : ""}`}
                    value={formData.currentWork}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer"
                  />
                  {errors.currentWork && <div className="invalid-feedback">{errors.currentWork}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Work Location *</label>
                  <input
                    type="text"
                    name="cLocation"
                    className={`form-control ${errors.cLocation ? "is-invalid" : ""}`}
                    value={formData.cLocation}
                    onChange={handleChange}
                    placeholder="e.g., Bangalore, India"
                  />
                  {errors.cLocation && <div className="invalid-feedback">{errors.cLocation}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Annual Income *</label>
                  <select
                    name="fincome"
                    className={`form-control ${errors.fincome ? "is-invalid" : ""}`}
                    value={formData.fincome}
                    onChange={handleChange}
                  >
                    <option value="">Select Income Range</option>
                    {!loading && !error && incomes.map((income) => (
                      <option key={income.id} value={income.income}>
                        {income.income}
                      </option>
                    ))}
                  </select>
                  {errors.fincome && <div className="invalid-feedback">{errors.fincome}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Marriage Type *</label>
                  <select
                    name="marriageType"
                    className={`form-control ${errors.marriageType ? "is-invalid" : ""}`}
                    value={formData.marriageType}
                    onChange={handleChange}
                  >
                    <option value="">Select Marriage Type</option>
                    {marriages.map((m) => (
                      <option key={m.id} value={m.marriage}>
                        {m.marriage}
                      </option>
                    ))}
                  </select>
                  {errors.marriageType && <div className="invalid-feedback">{errors.marriageType}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Lifestyle Tab */}
          {activeTab === "lifestyle" && (
            <div className="tab-content">
              <div className="row g-3">
                <div className="col-12">
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: theme.primary, borderBottomColor: theme.border }}>
                    <i className="bi bi-heart me-2"></i>
                    Lifestyle & Preferences
                  </h5>
                </div>

                <div className="col-md-6 col-lg-3">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Diet *</label>
                  <select
                    name="diet"
                    className={`form-control ${errors.diet ? "is-invalid" : ""}`}
                    value={formData.diet}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                  </select>
                  {errors.diet && <div className="invalid-feedback">{errors.diet}</div>}
                </div>

                <div className="col-md-6 col-lg-3">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Smoking *</label>
                  <select
                    name="smoking"
                    className={`form-control ${errors.smoking ? "is-invalid" : ""}`}
                    value={formData.smoking}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {errors.smoking && <div className="invalid-feedback">{errors.smoking}</div>}
                </div>

                <div className="col-md-6 col-lg-3">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Drink *</label>
                  <select
                    name="drink"
                    className={`form-control ${errors.drink ? "is-invalid" : ""}`}
                    value={formData.drink}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {errors.drink && <div className="invalid-feedback">{errors.drink}</div>}
                </div>

                <div className="col-md-6 col-lg-3">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Spectacles *</label>
                  <select
                    name="specs"
                    className={`form-control ${errors.specs ? "is-invalid" : ""}`}
                    value={formData.specs}
                    onChange={handleChange}
                  >
                    <option value="">Choose...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {errors.specs && <div className="invalid-feedback">{errors.specs}</div>}
                </div>

                <div className="col-12 mt-4">
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: theme.primary, borderBottomColor: theme.border }}>
                    <i className="bi bi-heart-pulse me-2"></i>
                    Health Information
                  </h5>
                </div>

                <div className="col-md-6 col-lg-3">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Blood Group *</label>
                  <select
                    name="bloodgroup"
                    className={`form-control ${errors.bloodgroup ? "is-invalid" : ""}`}
                    value={formData.bloodgroup}
                    onChange={handleChange}
                  >
                    <option value="">Select Blood Group</option>
                    {!loadingBloods && !bloodError && bloods.map((b) => (
                      <option key={b.id} value={b.blood}>
                        {b.blood}
                      </option>
                    ))}
                  </select>
                  {errors.bloodgroup && <div className="invalid-feedback">{errors.bloodgroup}</div>}
                </div>

                <div className="col-md-6 col-lg-3">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Height *</label>
                  <select
                    name="height"
                    className={`form-control ${errors.height ? "is-invalid" : ""}`}
                    value={formData.height}
                    onChange={handleChange}
                  >
                    <option value="">Select Height</option>
                    {heights.map((h) => (
                      <option key={h.id} value={h.height}>{h.height}</option>
                    ))}
                  </select>
                  {errors.height && <div className="invalid-feedback">{errors.height}</div>}
                </div>

                <div className="col-md-6 col-lg-3">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Weight *</label>
                  <input
                    type="text"
                    name="weight"
                    className={`form-control ${errors.weight ? "is-invalid" : ""}`}
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="in kg"
                  />
                  {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                </div>

                <div className="col-md-6 col-lg-3">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Select Diseases</label>
                  <select
                    name="dieses"
                    className={`form-control ${errors.dieses ? "is-invalid" : ""}`}
                    value={formData.dieses}
                    onChange={handleChange}
                  >
                    <option value="">Any</option>
                    <option value="none">No Disease</option>
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                  </select>
                  {errors.dieses && <div className="invalid-feedback">{errors.dieses}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Disease Details</label>
                  <input
                    type="text"
                    name="diseaseDetails"
                    className={`form-control ${errors.diseaseDetails ? "is-invalid" : ""}`}
                    value={formData.diseaseDetails}
                    onChange={handleChange}
                    placeholder="Describe if any disease"
                  />
                  {errors.diseaseDetails && <div className="invalid-feedback">{errors.diseaseDetails}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Expectation</label>
                  <textarea
                    name="expectation"
                    className="form-control"
                    rows="3"
                    value={formData.expectation}
                    onChange={handleChange}
                    placeholder="Enter expectations"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Family Details</label>
                  <textarea
                    name="familydetails"
                    className="form-control"
                    rows="3"
                    value={formData.familydetails}
                    onChange={handleChange}
                    placeholder="Enter family details"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="tab-content">
              <div className="row g-4">
                <div className="col-12">
                  <h5 className="mb-3 border-bottom pb-2" style={{ color: theme.primary, borderBottomColor: theme.border }}>
                    <i className="bi bi-cloud-upload me-2"></i>
                    Upload Documents
                  </h5>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border" style={{ borderColor: theme.border, borderRadius: '12px' }}>
                    <div className="card-body text-center">
                      <div className="mb-3">
                        <i className="bi bi-person-circle display-4" style={{ color: theme.primary }}></i>
                      </div>
                      <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Profile Photo</label>
                      <input
                        type="file"
                        name="uprofile"
                        className="form-control"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {preview.uprofile && (
                        <div className="mt-3">
                          <img
                            src={preview.uprofile}
                            alt="Profile Preview"
                            className="img-thumbnail rounded-circle"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border" style={{ borderColor: theme.border, borderRadius: '12px' }}>
                    <div className="card-body text-center">
                      <div className="mb-3">
                        <i className="bi bi-credit-card display-4" style={{ color: theme.primary }}></i>
                      </div>
                      <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Aadhaar Front</label>
                      <input
                        type="file"
                        name="aadharFrontPhoto"
                        className="form-control"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                      />
                      {preview.aadharFrontPhoto && (
                        <div className="mt-3">
                          <img
                            src={preview.aadharFrontPhoto}
                            alt="Aadhaar Front Preview"
                            className="img-thumbnail"
                            style={{ width: "120px", height: "80px", objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border" style={{ borderColor: theme.border, borderRadius: '12px' }}>
                    <div className="card-body text-center">
                      <div className="mb-3">
                        <i className="bi bi-credit-card-2-back display-4" style={{ color: theme.primary }}></i>
                      </div>
                      <label className="form-label fw-semibold" style={{ color: theme.textDark }}>Aadhaar Back</label>
                      <input
                        type="file"
                        name="aadharBackPhoto"
                        className="form-control"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                      />
                      {preview.aadharBackPhoto && (
                        <div className="mt-3">
                          <img
                            src={preview.aadharBackPhoto}
                            alt="Aadhaar Back Preview"
                            className="img-thumbnail"
                            style={{ width: "120px", height: "80px", objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4 pt-3 border-top" style={{ borderTopColor: theme.border }}>
            <button
              type="button"
              className="btn px-4"
              style={{
                background: 'white',
                border: `1px solid ${theme.border}`,
                color: theme.textDark,
                borderRadius: '30px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.bgLight;
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = theme.border;
              }}
              onClick={() => {
                const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
              }}
              disabled={activeTab === "personal"}
            >
              <i className="bi bi-arrow-left me-2"></i> Previous
            </button>

            <div>
              {activeTab !== "documents" ? (
  <button
    type="button"
    className="btn px-4"
    style={{
      background: theme.primary,
      border: "none",
      color: "white",
      borderRadius: "30px",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = theme.primaryDark;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = theme.primary;
    }}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();

      const currentIndex = tabs.findIndex(
        (tab) => tab.id === activeTab
      );

      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      }
    }}
  >
    Next <i className="bi bi-arrow-right ms-2"></i>
  </button>
) : (
  <button
    type="submit"
    className="btn px-4"
    disabled={isSubmitting}
    style={{
      background: theme.primary,
      border: "none",
      color: "white",
      borderRadius: "30px",
    }}
  >
    {isSubmitting ? (
      <>
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
        ></span>

        {editingUser ? "Updating..." : "Creating..."}
      </>
    ) : (
      <>
        <i className="bi bi-check-lg me-2"></i>
        {editingUser ? "Update User" : "Create User"}
      </>
    )}
  </button>
)}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;