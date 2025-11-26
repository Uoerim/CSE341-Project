import React, { useState } from "react";
import "../components/Settings/Settings.css";

import SettingsRow from "../components/Settings/SettingsRow";
import SettingsSection from "../components/Settings/SettingsSection";
import ToggleSwitch from "../components/Settings/ToggleSwitch";

const TABS = [
  "Account",
  "Profile",
  "Privacy",
  "Preferences",
  "Notifications",
  "Email",
];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={
              "settings-tab" + (activeTab === tab ? " settings-tab--active" : "")
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === "Account" && <AccountTab />}
        {activeTab === "Profile" && <ProfileTab />}
        {activeTab === "Privacy" && <PrivacyTab />}
        {activeTab !== "Account" &&
          activeTab !== "Profile" &&
          activeTab !== "Privacy" && (
            <div className="settings-placeholder">
              <h2>{activeTab}</h2>
              <p>Settings for {activeTab.toLowerCase()} will appear here.</p>
            </div>
          )}
      </div>

      <div className="settings-footer">
        <a href="#">Reddit Rules</a>
        <a href="#">Privacy Policy</a>
        <a href="#">User Agreement</a>
        <a href="#">Accessibility</a>
        <span>• Reddit, Inc. © 2025. All rights reserved.</span>
      </div>
    </div>
  );
}

/* ---------- SMALL MODAL COMPONENT ---------- */

