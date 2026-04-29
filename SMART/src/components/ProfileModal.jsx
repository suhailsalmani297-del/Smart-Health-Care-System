import React, { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function ProfileModal({ onClose }) {
  const { user, updateUser, addToast } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form states
  const [dp, setDp] = useState(user?.dp || '')
  const [age, setAge] = useState(user?.age || '')
  const [gender, setGender] = useState(user?.gender || 'male')
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Image must be less than 2MB', 'error')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setDp(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setLoading(true)
    // Simulate network delay
    setTimeout(() => {
      updateUser({ dp, age, gender, bloodGroup, phone })
      addToast('Profile updated successfully!', 'success')
      setLoading(false)
      onClose()
    }, 600)
  }

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pm-header">
          <h3>My Profile</h3>
          <button className="pm-close" onClick={onClose}>&times;</button>
        </div>

        <div className="pm-body">
          {/* Avatar Section */}
          <div className="pm-avatar-section">
            <div className="pm-avatar-wrapper">
              {dp ? (
                <img src={dp} alt="Profile" className="pm-avatar-img" />
              ) : (
                <div className="pm-avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <label className="pm-avatar-upload">
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                <span>📷 Change</span>
              </label>
            </div>
            <div className="pm-user-title">
              <h2>{user?.name}</h2>
              <p className="pm-role">Patient Account</p>
            </div>
          </div>

          {/* Account Details (Read Only + Show Password) */}
          <div className="pm-section">
            <h4 className="pm-sec-title">Account Details</h4>
            <div className="pm-grid">
              <div className="pm-field">
                <label>Email Address</label>
                <div className="pm-static-val">{user?.email}</div>
              </div>
              <div className="pm-field">
                <label>Password</label>
                <div className="pm-pwd-box">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={user?.pwd || ''}
                    readOnly
                    className="pm-static-input"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information (Editable) */}
          <div className="pm-section">
            <h4 className="pm-sec-title">Personal Information</h4>
            <div className="pm-grid">
              <div className="pm-field">
                <label>Age</label>
                <input type="number" placeholder="e.g. 28" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="pm-field">
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="pm-field">
                <label>Blood Group</label>
                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="pm-field">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="pm-footer">
          <button className="pm-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="pm-save" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
