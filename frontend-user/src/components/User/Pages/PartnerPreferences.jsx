import React, { useEffect, useState } from "react";
import { FaHeart, FaSave, FaUndo, FaRulerVertical, FaGraduationCap, FaBriefcase, FaMoneyBillWave, FaMapMarkerAlt } from "react-icons/fa";
import { partnerPreferenceService } from "../Services/partnerPreferenceService";
import { useEducationContext } from "../State/EducationContext";
import { useMarriageContext } from "../State/MarriageContext";
import { useToast } from "../Components/Toast/ToastContext";
import "./PartnerPreferences.css";

const emptyPrefs = {
  ageMin: "",
  ageMax: "",
  heightMin: "",
  heightMax: "",
  educationIds: [],
  occupation: "",
  incomeMin: "",
  preferredLocation: "",
  maritalStatus: "",
  lifestylePreferences: "",
  familyPreferences: "",
};

const PartnerPreferences = () => {
  const toast = useToast();
  const { educations, fetchEducations } = useEducationContext();
  const { marriages, fetchMarriages } = useMarriageContext();

  const [prefs, setPrefs] = useState(emptyPrefs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEducations?.();
    fetchMarriages?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await partnerPreferenceService.getMy();
        const d = res.data || {};
        setPrefs({
          ageMin: d.ageMin ?? "",
          ageMax: d.ageMax ?? "",
          heightMin: d.heightMin ?? "",
          heightMax: d.heightMax ?? "",
          educationIds: d.educationIds ? Array.from(d.educationIds) : [],
          occupation: d.occupation ?? "",
          incomeMin: d.incomeMin ?? "",
          preferredLocation: d.preferredLocation ?? "",
          maritalStatus: d.maritalStatus ?? "",
          lifestylePreferences: d.lifestylePreferences ?? "",
          familyPreferences: d.familyPreferences ?? "",
        });
      } catch (e) {
        toast.error("Could not load your partner preferences.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (field, value) => setPrefs((p) => ({ ...p, [field]: value }));

  const toggleEducation = (id) => {
    setPrefs((p) => {
      const has = p.educationIds.includes(id);
      return {
        ...p,
        educationIds: has ? p.educationIds.filter((x) => x !== id) : [...p.educationIds, id],
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...prefs,
        ageMin: prefs.ageMin === "" ? null : Number(prefs.ageMin),
        ageMax: prefs.ageMax === "" ? null : Number(prefs.ageMax),
        incomeMin: prefs.incomeMin === "" ? null : Number(prefs.incomeMin),
      };
      const res = await partnerPreferenceService.update(payload);
      const d = res.data || {};
      setPrefs((p) => ({ ...p, educationIds: d.educationIds ? Array.from(d.educationIds) : p.educationIds }));
      toast.success("Partner preferences saved.");
    } catch (e) {
      toast.error("Could not save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      await partnerPreferenceService.reset();
      setPrefs(emptyPrefs);
      toast.info("Partner preferences reset.");
    } catch (e) {
      toast.error("Could not reset your preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pp-page">
        <div className="pp-skeleton" />
      </div>
    );
  }

  return (
    <div className="pp-page">
      <div className="pp-header">
        <FaHeart className="pp-header-icon" />
        <div>
          <h1>Partner Preferences</h1>
          <p>Tell us what you're looking for -- this powers your Recommended Matches.</p>
        </div>
      </div>

      <div className="pp-card">
        <h2>Age &amp; Height</h2>
        <div className="pp-grid-2">
          <div>
            <label>Age Min</label>
            <input type="number" min="18" value={prefs.ageMin} onChange={(e) => set("ageMin", e.target.value)} />
          </div>
          <div>
            <label>Age Max</label>
            <input type="number" min="18" value={prefs.ageMax} onChange={(e) => set("ageMax", e.target.value)} />
          </div>
          <div>
            <label><FaRulerVertical /> Height Min</label>
            <input type="text" placeholder={`e.g. 5'0"`} value={prefs.heightMin} onChange={(e) => set("heightMin", e.target.value)} />
          </div>
          <div>
            <label><FaRulerVertical /> Height Max</label>
            <input type="text" placeholder={`e.g. 6'0"`} value={prefs.heightMax} onChange={(e) => set("heightMax", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="pp-card">
        <h2><FaGraduationCap /> Education</h2>
        <div className="pp-chip-group">
          {(educations || []).map((edu) => {
            const id = edu.edid ?? edu.id;
            const label = edu.educationName ?? edu.name ?? edu.education;
            const selected = prefs.educationIds.includes(id);
            return (
              <button
                type="button"
                key={id}
                className={`pp-chip ${selected ? "selected" : ""}`}
                onClick={() => toggleEducation(id)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pp-card">
        <h2><FaBriefcase /> Occupation &amp; Income</h2>
        <div className="pp-grid-2">
          <div>
            <label>Preferred Occupation</label>
            <input type="text" placeholder="e.g. Engineer, Doctor" value={prefs.occupation} onChange={(e) => set("occupation", e.target.value)} />
          </div>
          <div>
            <label><FaMoneyBillWave /> Minimum Income</label>
            <input type="number" min="0" value={prefs.incomeMin} onChange={(e) => set("incomeMin", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="pp-card">
        <h2><FaMapMarkerAlt /> Location &amp; Marital Status</h2>
        <div className="pp-grid-2">
          <div>
            <label>Preferred Location</label>
            <input type="text" placeholder="e.g. Pune, Maharashtra" value={prefs.preferredLocation} onChange={(e) => set("preferredLocation", e.target.value)} />
          </div>
          <div>
            <label>Marital Status</label>
            <select value={prefs.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value)}>
              <option value="">Any</option>
              {(marriages || []).map((m) => (
                <option key={m.id} value={m.marriageType}>
                  {m.marriage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pp-card">
        <h2>Lifestyle &amp; Family Preferences</h2>
        <label>Lifestyle Preferences</label>
        <textarea
          rows={3}
          maxLength={500}
          placeholder="e.g. non-smoker, vegetarian, fitness-focused..."
          value={prefs.lifestylePreferences}
          onChange={(e) => set("lifestylePreferences", e.target.value)}
        />
        <label className="pp-mt">Family Preferences</label>
        <textarea
          rows={3}
          maxLength={500}
          placeholder="e.g. open to joint family, family values important..."
          value={prefs.familyPreferences}
          onChange={(e) => set("familyPreferences", e.target.value)}
        />
      </div>

      <div className="pp-actions">
        <button className="pp-reset-btn" onClick={handleReset} disabled={saving}>
          <FaUndo /> Reset
        </button>
        <button className="pp-save-btn" onClick={handleSave} disabled={saving}>
          <FaSave /> {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};

export default PartnerPreferences;
