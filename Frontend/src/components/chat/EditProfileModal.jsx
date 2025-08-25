import React, { useState } from 'react';

const EditProfileModal = ({ onClose }) => {
  const [ form, setForm ] = useState({ firstName: '', lastName: '', email: '' });
  const [ saving, setSaving ] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [ name ]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Placeholder: integrate real profile update API
      await new Promise(r => setTimeout(r, 400));
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="profile-title" className="modal-title">Edit Profile</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;


