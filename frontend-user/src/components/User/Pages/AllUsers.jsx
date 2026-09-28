// // src/Components/Admin/Pages/AllUsers.jsx
// import React, { useState, useMemo, useEffect } from "react";
// import { useUserContext } from "../State/UserContext";
// import ProfileModal from "./ProfileModal";
// import "./AllUsers.css";
// import { useFamilyContext } from "../State/FamilyContext";
// import { useOtherInfoContext } from "../State/OtherInfoContext";

// // Icons
// import {
//   FaHeart,
//   FaUser,
//   FaCalendarAlt,
//   FaGraduationCap,
//   FaMoneyBillWave,
//   FaSearch,
//   FaFilter,
// } from "react-icons/fa";
// import { HiUserGroup, HiLocationMarker } from "react-icons/hi";

// // Context imports
// import { useCastContext } from "../State/CastContext";
// import { useSubcastContext } from "../State/SubcastContext";
// import { useGanContext } from "../State/GanContext";
// import { useGotraContext } from "../State/GotraContext";
// import { useNadiContext } from "../State/NadiContext";
// import { useNakshtraContext } from "../State/NakshtraContext";
// import { useRashiContext } from "../State/RashiContext";
// import { useFilterContext } from "../State/FilterContext";

// const AllUsers = () => {
//   const { users, loading, currentUser } = useUserContext();
//   const { fetchFamilyByUserId } = useFamilyContext();
//   const { fetchOtherInfoByUserId } = useOtherInfoContext();

//   const { cast: casts, fetchCasts } = useCastContext();
//   const { subcasts, fetchSubcasts } = useSubcastContext();
//   const { gans, fetchGans } = useGanContext();
//   const { gotras, fetchGotras } = useGotraContext();
//   const { nadis, fetchNadis } = useNadiContext();
//   const { nakshtras, fetchNakshtras } = useNakshtraContext();
//   const { rashis, fetchRashis } = useRashiContext();

//   const backendURL = "http://localhost:5454/";

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showProfile, setShowProfile] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("newest");

//   const { filters } = useFilterContext(); // 👈 get current filters from context

//   // Turn this ON/OFF to see logs in console
//   const debugFilters = true;

//   // ---------- load master lists ----------
//   useEffect(() => {
//     fetchCasts();
//     fetchSubcasts();
//     fetchGans();
//     fetchGotras();
//     fetchNadis();
//     fetchNakshtras();
//     fetchRashis();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---------- helpers ----------
//   const formatDateTime = (jdate) => {
//     if (!jdate) return { date: "N/A", time: "" };
//     try {
//       const d = new Date(jdate);
//       const date = d.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });
//       const time = d.toLocaleTimeString("en-IN", {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//       return { date, time };
//     } catch (e) {
//       return { date: "N/A", time: "" };
//     }
//   };

//   const getCasteName = (user) => {
//     const ctid = user.ctid;
//     if (!ctid || !Array.isArray(casts) || casts.length === 0) {
//       return "Not specified";
//     }
//     const castObj = casts.find((c) => String(c.id) === String(ctid));
//     if (!castObj) return "Not specified";
//     return castObj.cast || castObj.castName || castObj.name || "Not specified";
//   };

//   const getSubcastName = (user) => {
//     const sctid = user.sctid;
//     if (!sctid || !Array.isArray(subcasts) || subcasts.length === 0) {
//       return "Not specified";
//     }
//     const sub = subcasts.find(
//       (sc) => String(sc.sctid ?? sc.id) === String(sctid)
//     );
//     if (!sub) return "Not specified";
//     return sub.subcastName || sub.subcast || sub.name || "Not specified";
//   };

//   // 🔹 FILTER AND SORT USERS
//   const filteredUsers = useMemo(() => {
//     if (!users || users.length === 0) return [];

//     let filtered = [...users];
//     const f = filters || {};

//     if (debugFilters) {
//       console.log("========== FILTER DEBUG START ==========");
//       console.log("Total users:", users.length);
//       console.log("Current filters object:", f);
//     }

//     // 1) Gender filter (exclude same gender as currentUser)
//     if (currentUser && currentUser.gender) {
//       const before = filtered.length;
//       filtered = filtered.filter(
//         (u) =>
//           u.gender &&
//           u.gender.toLowerCase() !== currentUser.gender.toLowerCase()
//       );
//       if (debugFilters) {
//         console.log(
//           `Gender filter (exclude ${currentUser.gender}) -> ${before} -> ${filtered.length}`
//         );
//       }
//     }

//     // 2) Birth year range filter
//     if (f.fromBirthYear || f.toBirthYear) {
//       const before = filtered.length;
//       if (debugFilters) {
//         console.log("---- BIRTH YEAR FILTER ----");
//         console.log("fromBirthYear:", f.fromBirthYear);
//         console.log("toBirthYear:", f.toBirthYear);
//         console.log(
//           "Sample user dob:",
//           filtered.slice(0, 10).map((u) => ({
//             id: u.id,
//             dob: u.dob,
//           }))
//         );
//       }

//       filtered = filtered.filter((u) => {
//         if (!u.dob) return false;
//         const year = new Date(u.dob).getFullYear();
//         const from = f.fromBirthYear ? Number(f.fromBirthYear) : null;
//         const to = f.toBirthYear ? Number(f.toBirthYear) : null;

//         if (from && year < from) return false;
//         if (to && year > to) return false;
//         return true;
//       });

//       if (debugFilters) {
//         console.log(`Birth year filter result: ${before} -> ${filtered.length}`);
//       }
//     }

//     // 3) INCOME FILTER – exact string match for now
//   // 3) INCOME FILTER – map label to numeric range and compare
// if (f.income) {
//   const before = filtered.length;

//   if (debugFilters) {
//     console.log("---- INCOME FILTER ----");
//     console.log("Selected income (filter):", f.income);
//     console.log(
//       "Sample user incomes:",
//       filtered.slice(0, 10).map((u) => ({
//         id: u.id,
//         fincome: u.fincome,
//       }))
//     );
//   }

