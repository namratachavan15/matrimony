import React, { useEffect, useState } from "react";
import { FaEye, FaPhoneAlt, FaEnvelope, FaSave, FaShieldAlt } from "react-icons/fa";
import { privacyService } from "../Services/privacyService";
import { useToast } from "../Components/Toast/ToastContext";
import "./PrivacySettings.css";

const VISIBILITY_OPTIONS = [
  {
    value: "EVERYONE",
    label: "Everyone",
    desc: "Any visitor to the site can see your profile.",
  },
  {
    value: "REGISTERED",
    label: "Registered Users",
    desc: "Only people who have created an account can see your profile.",
  },
  {
    value: "RECOMMENDED_ONLY",
    label: "Only Recommended Matches",
    desc: "Your profile is only shown to matches recommended to you (most private).",
  },
];

const PrivacySettings = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    profileVisibility: "REGISTERED",
    showMobile: false,
    showEmail: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await privacyService.getMySettings();
        setSettings(res.data);
      } catch (e) {
        toast.error("Could not load your privacy settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await privacyService.updateMySettings(settings);
      setSettings(res.data);
      toast.success("Privacy settings saved.");
    } catch (e) {
      toast.error("Could not save your privacy settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="privacy-page">
        <div className="privacy-skeleton" />
      </div>
    );
  }

  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <FaShieldAlt className="privacy-header-icon" />
        <div>
          <h1>Privacy Settings</h1>
          <p>Control who can see your profile and contact details.</p>
        </div>
      </div>

      <div className="privacy-card">
        <h2>
          <FaEye /> Profile Visibility
        </h2>
        <div className="visibility-options">
          {VISIBILITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`visibility-option ${settings.profileVisibility === opt.value ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="profileVisibility"
                checked={settings.profileVisibility === opt.value}
                onChange={() => setSettings((s) => ({ ...s, profileVisibility: opt.value }))}
              />
              <div>
                <div className="visibility-option-label">{opt.label}</div>
                <div className="visibility-option-desc">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="privacy-card">
        <h2>Contact Information</h2>
        <p className="privacy-card-subtext">
          By default your mobile number and email are hidden from other members.
        </p>

        <div className="privacy-toggle-row">
          <div className="privacy-toggle-label">
            <FaPhoneAlt /> Show Mobile Number on my profile
          </div>
          <label className="privacy-switch">
            <input
              type="checkbox"
              checked={settings.showMobile}
              onChange={(e) => setSettings((s) => ({ ...s, showMobile: e.target.checked }))}
            />
            <span className="privacy-switch-slider" />
          </label>
        </div>

        <div className="privacy-toggle-row">
          <div className="privacy-toggle-label">
            <FaEnvelope /> Show Email on my profile
          </div>
          <label className="privacy-switch">
            <input
              type="checkbox"
              checked={settings.showEmail}
              onChange={(e) => setSettings((s) => ({ ...s, showEmail: e.target.checked }))}
            />
            <span className="privacy-switch-slider" />
          </label>
        </div>
      </div>

      <button className="privacy-save-btn" onClick={handleSave} disabled={saving}>
        <FaSave /> {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default PrivacySettings;