function SettingsModal({ title, children, onClose, onSave, saveLabel = "Save" }) {
  return (
    <div className="settings-modal-backdrop" onClick={onClose}>
      <div
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-modal-header">
          <h3>{title}</h3>
        </div>

        <div className="settings-modal-body">{children}</div>

        <div className="settings-modal-actions">
          <button
            type="button"
            className="settings-row-button"
            onClick={onClose}
          >
            Cancel
          </button>
          {onSave && (
            <button
              type="button"
              className="settings-row-button settings-row-button--primary"
              onClick={onSave}
            >
              {saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- ACCOUNT TAB ---------- */

function AccountTab() {
  const [email, setEmail] = useState("yousefshoman99@gmail.com");
  const [gender, setGender] = useState("Man");
  const [location, setLocation] = useState(
    "Use approximate location (based on IP)"
  );
  const [twoFactor, setTwoFactor] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [tempEmail, setTempEmail] = useState(email);
  const [tempGender, setTempGender] = useState(gender);
  const [tempLocation, setTempLocation] = useState(location);

  return (
    <>
      <SettingsSection title="General">
        <SettingsRow
          label="Email address"
          value={email}
          actionType="chevron"
          action="chevron"
          onClick={() => {
            setTempEmail(email);
            setShowEmailModal(true);
          }}
        />
        <SettingsRow
          label="Gender"
          value={gender}
          actionType="chevron"
          action="chevron"
          onClick={() => {
            setTempGender(gender);
            setShowGenderModal(true);
          }}
        />
        <SettingsRow
          label="Location customization"
          value={location}
          helper="Control how Reddit uses your location to personalize content."
          actionType="chevron"
          action="chevron"
          onClick={() => {
            setTempLocation(location);
            setShowLocationModal(true);
          }}
        />
      </SettingsSection>

      <SettingsSection title="Account security">
        <SettingsRow
          label="Change password"
          helper="Update the password you use to log in."
          actionType="chevron"
          action="chevron"
          onClick={() => setShowPasswordModal(true)}
        />
        <SettingsRow
          label="Two-factor authentication"
          helper="Add an extra layer of security to your account."
          action={<ToggleSwitch checked={twoFactor} onChange={setTwoFactor} />}
        />
      </SettingsSection>

      <SettingsSection title="Account authorization">
        <SettingsRow
          label="Google"
          helper="Connect to log in with your Google account."
          action="Connect"
        />
        <SettingsRow
          label="Apple"
          helper="Connect to log in with your Apple account."
          action="Connect"
        />
      </SettingsSection>

      <SettingsSection title="Advanced">
        <SettingsRow
          label="Delete account"
          helper="Permanently delete your Reddit account and data."
          actionType="chevron"
          action="chevron"
        />
      </SettingsSection>

      {showEmailModal && (
        <SettingsModal
          title="Change email"
          onClose={() => setShowEmailModal(false)}
          onSave={() => {
            setEmail(tempEmail.trim() || email);
            setShowEmailModal(false);
          }}
        >
          <label className="settings-modal-label">
            New email
            <input
              type="email"
              className="settings-modal-input"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
            />
          </label>
        </SettingsModal>
      )}

      {showGenderModal && (
        <SettingsModal
          title="Select gender"
          onClose={() => setShowGenderModal(false)}
          onSave={() => {
            setGender(tempGender || gender);
            setShowGenderModal(false);
          }}
        >
          <div className="settings-modal-radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Man"
                checked={tempGender === "Man"}
                onChange={(e) => setTempGender(e.target.value)}
              />
              Man
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Woman"
                checked={tempGender === "Woman"}
                onChange={(e) => setTempGender(e.target.value)}
              />
              Woman
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Prefer not to say"
                checked={tempGender === "Prefer not to say"}
                onChange={(e) => setTempGender(e.target.value)}
              />
              Prefer not to say
            </label>
          </div>
        </SettingsModal>
      )}

      {showLocationModal && (
        <SettingsModal
          title="Location customization"
          onClose={() => setShowLocationModal(false)}
          onSave={() => {
            setLocation(tempLocation || location);
            setShowLocationModal(false);
          }}
        >
          <p className="settings-modal-text">
            Reddit can use your approximate location (based on IP) to
            personalize recommendations and trending content.
          </p>
          <label className="settings-modal-label">
            Description
            <input
              type="text"
              className="settings-modal-input"
              value={tempLocation}
              onChange={(e) => setTempLocation(e.target.value)}
            />
          </label>
        </SettingsModal>
      )}

      {showPasswordModal && (
        <SettingsModal
          title="Change password"
          onClose={() => setShowPasswordModal(false)}
          onSave={() => setShowPasswordModal(false)}
          saveLabel="Update password"
        >
          <label className="settings-modal-label">
            Current password
            <input type="password" className="settings-modal-input" />
          </label>
          <label className="settings-modal-label">
            New password
            <input type="password" className="settings-modal-input" />
          </label>
          <label className="settings-modal-label">
            Confirm new password
            <input type="password" className="settings-modal-input" />
          </label>
        </SettingsModal>
      )}
    </>
  );
}

/* ---------- PROFILE TAB (same as we built) ---------- */

function ProfileTab() {
  const [isMature, setIsMature] = useState(false);
  const [showNsfw, setShowNsfw] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);

  const [contentMode, setContentMode] = useState("show"); // show | customize | hide
  const [contentOpen, setContentOpen] = useState(false);

  const contentLabelMap = {
    show: "Show all",
    customize: "Customize",
    hide: "Hide all",
  };

  return (
    <>
      <SettingsSection title="General">
        <SettingsRow
          label="Display name"
          helper="Changing your display name won’t change your username"
          actionType="chevron"
          action="chevron"
        />
        <SettingsRow
          label="About description"
          actionType="chevron"
          action="chevron"
        />
        <SettingsRow
          label="Avatar"
          helper="Edit your avatar or upload an image"
          actionType="chevron"
          action="chevron"
        />
        <SettingsRow
          label="Banner"
          helper="Upload a profile background image"
          actionType="chevron"
          action="chevron"
        />
        <SettingsRow
          label="Social links"
          actionType="chevron"
          action="chevron"
        />
        <SettingsRow
          label="Mark as mature (18+)"
          helper="Label your profile as Not Safe for Work (NSFW) and ensure it's inaccessible to people under 18"
          action={<ToggleSwitch checked={isMature} onChange={setIsMature} />}
        />
      </SettingsSection>

      <SettingsSection title="Curate your profile">
        <p className="settings-section-description">
          Manage what content shows on your profile.
        </p>

        {/* Content & activity row */}
        <SettingsRow
          label="Content and activity"
          helper="Posts, comments, and communities you’re active in"
          onClick={() => setContentOpen(!contentOpen)}
          action={
            <button
              type="button"
              className="settings-row-showall-button"
              onClick={(e) => {
                e.stopPropagation();
                setContentOpen(!contentOpen);
              }}
            >
              {contentLabelMap[contentMode]} {contentOpen ? "▴" : "▾"}
            </button>
          }
        />

        {contentOpen && (
          <div className="profile-content-card">
            {/* SHOW ALL */}
            <button
              type="button"
              className={
                "profile-content-option" +
                (contentMode === "show"
                  ? " profile-content-option--active"
                  : "")
              }
              onClick={() => setContentMode("show")}
            >
              <div className="profile-content-option-left">
                <span className="profile-content-option-icon">
                  {/* eye svg */}
                  <svg
                    fill="currentColor"
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 13.9c-2.15 0-3.9-1.75-3.9-3.9S7.85 6.1 10 6.1s3.9 1.75 3.9 3.9-1.75 3.9-3.9 3.9zm0-6a2.1 2.1 0 100 4.2 2.1 2.1 0 000-4.2z"></path>
                    <path d="M10 16.97c-3.8 0-7.28-2.09-9.08-5.44-.51-.96-.51-2.1 0-3.06C2.72 5.11 6.2 3.03 10 3.03s7.28 2.09 9.08 5.44c.51.96.51 2.1 0 3.06-1.8 3.36-5.28 5.44-9.08 5.44zm0-12.14c-3.14 0-6.01 1.72-7.5 4.5-.22.42-.22.94 0 1.35a8.514 8.514 0 007.5 4.5c3.14 0 6.01-1.72 7.5-4.5.22-.42.22-.94 0-1.35a8.514 8.514 0 00-7.5-4.5z"></path>
                  </svg>
                </span>
                <div>
                  <div className="profile-content-option-title">Show all</div>
                  <div className="profile-content-option-helper">
                    Show all posts, comments, and communities you’re active in on
                    your profile
                  </div>
                </div>
              </div>
              <span
                className={
                  "profile-content-option-radio" +
                  (contentMode === "show"
                    ? " profile-content-option-radio--checked"
                    : "")
                }
              />
            </button>

            {/* CUSTOMIZE */}
            <button
              type="button"
              className={
                "profile-content-option" +
                (contentMode === "customize"
                  ? " profile-content-option--active"
                  : "")
              }
              onClick={() => setContentMode("customize")}
            >
              <div className="profile-content-option-left">
                <span className="profile-content-option-icon">
                  {/* tools svg */}
                  <svg
                    fill="currentColor"
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.279 2.865c.08 0 .16.002.24.006l-1.114 1.114a3.262 3.262 0 004.61 4.615l1.12-1.12a4.846 4.846 0 01-4.841 5.087c-.373 0-.745-.043-1.11-.127l-.972-.225-.706.706-3.72 3.715a1.713 1.713 0 01-2.421-2.422L7.084 10.5l.706-.71-.226-.973a4.843 4.843 0 014.715-5.952zm0-1.8A6.64 6.64 0 005.81 9.223l-3.72 3.719a3.513 3.513 0 004.969 4.967l3.718-3.718a6.644 6.644 0 007.6-9.142.711.711 0 00-1.15-.209l-2.485 2.484a1.46 1.46 0 01-2.066-2.066l2.485-2.484a.712.712 0 00-.21-1.151 6.67 6.67 0 00-2.673-.558z"></path>
                  </svg>
                </span>
                <div>
                  <div className="profile-content-option-title">Customize</div>
                  <div className="profile-content-option-helper">
                    Choose what posts, comments, and communities you’re active in
                    show on your profile
                  </div>
                </div>
              </div>
              <span
                className={
                  "profile-content-option-radio" +
                  (contentMode === "customize"
                    ? " profile-content-option-radio--checked"
                    : "")
                }
              />
            </button>

            {/* HIDE ALL */}
            <button
              type="button"
              className={
                "profile-content-option" +
                (contentMode === "hide"
                  ? " profile-content-option--active"
                  : "")
              }
              onClick={() => setContentMode("hide")}
            >
              <div className="profile-content-option-left">
                <span className="profile-content-option-icon">
                  {/* hide svg */}
                  <svg
                    fill="currentColor"
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.497 3.503a.9.9 0 10-1.273 1.273l.909.909A10.141 10.141 0 00.92 8.472a3.225 3.225 0 000 3.058A10.296 10.296 0 0010 16.973a10.13 10.13 0 003.709-.712l1.457 1.457a.897.897 0 001.274 0 .9.9 0 000-1.273L3.497 3.503zM10 15.172a8.497 8.497 0 01-7.495-4.494 1.448 1.448 0 010-1.354 8.436 8.436 0 011.9-2.365l2.069 2.068c-.062.271-.105.55-.105.84a3.77 3.77 0 003.767 3.767c.29 0 .569-.043.84-.106l1.31 1.31a8.284 8.284 0 01-2.284.335L10 15.172zm.476-7.237L8.874 6.333a3.722 3.722 0 011.26-.233 3.77 3.77 0 013.767 3.767c0 .444-.091.864-.233 1.26l-1.603-1.603a1.963 1.963 0 00-1.59-1.589zm8.605 3.595a10.297 10.297 0 01-2.22 2.792L15.59 13.05a8.512 8.512 0 001.905-2.372 1.448 1.448 0 000-1.354A8.496 8.496 0 007.69 5.15L6.282 3.742A10.249 10.249 0 0110 3.028c3.8 0 7.28 2.087 9.08 5.444a3.225 3.225 0 010 3.058z"></path>
                  </svg>
                </span>
                <div>
                  <div className="profile-content-option-title">Hide all</div>
                  <div className="profile-content-option-helper">
                    Hide all posts, comments, and communities you’re active in on
                    your profile
                  </div>
                </div>
              </div>
              <span
                className={
                  "profile-content-option-radio" +
                  (contentMode === "hide"
                    ? " profile-content-option-radio--checked"
                    : "")
                }
              />
            </button>
          </div>
        )}

        <SettingsRow
          label="NSFW"
          helper="Show all NSFW posts and comments"
          action={<ToggleSwitch checked={showNsfw} onChange={setShowNsfw} />}
        />

        <SettingsRow
          label="Followers"
          helper="Show your follower count"
          action={
            <ToggleSwitch
              checked={showFollowers}
              onChange={setShowFollowers}
            />
          }
        />

        <div className="profile-info-box">
          <a href="#" className="profile-info-link">
            Profile curation
          </a>{" "}
          only applies to your profile and your content stays visible in
          communities. Mods of communities you participate in and redditors
          whose profile posts you engage with can still see your full profile
          for moderation.
        </div>
      </SettingsSection>

      <SettingsSection title="Advanced">
        <SettingsRow
          label="Profile moderation"
          action={
            <button
              type="button"
              className="settings-external-button"
              aria-label="Open profile moderation"
            >
              <svg
                fill="currentColor"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 5a1 1 0 011-1h9a1 1 0 011 1v9a1 1 0 11-2 0V7.414l-8.293 8.293a1 1 0 01-1.414-1.414L12.586 6H6a1 1 0 01-1-1z" />
              </svg>
            </button>
          }
        />
      </SettingsSection>
    </>
  );
}

/* ---------- PRIVACY TAB ---------- */

function PrivacyTab() {
  const [allowFollow, setAllowFollow] = useState(true);
  const [oldUsers, setOldUsers] = useState(true);
  const [searchResults, setSearchResults] = useState(true);
  const [adsPersonalization, setAdsPersonalization] = useState(true);

  return (
    <>
      {/* SOCIAL INTERACTIONS */}
      <SettingsSection title="Social interactions">
        <SettingsRow
          label="Allow people to follow you"
          helper="Let people follow you to see your profile posts in their home feed"
          action={
            <ToggleSwitch
              checked={allowFollow}
              onChange={setAllowFollow}
            />
          }
        />
        <SettingsRow
          label="Who can send you chat requests"
          value="Everyone"
          valueClassName="settings-row-value--link"
          actionType="chevron"
          action="chevron"
        />
        <SettingsRow
          label="Blocked accounts"
          actionType="chevron"
          action="chevron"
        />
      </SettingsSection>

      {/* DISCOVERABILITY */}
      <SettingsSection title="Discoverability">
        <SettingsRow
          label="List your profile on old.reddit.com/users"
          helper="List your profile on old.reddit.com/users and allow posts to your profile to appear in r/all"
          action={
            <ToggleSwitch
              checked={oldUsers}
              onChange={setOldUsers}
            />
          }
        />
        <SettingsRow
          label="Show up in search results"
          helper="Allow search engines like Google to link to your profile in their search results"
          action={
            <ToggleSwitch
              checked={searchResults}
              onChange={setSearchResults}
            />
          }
        />
      </SettingsSection>

      {/* ADS PERSONALIZATION */}
      <SettingsSection title="Ads personalization">
        <SettingsRow
          label="Personalize ads on Reddit based on information and activity from our partners"
          helper="Allow us to use information from our partners to show you better ads on Reddit"
          action={
            <ToggleSwitch
              checked={adsPersonalization}
              onChange={setAdsPersonalization}
            />
          }
        />
      </SettingsSection>

      {/* ADVANCED */}
      <SettingsSection title="Advanced">
        <SettingsRow
          label="Third-party app authorizations"
          action={
            <button
              type="button"
              className="settings-external-button"
              aria-label="Open third-party app authorizations"
            >
              <svg
                fill="currentColor"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 5a1 1 0 011-1h9a1 1 0 011 1v9a1 1 0 11-2 0V7.414l-8.293 8.293a1 1 0 01-1.414-1.414L12.586 6H6a1 1 0 01-1-1z" />
              </svg>
            </button>
          }
        />
        <SettingsRow
          label="Clear history"
          helper="Delete your post views history"
          action={
            <button
              type="button"
              className="settings-row-button settings-row-button--ghost"
            >
              Clear
            </button>
          }
        />
      </SettingsSection>
    </>
  );
}

export default SettingsPage;