//   // 🔹 map selected label (Marathi) to yearly range
//   const mapIncomeLabelToRange = (label) => {
//     const val = (label || "").trim();

//     if (val === "5 लाख पर्यंत") {
//       return { min: 0, max: 500000 };
//     }
//     if (val === "5 ते 10 लाख वार्षिक") {
//       return { min: 500000, max: 1000000 };
//     }
//     if (val === "10 ते 15 लाख वार्षिक") {
//       return { min: 1000000, max: 1500000 };
//     }
//     if (val === "15 लाख पेक्षा जास्त") {
//       return { min: 1500000, max: Infinity };
//     }

//     // fallback: no range
//     return null;
//   };

//   const range = mapIncomeLabelToRange(f.income);

//   const normalizeUserIncome = (str) => {
//     if (!str) return null;
//     const s = str.toString().trim().toLowerCase();

//     // pure number like "100000"
//     if (/^\d+(\.\d+)?$/.test(s)) {
//       return Number(s);
//     }

//     // patterns from your logs:
//     // "3-5L" / "3-5l"
//     if (s.includes("3-5l")) return 400000; // middle of 3–5L
//     // "5L+" / "5l+"
//     if (s.includes("5l+")) return 600000; // assume >5L

//     return null;
//   };

//   filtered = filtered.filter((u) => {
//     const raw = u.fincome ? u.fincome.toString() : "";
//     const userIncomeNum = normalizeUserIncome(raw);

//     if (debugFilters) {
//       console.log(
//         `Income compare -> user[id=${u.id}] fincome="${raw}" -> num=${userIncomeNum}, range=`,
//         range
//       );
//     }

//     if (!range || userIncomeNum == null) return false;

//     return userIncomeNum >= range.min && userIncomeNum <= range.max;
//   });

//   if (debugFilters) {
//     console.log(`Income filter result: ${before} -> ${filtered.length}`);
//   }
// }


//     // 4) EDUCATION FILTER
//     if (f.education) {
//       const before = filtered.length;

//       if (debugFilters) {
//         console.log("---- EDUCATION FILTER ----");
//         console.log("Selected education (filter):", f.education);
//         console.log(
//           "Sample user educationDetails:",
//           filtered.slice(0, 10).map((u) => ({
//             id: u.id,
//             educationDetails: u.educationDetails,
//           }))
//         );
//       }

//       filtered = filtered.filter((u) => {
//         const userEdu = u.educationDetails
//           ? u.educationDetails.toLowerCase().trim()
//           : "";
//         const filterEdu = String(f.education).toLowerCase().trim();

//         if (debugFilters) {
//           console.log(
//             `Compare education -> user[id=${u.id}] educationDetails="${userEdu}" vs selected="${filterEdu}"`
//           );
//         }

//         return userEdu === filterEdu;
//       });

//       if (debugFilters) {
//         console.log(
//           `Education filter result: ${before} -> ${filtered.length}`
//         );
//       }
//     }

//     // 5) CAST FILTER
//     if (f.cast) {
//       const before = filtered.length;

//       if (debugFilters) {
//         console.log("---- CAST FILTER ----");
//         console.log("Selected cast (filter):", f.cast);
//         console.log(
//           "Sample user cast values:",
//           filtered.slice(0, 10).map((u) => ({
//             id: u.id,
//             ctid: u.ctid,
//             castNameFromHelper: getCasteName(u),
//           }))
//         );
//       }

//       filtered = filtered.filter((u) => {
//         const userCast = getCasteName(u).toLowerCase().trim();
//         const filterCast = String(f.cast).toLowerCase().trim();

//         if (debugFilters) {
//           console.log(
//             `Compare cast -> user[id=${u.id}] cast="${userCast}" vs selected="${filterCast}"`
//           );
//         }

//         return userCast === filterCast;
//       });

//       if (debugFilters) {
//         console.log(`Cast filter result: ${before} -> ${filtered.length}`);
//       }
//     }

//     // 6) SUBCAST FILTER
//     if (f.subcast) {
//       const before = filtered.length;

//       if (debugFilters) {
//         console.log("---- SUBCAST FILTER ----");
//         console.log("Selected subcast (filter):", f.subcast);
//         console.log(
//           "Sample user subcast values:",
//           filtered.slice(0, 10).map((u) => ({
//             id: u.id,
//             sctid: u.sctid,
//             subcastFromHelper: getSubcastName(u),
//           }))
//         );
//       }

//       filtered = filtered.filter((u) => {
//         const userSubcast = getSubcastName(u).toLowerCase().trim();
//         const filterSubcast = String(f.subcast).toLowerCase().trim();

//         if (debugFilters) {
//           console.log(
//             `Compare subcast -> user[id=${u.id}] subcast="${userSubcast}" vs selected="${filterSubcast}"`
//           );
//         }

//         return userSubcast === filterSubcast;
//       });

//       if (debugFilters) {
//         console.log(
//           `Subcast filter result: ${before} -> ${filtered.length}`
//         );
//       }
//     }

//     // 7) DISEASE FILTER
//     if (f.disease) {
//       const before = filtered.length;

//       if (debugFilters) {
//         console.log("---- DISEASE FILTER ----");
//         console.log("Selected disease (filter):", f.disease);
//         console.log(
//           "Sample user diseaseStatus:",
//           filtered.slice(0, 10).map((u) => ({
//             id: u.id,
//             diseaseStatus: u.diseaseStatus,
//           }))
//         );
//       }

//       filtered = filtered.filter((u) => {
//         const d = (u.diseaseStatus || "").toLowerCase().trim();
//         const filterDisease = f.disease.toLowerCase().trim();

//         if (debugFilters) {
//           console.log(
//             `Compare disease -> user[id=${u.id}] diseaseStatus="${d}" vs selected="${filterDisease}"`
//           );
//         }

