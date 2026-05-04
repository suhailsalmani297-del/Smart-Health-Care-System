import React, { useState } from 'react'

export default function ProfileView({ doctor, updateDoctor, addToast }) {
  const [formData, setFormData] = useState({
    degree: doctor.degree || "",
    exp: doctor.exp || "",
    fee: doctor.fee || "",
    hospital: doctor.hospital || "SmartCare Hospital",
    city: doctor.city || "Mumbai",
    desc: doctor.desc || "",
    spec: doctor.spec || "",
    slots: (doctor.slots || ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]).join(", "),
  });

  const [avail, setAvail] = useState(doctor.avail || {
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDay = (day) => {
    setAvail(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const processedSlots = formData.slots.split(",").map(s => s.trim()).filter(Boolean);
    updateDoctor({ ...formData, avail, slots: processedSlots });
    addToast("Profile updated successfully!", "ok");
  };

  return (
    <div className="fade-up">
      <h2 style={{ marginBottom: 20 }}>Profile Settings</h2>
      <div className="card" style={{ padding: 32, background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>Medical Degree</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="e.g. MBBS, MD (Cardiology)" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>Specialization (Cannot be changed)</label>
              <div style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 14, fontWeight: 600 }}>
                {formData.spec || 'Not specified'}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Your specialization is set during registration and cannot be modified.</p>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>Experience (Years)</label>
              <input type="number" name="exp" value={formData.exp} onChange={handleChange} placeholder="e.g. 10" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>Consultation Fee (₹)</label>
              <input type="number" name="fee" value={formData.fee} onChange={handleChange} placeholder="e.g. 500" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>Hospital/Clinic</label>
              <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
          </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>Available Time Slots (Comma separated)</label>
              <input type="text" name="slots" value={formData.slots} onChange={handleChange} placeholder="e.g. 09:00 AM, 10:00 AM, 02:00 PM" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>Professional Bio</label>
              <textarea name="desc" value={formData.desc} onChange={handleChange} placeholder="Tell patients about your expertise..." rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', resize: 'vertical' }} />
            </div>

          <div className="form-group" style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#475569' }}>Availability (Days)</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {Object.keys(avail).map(day => (
                <button key={day} type="button" onClick={() => toggleDay(day)} style={{
                  padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: avail[day] ? '#0ea5e9' : '#f1f5f9',
                  color: avail[day] ? 'white' : '#64748b',
                  fontWeight: 600, transition: '0.2s'
                }}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" style={{
            background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', color: 'white',
            padding: '14px 32px', borderRadius: 14, border: 'none', fontWeight: 700,
            cursor: 'pointer', fontSize: 16, boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)'
          }}>
            Save Profile Information
          </button>
        </form>
      </div>
    </div>
  );
}
