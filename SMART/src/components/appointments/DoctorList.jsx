import React, { useState } from 'react'
import { T, SPEC } from './Constants'
import { Avatar, SpecBadge, Chip } from './Shared'
import { DOCTORS } from '../../data/doctors'

function DoctorCard({ doc, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(doc)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface, borderRadius: 18, padding: "20px",
        border: `1px solid ${hov ? T.bluePale : T.border}`,
        boxShadow: hov ? T.sh3 : T.sh2,
        cursor: "pointer", transition: "all .22s",
        transform: hov ? "translateY(-4px)" : "none",
        display: "flex", flexDirection: "column", gap: 0,
      }}
    >
      <div style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 12 }}>
        <Avatar name={doc.name} size={54} spec={doc.spec} img={doc.image} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {doc.name}
          </div>
          <SpecBadge spec={doc.spec} />
          <div style={{ fontSize: 11.5, color: T.muted, marginTop: 6, display: "flex", gap: 6, alignItems: "center" }}>
            🏥 {doc.hospital}, {doc.city}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, background: "#FFFBEB", border: "1px solid #FDE68A", padding: "4px 8px", borderRadius: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 12.5, color: "#92400E", fontWeight: 700 }}>{doc.rating}</span>
          <span style={{ fontSize: 11, color: "#F59E0B" }}>★</span>
        </div>
      </div>

      <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.65, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {doc.desc}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 12, marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 18 }}>
          <div>
            <div style={{ fontSize: 10.5, color: T.subtle }}>Experience</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{doc.exp} yrs</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: T.subtle }}>Fee</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>₹{doc.fee}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: T.subtle }}>Reviews</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{doc.reviews}</div>
          </div>
        </div>
        <div style={{
          background: hov ? T.blue : T.blueLt, color: hov ? "#fff" : T.blue,
          padding: "7px 14px", borderRadius: 9, fontSize: 12.5, fontWeight: 600,
          transition: "all .2s",
        }}>
          Book →
        </div>
      </div>
    </div>
  );
}

export default function DoctorList({ setPage, setSelectedDoctor }) {
  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const getCombinedDoctors = () => {
    const registered = JSON.parse(localStorage.getItem('shs_d') || '[]');
    const staticDocs = DOCTORS.filter(sd => !registered.some(rd => rd.email === sd.email));
    const formattedRegistered = registered.map(d => ({
      ...d,
      hospital: d.hospital || "SmartCare Hospital",
      city: d.city || "Mumbai",
      rating: d.rating || 4.5,
      reviews: d.reviews || 0,
      exp: d.exp || 5,
      fee: d.fee || 500,
      degree: d.degree || "MBBS",
      desc: d.desc || `Dr. ${d.name} is a dedicated ${d.spec} committed to providing expert medical care.`,
      diseases: d.diseases || [d.spec, "General Health"],
      avail: d.avail || { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
      slots: d.slots || ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
    }));
    return [...staticDocs, ...formattedRegistered];
  };

  const combinedDoctors = getCombinedDoctors();
  const allSpecs = [...new Set(combinedDoctors.map(d => d.spec))].sort();

  const filtered = combinedDoctors.filter(d => {
    const q = search.toLowerCase();
    const ms = !q || d.name.toLowerCase().includes(q) || d.spec.toLowerCase().includes(q) ||
               d.hospital.toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
    const mf = filterSpec === "All" || d.spec === filterSpec;
    return ms && mf;
  }).sort((a, b) => ({
    rating: b.rating - a.rating, exp: b.exp - a.exp,
    fee: a.fee - b.fee, reviews: b.reviews - a.reviews,
  }[sortBy] || 0));

  const handleSelect = doc => { setSelectedDoctor(doc); setPage("details"); };

  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${T.blue} 0%, #0EA5E9 100%)`,
        borderRadius: 22, padding: "32px 36px", marginBottom: 26, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents:"none" }} />
        <div style={{ position: "absolute", right: 60, bottom: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents:"none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>DOCTOR APPOINTMENT PORTAL</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>Find &amp; Book Specialists</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: "0 0 22px", maxWidth: 460 }}>
            Connect with {combinedDoctors.length} top specialists. Secure, instant appointment booking.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, zIndex: 1, pointerEvents:"none" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, specialty, hospital, city..."
                style={{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: 11, border: "none", fontSize: 13.5, background: "rgba(255,255,255,0.96)", color: T.text, outline: "none", boxSizing: "border-box", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }} />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "12px 16px", borderRadius: 11, border: "none", fontSize: 13, background: "rgba(255,255,255,0.96)", color: T.text, cursor: "pointer", outline: "none", fontFamily: "inherit", fontWeight: 500 }}>
              <option value="rating">⭐ Top Rated</option>
              <option value="exp">🏆 Most Experienced</option>
              <option value="fee">💰 Lowest Fee</option>
              <option value="reviews">💬 Most Reviews</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <Chip label="All" active={filterSpec === "All"} onClick={() => setFilterSpec("All")} />
        {allSpecs.map(s => <Chip key={s} label={s} active={filterSpec === s} onClick={() => setFilterSpec(s)} icon={SPEC[s]?.icon} />)}
      </div>

      <div style={{ fontSize: 13, color: T.muted, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
        Showing <strong style={{ color: T.text, margin: "0 3px" }}>{filtered.length}</strong> of {combinedDoctors.length} doctors
        {filterSpec !== "All" && (
          <span onClick={() => setFilterSpec("All")} style={{ color: T.blue, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>× Clear</span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 54, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 6 }}>No doctors found</div>
          <div style={{ fontSize: 13.5, color: T.muted }}>Try adjusting your search or filter</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
          {filtered.map(doc => <DoctorCard key={doc.id} doc={doc} onClick={handleSelect} />)}
        </div>
      )}
    </div>
  );
}