//         if (filterDisease === "none") return d === "none";
//         if (filterDisease === "minor") return d === "minor";
//         if (filterDisease === "major") return d === "major";
//         return true;
//       });

//       if (debugFilters) {
//         console.log(
//           `Disease filter result: ${before} -> ${filtered.length}`
//         );
//       }
//     }

//     // 8) MARRIAGE TYPE FILTER
//     if (f.marriageType) {
//       const before = filtered.length;

//       if (debugFilters) {
//         console.log("---- MARRIAGE TYPE FILTER ----");
//         console.log("Selected marriageType (filter):", f.marriageType);
//         console.log(
//           "Sample user marriageType:",
//           filtered.slice(0, 10).map((u) => ({
//             id: u.id,
//             marriageType: u.marriageType,
//           }))
//         );
//       }

//       filtered = filtered.filter((u) => {
//         const userMarriage = u.marriageType
//           ? u.marriageType.toLowerCase().trim()
//           : "";
//         const filterMarriage = String(f.marriageType).toLowerCase().trim();

//         if (debugFilters) {
//           console.log(
//             `Compare marriageType -> user[id=${u.id}]="${userMarriage}" vs selected="${filterMarriage}"`
//           );
//         }

//         return userMarriage === filterMarriage;
//       });

//       if (debugFilters) {
//         console.log(
//           `MarriageType filter result: ${before} -> ${filtered.length}`
//         );
//       }
//     }

//     // 9) WORK COUNTRY FILTER
//     if (f.workCountry) {
//       const before = filtered.length;

//       if (debugFilters) {
//         console.log("---- WORK COUNTRY FILTER ----");
//         console.log("Selected workCountry (filter):", f.workCountry);
//         console.log(
//           "Sample user workCountry:",
//           filtered.slice(0, 10).map((u) => ({
//             id: u.id,
//             workCountry: u.workCountry,
//           }))
//         );
//       }

//       filtered = filtered.filter((u) => {
//         const userCountry = u.workCountry
//           ? u.workCountry.toLowerCase().trim()
//           : "";
//         const filterCountry = String(f.workCountry).toLowerCase().trim();

//         if (debugFilters) {
//           console.log(
//             `Compare workCountry -> user[id=${u.id}]="${userCountry}" vs selected="${filterCountry}"`
//           );
//         }

//         return userCountry === filterCountry;
//       });

//       if (debugFilters) {
//         console.log(
//           `WorkCountry filter result: ${before} -> ${filtered.length}`
//         );
//       }
//     }

//     // 🔍 10) SEARCH TERM FILTER
//     if (searchTerm) {
//       const before = filtered.length;
//       const term = searchTerm.toLowerCase().trim();

//       if (debugFilters) {
//         console.log("---- SEARCH FILTER ----");
//         console.log("Search term:", term);
//       }

//       filtered = filtered.filter((user) => {
//         const name = user.uname?.toLowerCase() || "";
//         const edu = user.educationDetails?.toLowerCase() || "";
//         const caste = getCasteName(user)?.toLowerCase() || "";
//         const income = user.fincome?.toLowerCase() || "";
//         return (
//           name.includes(term) ||
//           edu.includes(term) ||
//           caste.includes(term) ||
//           income.includes(term)
//         );
//       });

//       if (debugFilters) {
//         console.log(`Search filter result: ${before} -> ${filtered.length}`);
//       }
//     }

//     // 11) SORTING
//     const beforeSort = filtered.length;
//     switch (sortBy) {
//       case "newest":
//         filtered.sort((a, b) => new Date(b.jdate) - new Date(a.jdate));
//         break;
//       case "oldest":
//         filtered.sort((a, b) => new Date(a.jdate) - new Date(b.jdate));
//         break;
//       case "ageAsc":
//         filtered.sort((a, b) => (a.age || 0) - (b.age || 0));
//         break;
//       case "ageDesc":
//         filtered.sort((a, b) => (b.age || 0) - (a.age || 0));
//         break;
//       default:
//         break;
//     }
//     if (debugFilters) {
//       console.log(
//         `Sorting (${sortBy}) – items before & after sort: ${beforeSort} -> ${filtered.length}`
//       );
//       console.log("FINAL FILTERED USER COUNT:", filtered.length);
//       console.log("========== FILTER DEBUG END ==========\n");
//     }

//     return filtered;
//   }, [users, currentUser, searchTerm, sortBy, casts, subcasts, filters, debugFilters]);

//   // open/close modal
//   const openProfile = async (user) => {
//     const userId = Number(user.id);

//     let family = null;
//     let other = null;

//     try {
//       family = await fetchFamilyByUserId(userId);
//     } catch (e) {
//       family = null;
//     }
//     try {
//       other = await fetchOtherInfoByUserId(userId);
//     } catch (e) {
//       other = null;
//     }

//     setSelectedUser({ ...user, family, other });
//     setShowProfile(true);
//   };

//   const closeProfile = () => {
//     setShowProfile(false);
//     setSelectedUser(null);
//   };

//   // ---------- render ----------
//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading profiles...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="all-users-container">
//       {/* Header Section */}
//       <div className="all-users-header">
//         <div className="header-background">
//           <div className="header-content">
//             <h1 className="main-title">Find Your Perfect Match</h1>
//             <p className="subtitle">
//               Discover compatible profiles tailored for you
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Search and Filter Section */}
//       <div className="search-filter-section">
//         <div className="container">
//           <div className="search-filter-grid">
//             {/* Search Box */}
//             <div className="search-box">
//               <FaSearch className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search by name, education, caste, or income..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </div>

//             {/* Sort Dropdown */}
//             <div className="sort-dropdown">
//               <FaFilter className="filter-icon" />
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="sort-select"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//                 <option value="ageAsc">Age: Low to High</option>
//                 <option value="ageDesc">Age: High to Low</option>
//               </select>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="results-count">
//             <span className="count-badge">{filteredUsers.length}</span>
//             <span>profiles found</span>
//           </div>
//         </div>
//       </div>

//       {/* Users Grid */}
//       <div className="container users-grid-container">
//         {!filteredUsers || filteredUsers.length === 0 ? (
//           <div className="no-results">
//             <div className="no-results-icon">💫</div>
//             <h3>No profiles found</h3>
//             <p>
//               Try adjusting your search criteria or check back later for new
//               profiles.
//             </p>
//           </div>
//         ) : (
//           <div className="users-grid">
//             {filteredUsers.map((user) => {
//               const photoUrl = user.uprofile
//                 ? user.uprofile.startsWith("http")
//                   ? user.uprofile
//                   : `${backendURL}uploads/profile/${user.uprofile}`
//                 : "/default-user.png";

//               const { date } = formatDateTime(user.jdate);

//               return (
//                 <div key={user.id} className="user-card">
//                   {/* Profile Image with Overlay */}
//                   <div className="card-image-section">
//                     <img
//                       src={photoUrl}
//                       alt={user.uname}
//                       className="user-image"
//                     />
//                     <div className="image-overlay">
//                       <div className="profile-badge">
//                         Profile ID: {user.id}
//                       </div>
//                       <div className="action-buttons">
//                         <button className="heart-btn">
//                           <FaHeart />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card Content */}
//                   <div className="card-content">
//                     {/* Name and Basic Info */}
//                     <div className="user-main-info">
//                       <h3 className="user-name">{user.uname}</h3>
//                       <div className="age-height">
//                         <span className="age">
//                           {user.age || "N/A"} Years
//                         </span>
//                         <span className="divider">•</span>
//                         <span className="height">{user.height}</span>
//                       </div>
//                     </div>

//                     {/* Details Grid */}
//                     <div className="details-grid">
//                       <div className="detail-item">
//                         <FaGraduationCap className="detail-icon" />
//                         <span className="detail-text">
//                           {user.educationDetails || "Not specified"}
//                         </span>
//                       </div>

//                       <div className="detail-item">
//                         <HiUserGroup className="detail-icon" />
//                         <span className="detail-text">
//                           {getCasteName(user)}
//                         </span>
//                       </div>

//                       <div className="detail-item">
//                         <FaUser className="detail-icon" />
//                         <span className="detail-text">
//                           {getSubcastName(user)}
//                         </span>
//                       </div>

//                       <div className="detail-item">
//                         <FaMoneyBillWave className="detail-icon" />
//                         <span className="detail-text">
//                           {user.fincome || "Not specified"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Location and Join Date */}
//                     <div className="meta-info">
//                       {user.cLocation && (
//                         <div className="meta-item">
//                           <HiLocationMarker className="meta-icon" />
//                           <span>{user.cLocation}</span>
//                         </div>
//                       )}
//                       <div className="meta-item">
//                         <FaCalendarAlt className="meta-icon" />
//                         <span>Joined {date}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Button */}
//                   <div className="card-actions">
//                     <button
//                       className="view-profile-btn"
//                       onClick={() => openProfile(user)}
//                     >
//                       <FaHeart className="btn-icon" />
//                       View Full Profile
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* PROFILE MODAL */}
//       {showProfile && selectedUser && (
//         <ProfileModal
//           user={selectedUser}
//           backendURL={backendURL}
//           onClose={closeProfile}
//           casts={casts}
//           subcasts={subcasts}
//           gans={gans}
//           gotras={gotras}
//           nadis={nadis}
//           nakshtras={nakshtras}
//           rashis={rashis}
//         />
//       )}
//     </div>
//   );
// };

// export default AllUsers;


// src/Components/Admin/Pages/AllUsers.jsx
// src/Components/Admin/Pages/AllUsers.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useUserContext } from "../State/UserContext";
import ProfileModal from "./ProfileModal";
import "./AllUsers.css";
import { useFamilyContext } from "../State/FamilyContext";
import { useOtherInfoContext } from "../State/OtherInfoContext";

// Icons
import {
  FaHeart,
  FaUser,
  FaCalendarAlt,
  FaGraduationCap,
  FaMoneyBillWave,
  FaSearch,
  FaFilter,
  FaRulerVertical,
  FaStar,
  FaRegStar,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { HiUserGroup, HiLocationMarker } from "react-icons/hi";
import { useToast } from "../Components/Toast/ToastContext";
import { interestService } from "../Services/interestService";
import { shortlistService } from "../Services/shortlistService";
import { blockService } from "../Services/blockService";

// Context imports
import { useCastContext } from "../State/CastContext";
import { useSubcastContext } from "../State/SubcastContext";
import { useGanContext } from "../State/GanContext";
import { useGotraContext } from "../State/GotraContext";
import { useNadiContext } from "../State/NadiContext";
import { useNakshtraContext } from "../State/NakshtraContext";
import { useRashiContext } from "../State/RashiContext";
import { useFilterContext } from "../State/FilterContext";
import axios from "axios";
import { api } from "../Config/api";
import MembershipCard from "../Components/MembershipCard";

const AllUsers = () => {
  const { users, loading, currentUser,incrementViewCount } = useUserContext();
  const { fetchFamilyByUserId } = useFamilyContext();
  const { fetchOtherInfoByUserId } = useOtherInfoContext();

  const { cast: casts, fetchCasts } = useCastContext();
  const { subcasts, fetchSubcasts } = useSubcastContext();
  const { gans, fetchGans } = useGanContext();
  const { gotras, fetchGotras } = useGotraContext();
  const { nadis, fetchNadis } = useNadiContext();
  const { nakshtras, fetchNakshtras } = useNakshtraContext();
  const { rashis, fetchRashis } = useRashiContext();

  const backendURL = "http://localhost:5454/";

  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // ⭐ New state for likes
  const [likedUserIds, setLikedUserIds] = useState(new Set());
  const [blockedUserIds, setBlockedUserIds] = useState(new Set());

  // ⭐ Shortlist + Express Interest state
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [interestStatusMap, setInterestStatusMap] = useState({}); // { [otherUserId]: "PENDING"|"ACCEPTED"|"DECLINED" }
  const toast = useToast();

  const { filters } = useFilterContext(); // 👈 get current filters from context

  // Turn this ON/OFF to see logs in console
  const debugFilters = true;

  // ---------- load master lists ----------
  useEffect(() => {
    fetchCasts();
    fetchSubcasts();
    fetchGans();
    fetchGotras();
    fetchNadis();
    fetchNakshtras();
    fetchRashis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⭐ Load liked users for current user
  useEffect(() => {
    const fetchLikedUsers = async () => {
      if (!currentUser || !currentUser.id) return;

      try {
        // Identity is now derived server-side from the JWT (see api.jsx),
        // so we no longer send userId as a query param.
        const res = await api.get("/api/likes/my-liked");
        // res.data => array of liked user IDs
        setLikedUserIds(new Set(res.data || []));
      } catch (error) {
        console.error("Error fetching liked users:", error);
      }
    };

    fetchLikedUsers();
  }, [currentUser]);

  // ⭐ Load blocked-user ids (Part 7): used to hide blocked profiles from
  // search/browse results below, either direction.
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      if (!currentUser || !currentUser.id) return;
      try {
        const res = await blockService.getMyBlockedIds();
        setBlockedUserIds(new Set(res.data || []));
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };

    fetchBlockedUsers();
  }, [currentUser]);

  // ⭐ Load shortlist ids + sent-interest status map for current user
  useEffect(() => {
    const loadShortlistAndInterests = async () => {
      if (!currentUser || !currentUser.id) return;
      try {
        const res = await shortlistService.getMyIds();
        setShortlistedIds(new Set(res.data || []));
      } catch (error) {
        console.error("Error fetching shortlist:", error);
      }
      try {
        const res = await interestService.getSentStatusMap();
        setInterestStatusMap(res.data || {});
      } catch (error) {
        console.error("Error fetching interest status map:", error);
      }
    };
    loadShortlistAndInterests();
  }, [currentUser]);

  // ⭐ Shortlist toggle handler
  const handleShortlistToggle = async (profileUserId) => {
    if (!currentUser || !currentUser.id) {
      toast.info("Please login to shortlist profiles.");
      return;
    }
    try {
      const res = await shortlistService.toggle(profileUserId);
      const nowShortlisted = res.data;
      setShortlistedIds((prev) => {
        const next = new Set(prev);
        if (nowShortlisted) next.add(profileUserId);
        else next.delete(profileUserId);
        return next;
      });
      toast.success(nowShortlisted ? "Added to shortlist." : "Removed from shortlist.");
    } catch (error) {
      console.error("Error toggling shortlist:", error);
      toast.error("Could not update shortlist. Please try again.");
    }
  };

  // ⭐ Express Interest handler
  const handleExpressInterest = async (profileUserId) => {
    if (!currentUser || !currentUser.id) {
      toast.info("Please login to express interest.");
      return;
    }
    if (currentUser.id === profileUserId) {
      toast.info("You cannot express interest in your own profile.");
      return;
    }
    const existingStatus = interestStatusMap[profileUserId];
    if (existingStatus === "PENDING") {
      toast.info("Interest already sent — waiting for a response.");
      return;
    }
    if (existingStatus === "ACCEPTED") {
      toast.info("You're already matched with this profile!");
      return;
    }
    try {
      await interestService.send(profileUserId);
      setInterestStatusMap((prev) => ({ ...prev, [profileUserId]: "PENDING" }));
      toast.success("Interest expressed successfully!");
    } catch (error) {
      const detail = error?.response?.data;
      if (error?.response?.status === 409 && detail?.detail) {
        // Backend says an interest already exists in some state -- sync local state to it.
        const status = String(detail.detail).split(":").pop();
        setInterestStatusMap((prev) => ({ ...prev, [profileUserId]: status }));
        toast.info(`Interest is already ${status.toLowerCase()}.`);
      } else {
        console.error("Error sending interest:", error);
        toast.error("Could not send interest. Please try again.");
      }
    }
  };

  // ---------- helpers ----------
  const formatDateTime = (jdate) => {
    if (!jdate) return { date: "N/A", time: "" };
    try {
      const d = new Date(jdate);
      const date = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const time = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { date, time };
    } catch (e) {
      return { date: "N/A", time: "" };
    }
  };

  const getCasteName = (user) => {
    const ctid = user.ctid;
    if (!ctid || !Array.isArray(casts) || casts.length === 0) {
      return "Not specified";
    }
    const castObj = casts.find((c) => String(c.id) === String(ctid));
    if (!castObj) return "Not specified";
    return castObj.cast || castObj.castName || castObj.name || "Not specified";
  };

  const getSubcastName = (user) => {
    const sctid = user.sctid;
    if (!sctid || !Array.isArray(subcasts) || subcasts.length === 0) {
      return "Not specified";
    }
    const sub = subcasts.find(
      (sc) => String(sc.sctid ?? sc.id) === String(sctid)
    );
    if (!sub) return "Not specified";
    return sub.subcastName || sub.subcast || sub.name || "Not specified";
  };

  // ⭐ Like toggle handler
  const handleLikeToggle = async (profileUserId) => {
    if (!currentUser || !currentUser.id) {
      toast.info("Please login to like profiles.");
      return;
    }

    try {
      const res = await api.post(
        "/api/likes/toggle",
        null,
        {
          params: {
            likedUserId: profileUserId,
          },
        }
      );

      const nowLiked = res.data; // true = liked, false = unliked

      setLikedUserIds((prev) => {
        const newSet = new Set(prev);
        if (nowLiked) {
          newSet.add(profileUserId);
        } else {
          newSet.delete(profileUserId);
        }
        return newSet;
      });
      toast.success(nowLiked ? "Profile liked." : "Like removed.");
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Could not update like. Please try again.");
    }
  };

  // 🔹 FILTER AND SORT USERS
  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];

    let filtered = [...users];
    const f = filters || {};

    // 0) Blocked-profile exclusion (Part 7): never show a profile the current
    // user has blocked in search/browse results. (Whether the other user has
    // blocked *me* is intentionally not exposed to the client -- that side is
    // enforced server-side wherever it matters, e.g. BlockService.isBlockedEitherWay
    // inside InterestServiceImpl, so a blocked user still can't interact even
    // if their card happens to be visible.)
    if (blockedUserIds && blockedUserIds.size > 0) {
      filtered = filtered.filter((u) => !blockedUserIds.has(u.id));
    }

    if (debugFilters) {
      console.log("========== FILTER DEBUG START ==========");
      console.log("Total users:", users.length);
      console.log("Current filters object:", f);
    }

    // 1) Gender filter (show opposite gender only, standard matrimony matching)
    if (currentUser && currentUser.gender) {
      const myGender = currentUser.gender.toLowerCase();

      filtered = filtered.filter((u) => {
        if (!u.gender) return false;

        if (u.id === currentUser.id) return false;

        // Bug fix: this used to keep only SAME-gender profiles (=== myGender),
        // which is backwards for a matrimony platform and meant almost every
        // search silently had nothing to match against. Now correctly shows
        // the opposite gender.
        return u.gender.toLowerCase() !== myGender;
      });
    }

    // 2) Birth year range filter (robust version)
    if (f.fromBirthYear || f.toBirthYear) {
      const before = filtered.length;

      if (debugFilters) {
        console.log("---- BIRTH YEAR FILTER ----");
        console.log("fromBirthYear:", f.fromBirthYear);
        console.log("toBirthYear:", f.toBirthYear);
        console.log(
          "Sample user dob:",
          filtered.slice(0, 10).map((u) => ({
            id: u.id,
            dob: u.dob,
          }))
        );
      }

      const from = f.fromBirthYear ? parseInt(f.fromBirthYear, 10) : null;
      const to = f.toBirthYear ? parseInt(f.toBirthYear, 10) : null;

      filtered = filtered.filter((u) => {
        if (!u.dob) return false;

        const dobStr = String(u.dob);
        const year = parseInt(dobStr.substring(0, 4), 10);

        if (debugFilters) {
          console.log(
            `User ${u.id} -> dob="${u.dob}", year=${year}, from=${from}, to=${to}`
          );
        }

        if (isNaN(year)) return false;

        if (from !== null && year < from) return false;
        if (to !== null && year > to) return false;

        return true;
      });

      if (debugFilters) {
        console.log(`Birth year filter result: ${before} -> ${filtered.length}`);
      }
    }

    // 3) HEIGHT FILTER (range from heights table)
    if (f.height) {
      const before = filtered.length;

      if (debugFilters) {
        console.log("---- HEIGHT FILTER ----");
        console.log("Selected height range (filter):", f.height);
        console.log(
          "Sample user heights:",
          filtered.slice(0, 10).map((u) => ({
            id: u.id,
            height: u.height,
          }))
        );
      }

      const rangeStr = String(f.height);
      const nums = rangeStr.match(/[\d.]+/g); // ['5.0','5.5']

      let minH = null;
      let maxH = null;

      if (nums && nums.length >= 1) {
        minH = parseFloat(nums[0]);
        if (nums.length >= 2) {
          maxH = parseFloat(nums[1]);
        }
      }

      if (debugFilters) {
        console.log("Parsed height range:", { minH, maxH });
      }

      if (minH !== null || maxH !== null) {
        filtered = filtered.filter((u) => {
          if (!u.height) return false;

          const userHeight = parseFloat(String(u.height));

          if (isNaN(userHeight)) return false;

          if (debugFilters) {
            console.log(
              `User[id=${u.id}] height=${userHeight}, range=[${minH}, ${maxH}]`
            );
          }

          if (minH !== null && userHeight < minH) return false;
          if (maxH !== null && userHeight > maxH) return false;

          return true;
        });
      }

      if (debugFilters) {
        console.log(`Height filter result: ${before} -> ${filtered.length}`);
      }
    }

    // 5) CAST FILTER
    if (f.cast) {
      const before = filtered.length;

      if (debugFilters) {
        console.log("---- CAST FILTER ----");
        console.log("Selected cast (filter):", f.cast);
        console.log(
          "Sample user cast values:",
          filtered.slice(0, 10).map((u) => ({
            id: u.id,
            ctid: u.ctid,
            castNameFromHelper: getCasteName(u),
          }))
        );
      }

      filtered = filtered.filter((u) => {
        const userCast = getCasteName(u).toLowerCase().trim();
        const filterCast = String(f.cast).toLowerCase().trim();

        if (debugFilters) {
          console.log(
            `Compare cast -> user[id=${u.id}] cast="${userCast}" vs selected="${filterCast}"`
          );
        }

        return userCast === filterCast;
      });

      if (debugFilters) {
        console.log(`Cast filter result: ${before} -> ${filtered.length}`);
      }
    }

    // 6) SUBCAST FILTER
    if (f.subcast) {
      const before = filtered.length;

      if (debugFilters) {
        console.log("---- SUBCAST FILTER ----");
        console.log("Selected subcast (filter):", f.subcast);
        console.log(
          "Sample user subcast values:",
          filtered.slice(0, 10).map((u) => ({
            id: u.id,
            sctid: u.sctid,
            subcastFromHelper: getSubcastName(u),
          }))
        );
      }

      filtered = filtered.filter((u) => {
        const userSubcast = getSubcastName(u).toLowerCase().trim();
        const filterSubcast = String(f.subcast).toLowerCase().trim();

        if (debugFilters) {
          console.log(
            `Compare subcast -> user[id=${u.id}] subcast="${userSubcast}" vs selected="${filterSubcast}"`
          );
        }

        return userSubcast === filterSubcast;
      });

      if (debugFilters) {
        console.log(
          `Subcast filter result: ${before} -> ${filtered.length}`
        );
      }
    }

    // 7) DISEASE FILTER
    if (f.disease) {
      const before = filtered.length;

      if (debugFilters) {
        console.log("---- DISEASE FILTER ----");
        console.log("Selected disease (filter):", f.disease);
        console.log(
          "Sample user disease fields:",
          filtered.slice(0, 10).map((u) => ({
            id: u.id,
            dieses: u.dieses,
          }))
        );
      }

      filtered = filtered.filter((u) => {
        const d = (u.dieses || "").toLowerCase().trim();

        const filterDisease = f.disease.toLowerCase().trim();

        if (debugFilters) {
          console.log(
            `Compare disease -> user[id=${u.id}] dieses="${d}" vs selected="${filterDisease}"`
          );
        }

        if (!filterDisease) return true;

        if (filterDisease === "none") return d === "none";
        if (filterDisease === "minor") return d === "minor";
        if (filterDisease === "major") return d === "major";

        return true;
      });

      if (debugFilters) {
        console.log(`Disease filter result: ${before} -> ${filtered.length}`);
      }
    }

    // 8) MARRIAGE TYPE FILTER
    if (f.marriageType) {
      const before = filtered.length;

      if (debugFilters) {
        console.log("---- MARRIAGE TYPE FILTER ----");
        console.log("Selected marriageType (filter):", f.marriageType);
        console.log(
          "Sample user marriageType:",
          filtered.slice(0, 10).map((u) => ({
            id: u.id,
            marriageType: u.marriageType,
          }))
        );
      }

      filtered = filtered.filter((u) => {
        const userMarriage = u.marriageType
          ? u.marriageType.toLowerCase().trim()
          : "";
        const filterMarriage = String(f.marriageType).toLowerCase().trim();

        if (debugFilters) {
          console.log(
            `Compare marriageType -> user[id=${u.id}]="${userMarriage}" vs selected="${filterMarriage}"`
          );
        }

        return userMarriage === filterMarriage;
      });

      if (debugFilters) {
        console.log(
          `MarriageType filter result: ${before} -> ${filtered.length}`
        );
      }
    }

    // 9) WORK COUNTRY FILTER
    if (f.workCountry) {
      const before = filtered.length;

      if (debugFilters) {
        console.log("---- WORK COUNTRY FILTER ----");
        console.log("Selected workCountry (filter):", f.workCountry);
        console.log(
          "Sample user workCountry:",
          filtered.slice(0, 10).map((u) => ({
            id: u.id,
            workCountry: u.cLocation,
          }))
        );
      }

      filtered = filtered.filter((u) => {
        const userCountry = u.cLocation
          ? u.cLocation.toLowerCase().trim()
          : "";
        const filterCountry = String(f.workCountry).toLowerCase().trim();

        if (debugFilters) {
          console.log(
            `Compare workCountry -> user[id=${u.id}]="${userCountry}" vs selected="${filterCountry}"`
          );
        }

        return userCountry === filterCountry;
      });

      if (debugFilters) {
        console.log(
          `WorkCountry filter result: ${before} -> ${filtered.length}`
        );
      }
    }

    // 10) SEARCH TERM FILTER
    if (searchTerm) {
      const before = filtered.length;
      const term = searchTerm.toLowerCase().trim();

      if (debugFilters) {
        console.log("---- SEARCH FILTER ----");
        console.log("Search term:", term);
      }

      filtered = filtered.filter((user) => {
        const name = user.uname?.toLowerCase() || "";
        const edu = user.educationDetails?.toLowerCase() || "";
        const caste = getCasteName(user)?.toLowerCase() || "";
        const income = user.fincome?.toLowerCase() || "";
        return (
          name.includes(term) ||
          edu.includes(term) ||
          caste.includes(term) ||
          income.includes(term)
        );
      });

      if (debugFilters) {
        console.log(`Search filter result: ${before} -> ${filtered.length}`);
      }
    }

    // 11) SORTING
    const beforeSort = filtered.length;
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.jdate) - new Date(a.jdate));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.jdate) - new Date(b.jdate));
        break;
      case "ageAsc":
        filtered.sort((a, b) => (a.age || 0) - (b.age || 0));
        break;
      case "ageDesc":
        filtered.sort((a, b) => (b.age || 0) - (a.age || 0));
        break;
      default:
        break;
    }
    if (debugFilters) {
      console.log(
        `Sorting (${sortBy}) – items before & after sort: ${beforeSort} -> ${filtered.length}`
      );
      console.log("FINAL FILTERED USER COUNT:", filtered.length);
      console.log("========== FILTER DEBUG END ==========\n");
    }

    return filtered;
  }, [
    users,
    currentUser,
    searchTerm,
    sortBy,
    casts,
    subcasts,
    filters,
    debugFilters,
    blockedUserIds,
  ]);

  // open/close modal
  const openProfile = async (user) => {
    const userId = Number(user.id);
  
    // 1️⃣ Increment view count + save profile view record
    const updatedUser = await incrementViewCount(userId);
    if (!updatedUser) {
      toast.error("Unable to update view count.");
      return;
    }
  
    // 2️⃣ Check view limit
    if (updatedUser.status === 1 && updatedUser.viewcount >= updatedUser.profileViewcount) {
      toast.info("Your profile view limit is reached. Please upgrade your plan.");
      return;
    }
  
    // 3️⃣ Fetch family/other info
    let family = null;
    let other = null;
    try { family = await fetchFamilyByUserId(userId); } catch {}
    try { other = await fetchOtherInfoByUserId(userId); } catch {}
  
    // 4️⃣ Open modal
    setSelectedUser({ ...updatedUser, family, other });
    setShowProfile(true);
  };
  
  

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedUser(null);
  };

  // ---------- render ----------
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="all-users-container">
      {/* Header Section */}
      <div className="all-users-header">
        <div className="header-background">
          <div className="header-content">
            <h1 className="main-title">Find Your Perfect Match</h1>
            <p className="subtitle">
              Discover compatible profiles tailored for you
            </p>
          </div>
        </div>
      </div>

      {/* Membership summary (all values from /api/membership/current) */}
      <MembershipCard />

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="container">
          <div className="search-filter-grid">
            {/* Search Box */}
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, education, caste, or income..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown">
              <FaFilter className="filter-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="ageAsc">Age: Low to High</option>
                <option value="ageDesc">Age: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count">
            <span className="count-badge">{filteredUsers.length}</span>
            <span>profiles found</span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="container users-grid-container">
        {!filteredUsers || filteredUsers.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">💫</div>
            <h3>No profiles found</h3>
            <p>
              Try adjusting your search criteria or check back later for new
              profiles.
            </p>
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map((user) => {
              const isLiked = likedUserIds.has(user.id);
              const isShortlisted = shortlistedIds.has(user.id);
              const interestStatus = interestStatusMap[user.id]; // undefined | PENDING | ACCEPTED | DECLINED

              const photoUrl = user.uprofile
                ? user.uprofile.startsWith("http")
                  ? user.uprofile
                  : `${backendURL}uploads/profile/${user.uprofile}`
                : "/default-user.png";

              const { date } = formatDateTime(user.jdate);

              return (
                <div key={user.id} className="user-card">
                  {/* Profile Image with Overlay */}
                  <div className="card-image-section">
                    <img
                      src={photoUrl}
                      alt={user.uname}
                      className="user-image"
                    />
                  <div className="card-overlay">
    <span className="overlay-id">ID: {user.id}</span>

    <div className="overlay-btn-group">
      <button 
          type="button"
          className={`overlay-like ${isLiked ? "liked" : ""}`}
          onClick={(e) => { e.stopPropagation(); handleLikeToggle(user.id); }}
          title={isLiked ? "Unlike" : "Like"}
      >
          <FaHeart />
      </button>

      <button
          type="button"
          className={`overlay-shortlist ${isShortlisted ? "shortlisted" : ""}`}
          onClick={(e) => { e.stopPropagation(); handleShortlistToggle(user.id); }}
          title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
      >
          {isShortlisted ? <FaStar /> : <FaRegStar />}
      </button>
    </div>
</div>

                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    {/* Name and Basic Info */}
                    <div className="user-main-info">
                      <h3 className="user-name">
                        {user.uname}
                        {Number(user.vstatus) === 1 && (
                          <span className="card-verified-badge" title="Verified Profile">
                            <FaCheckCircle /> Verified
                          </span>
                        )}
                      </h3>
                      <div className="age-height">
  <span className="age">
    <FaCalendarAlt className="icon-small" /> {user.age || "N/A"} Years
  </span>
  <span className="divider">•</span>
  <span className="height">
    <FaRulerVertical className="icon-small" /> {user.height || "N/A"}
  </span>
</div>

                    </div>

                    {/* Details Grid */}
                    <div className="details-grid">
                      <div className="detail-item">
                        <FaGraduationCap className="detail-icon" />
                        <span className="detail-text">
                          {user.educationDetails || "Not specified"}
                        </span>
                      </div>

                      <div className="detail-item">
                        <HiUserGroup className="detail-icon" />
                        <span className="detail-text">
                          {getCasteName(user)}
                        </span>
                      </div>

                      <div className="detail-item">
                        <FaUser className="detail-icon" />
                        <span className="detail-text">
                          {getSubcastName(user)}
                        </span>
                      </div>

                      <div className="detail-item">
                        <FaMoneyBillWave className="detail-icon" />
                        <span className="detail-text">
                          {user.fincome || "Not specified"}
                        </span>
                      </div>
                    </div>

                    {/* Location and Join Date */}
                    <div className="meta-info">
                      {user.cLocation && (
                        <div className="meta-item">
                          <HiLocationMarker className="meta-icon" />
                          <span>{user.cLocation}</span>
                        </div>
                      )}
                      <div className="meta-item">
                        <FaCalendarAlt className="meta-icon" />
                        <span>Joined {date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions">
                    <button
                      className="view-profile-btn"
                      onClick={() => openProfile(user)}
                    >
                      <FaHeart
                        className={`btn-icon ${
                          isLiked ? "btn-icon-liked" : ""
                        }`}
                      />
                      {isLiked ? "Liked • View Profile" : "View Full Profile"}
                    </button>

                    <button
                      className={`express-interest-btn status-${(interestStatus || "none").toLowerCase()}`}
                      disabled={interestStatus === "PENDING" || interestStatus === "ACCEPTED"}
                      onClick={(e) => { e.stopPropagation(); handleExpressInterest(user.id); }}
                    >
                      {interestStatus === "PENDING" && (<><FaClock className="btn-icon" /> Interest Sent</>)}
                      {interestStatus === "ACCEPTED" && (<><FaCheckCircle className="btn-icon" /> Accepted</>)}
                      {interestStatus === "DECLINED" && (<><FaTimesCircle className="btn-icon" /> Declined</>)}
                      {!interestStatus && (<><FaPaperPlane className="btn-icon" /> Express Interest</>)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      

      {/* PROFILE MODAL */}
      {showProfile && selectedUser && (
        <ProfileModal
          user={selectedUser}
          backendURL={backendURL}
          onClose={closeProfile}
          casts={casts}
          subcasts={subcasts}
          gans={gans}
          gotras={gotras}
          nadis={nadis}
          nakshtras={nakshtras}
          rashis={rashis}
        />
      )}
    </div>
  );
};

export default AllUsers;
