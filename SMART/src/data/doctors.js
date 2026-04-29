export const DOCTORS = [
  {
    id: 1, name: "Dr. Priya Sharma", spec: "Cardiologist", degree: "MBBS, MD, DM Cardiology", exp: 15, fee: 1200, rating: 4.9, reviews: 342,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    hospital: "Apollo Hospitals", city: "Mumbai",
    desc: "Renowned interventional cardiologist with 15+ years in complex coronary procedures. Leads a team of 12 specialists and has pioneered minimally-invasive heart procedures across India.",
    diseases: ["Coronary Artery Disease", "Arrhythmia", "Heart Failure", "Hypertension", "Valvular Disease"],
    avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: true, Sun: false },
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:30 PM", "04:30 PM"]
  },

  {
    id: 2, name: "Dr. Rajesh Kumar", spec: "Neurologist", degree: "MBBS, MD, DM Neurology", exp: 12, fee: 1500, rating: 4.8, reviews: 289,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    hospital: "Fortis Healthcare", city: "Delhi",
    desc: "Expert in stroke management and epilepsy. Published researcher with 30+ peer-reviewed papers on neurodegenerative disorders and novel therapeutic approaches.",
    diseases: ["Stroke", "Epilepsy", "Parkinson's", "Migraine", "Multiple Sclerosis", "Neuropathy"],
    avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: false, Sat: true, Sun: false },
    slots: ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"]
  },

  {
    id: 3, name: "Dr. Ananya Reddy", spec: "Dermatologist", degree: "MBBS, MD Dermatology", exp: 9, fee: 900, rating: 4.7, reviews: 445,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    hospital: "Manipal Hospitals", city: "Bangalore",
    desc: "Cosmetic and clinical dermatologist specializing in skin cancer detection, advanced acne management, and laser treatments. Expert in all skin types.",
    diseases: ["Acne", "Psoriasis", "Eczema", "Skin Cancer", "Hair Loss", "Vitiligo"],
    avail: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: true, Sat: true, Sun: false },
    slots: ["09:30 AM", "10:30 AM", "11:30 AM", "02:30 PM", "03:30 PM", "04:30 PM", "05:30 PM"]
  },

  {
    id: 4, name: "Dr. Vikram Singh", spec: "Orthopedist", degree: "MBBS, MS Orthopedics", exp: 18, fee: 1100, rating: 4.9, reviews: 521,
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    hospital: "Max Super Specialty", city: "Delhi",
    desc: "Pioneer in minimally invasive joint replacement surgeries. Has performed over 2,000 successful hip and knee replacements and is team doctor for national sports teams.",
    diseases: ["Joint Replacement", "Sports Injuries", "Spine Problems", "Arthritis", "Bone Tumors"],
    avail: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: true, Sat: false, Sun: false },
    slots: ["08:00 AM", "09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"]
  },

  {
    id: 5, name: "Dr. Meena Agarwal", spec: "Pediatrician", degree: "MBBS, MD Pediatrics", exp: 11, fee: 700, rating: 4.8, reviews: 678,
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    hospital: "Rainbow Children's Hospital", city: "Hyderabad",
    desc: "Compassionate pediatrician dedicated to children's health from newborns to adolescents. Expert in childhood developmental disorders and preventive healthcare.",
    diseases: ["Child Development", "Vaccination", "Respiratory Issues", "Fever Management", "ADHD"],
    avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: true, Sun: true },
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
  },

  {
    id: 6, name: "Dr. Suresh Menon", spec: "Psychiatrist", degree: "MBBS, MD Psychiatry", exp: 14, fee: 1300, rating: 4.7, reviews: 198,
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    hospital: "NIMHANS", city: "Bangalore",
    desc: "Specializes in mood disorders, anxiety, PTSD, and addiction psychiatry. Uses evidence-based CBT and dialectical behavior therapy for lasting patient outcomes.",
    diseases: ["Depression", "Anxiety", "OCD", "PTSD", "Bipolar Disorder", "Schizophrenia"],
    avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
    slots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]
  },

  {
    id: 7, name: "Dr. Kavitha Nair", spec: "Ophthalmologist", degree: "MBBS, MS Ophthalmology", exp: 10, fee: 800, rating: 4.6, reviews: 312,
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    hospital: "Sankara Nethralaya", city: "Chennai",
    desc: "Renowned eye surgeon specializing in cataract surgery, LASIK, and retinal disorders. Has performed over 5,000 successful eye surgeries in 10+ years.",
    diseases: ["Cataract", "Glaucoma", "Retinal Disorders", "LASIK", "Diabetic Retinopathy", "Dry Eye"],
    avail: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: false, Sat: true, Sun: false },
    slots: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:00 PM", "04:30 PM"]
  },

  {
    id: 8, name: "Dr. Deepa Krishnan", spec: "Gynecologist", degree: "MBBS, MD, DNB Gynecology", exp: 13, fee: 1000, rating: 4.9, reviews: 567,
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    hospital: "Cloudnine Hospital", city: "Bangalore",
    desc: "Expert in high-risk pregnancies, laparoscopic surgeries, and PCOS management. Committed to women's health at every life stage with a holistic approach.",
    diseases: ["Pregnancy", "PCOS", "Endometriosis", "Infertility", "Uterine Fibroids", "Menopause"],
    avail: { Mon: false, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
    slots: ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
  },

  {
    id: 9, name: "Dr. Arjun Verma", spec: "Gastroenterologist", degree: "MBBS, MD, DM Gastroenterology", exp: 9, fee: 1100, rating: 4.7, reviews: 234,
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    hospital: "Medanta", city: "Gurugram",
    desc: "Expert in advanced endoscopy, IBD management, and liver diseases. Skilled in ERCP and therapeutic endoscopy with state-of-the-art equipment.",
    diseases: ["Liver Disease", "IBD", "Gastritis", "GERD", "Colorectal Cancer", "Pancreatitis"],
    avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: false, Sun: false },
    slots: ["09:30 AM", "10:30 AM", "02:30 PM", "03:30 PM", "04:30 PM"]
  },

  {
    id: 10, name: "Dr. Ritu Malhotra", spec: "Pulmonologist", degree: "MBBS, MD Pulmonology", exp: 8, fee: 950, rating: 4.5, reviews: 187,
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    hospital: "PGI Chandigarh", city: "Chandigarh",
    desc: "Specializes in COPD, asthma management, and sleep disorders. Expert in bronchoscopy and pulmonary function testing for precise respiratory diagnosis.",
    diseases: ["COPD", "Asthma", "Pneumonia", "Sleep Apnea", "Lung Cancer", "Pulmonary Fibrosis"],
    avail: { Mon: true, Tue: false, Wed: true, Thu: false, Fri: true, Sat: true, Sun: false },
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "03:00 PM", "04:00 PM"]
  },

  {
    id: 11, name: "Dr. Nisha Verma", spec: "Endocrinologist", degree: "MBBS, MD, DM Endocrinology", exp: 10, fee: 1400, rating: 4.8, reviews: 276,
    image: "https://randomuser.me/api/portraits/women/19.jpg",
    hospital: "Artemis Hospitals", city: "Gurugram",
    desc: "Leading endocrinologist specializing in diabetes, thyroid disorders, and metabolic bone diseases. Advocates for personalized lifestyle interventions and advanced hormone therapies.",
    diseases: ["Diabetes", "Thyroid Disorders", "PCOS", "Osteoporosis", "Metabolic Syndrome", "Hormonal Imbalance"],
    avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: false, Sun: false },
    slots: ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"]
  },

  {
    id: 12, name: "Dr. Alok Srivastava", spec: "Nephrologist", degree: "MBBS, MD, DM Nephrology", exp: 14, fee: 1600, rating: 4.9, reviews: 312,
    image: "https://randomuser.me/api/portraits/men/60.jpg",
    hospital: "Kokilaben Dhirubhai Ambani", city: "Mumbai",
    desc: "Expert in chronic kidney disease, dialysis, and kidney transplantation. Has performed over 500 renal transplants and pioneered home dialysis programs in Western India.",
    diseases: ["CKD", "Kidney Failure", "Hypertensive Nephropathy", "Glomerulonephritis", "Kidney Stones", "Electrolyte Disorders"],
    avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
    slots: ["08:30 AM", "09:30 AM", "11:00 AM", "02:00 PM", "04:00 PM", "05:30 PM"]
  },

  {
    id: 13, name: "Dr. Pallavi Joshi", spec: "Rheumatologist", degree: "MBBS, MD, DM Rheumatology", exp: 9, fee: 1300, rating: 4.7, reviews: 189,
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    hospital: "Sancheti Hospital", city: "Pune",
    desc: "Specializes in autoimmune arthritis, lupus, and scleroderma. Uses targeted biologic therapies and emphasizes early diagnosis to prevent joint deformity.",
    diseases: ["Rheumatoid Arthritis", "Lupus", "Gout", "Ankylosing Spondylitis", "Sjogren's", "Osteoarthritis"],
    avail: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: true, Sat: false, Sun: false },
    slots: ["09:30 AM", "10:30 AM", "11:30 AM", "02:30 PM", "03:30 PM", "04:30 PM"]
  },

  {
    id: 14, name: "Dr. Rohan Patil", spec: "Urologist", degree: "MBBS, MS, MCh Urology", exp: 16, fee: 1500, rating: 4.8, reviews: 401,
    image: "https://randomuser.me/api/portraits/men/72.jpg",
    hospital: "Apollo Hospitals", city: "Ahmedabad",
    desc: "Renowned for robotic prostate surgery, kidney stone management, and male infertility treatment. Has performed over 3,000 laser stone procedures with high success rates.",
    diseases: ["Kidney Stones", "BPH", "Prostate Cancer", "Male Infertility", "UTI", "Bladder Disorders"],
    avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: true, Sun: false },
    slots: ["08:00 AM", "09:00 AM", "10:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"]
  },

  {
    id: 15, name: "Dr. Shobha Rajan", spec: "Oncologist", degree: "MBBS, MD, DM Medical Oncology", exp: 12, fee: 1800, rating: 4.9, reviews: 433,
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    hospital: "Tata Memorial Hospital", city: "Mumbai",
    desc: "Specializes in targeted therapy and immunotherapy for solid tumors. Principal investigator for multiple clinical trials and dedicated to palliative care integration.",
    diseases: ["Breast Cancer", "Lung Cancer", "Colorectal Cancer", "Leukemia", "Lymphoma", "Ovarian Cancer"],
    avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: false, Sat: true, Sun: false },
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:30 PM"]
  },

  {
    id: 16, name: "Dr. Manish Thakur", spec: "Cardiothoracic Surgeon", degree: "MBBS, MS, MCh CTVS", exp: 20, fee: 2000, rating: 4.9, reviews: 287,
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    hospital: "Fortis Escorts", city: "Delhi",
    desc: "Pioneer in beating-heart bypass surgery and minimally invasive valve replacements. Has performed over 5,000 cardiac surgeries with exceptional outcomes.",
    diseases: ["CABG", "Valve Repair", "Aortic Surgery", "Heart Failure", "Congenital Heart Disease", "Thoracic Tumors"],
    avail: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: true, Sat: false, Sun: false },
    slots: ["07:30 AM", "08:30 AM", "09:30 AM", "12:00 PM", "02:00 PM"]
  },

  {
    id: 17, name: "Dr. Kavya Iyer", spec: "Plastic Surgeon", degree: "MBBS, MS, MCh Plastic Surgery", exp: 11, fee: 1700, rating: 4.7, reviews: 204,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    hospital: "Manipal Hospitals", city: "Bangalore",
    desc: "Expert in reconstructive microsurgery, hand trauma, and aesthetic procedures. Known for breast reconstruction after mastectomy and cleft lip repair in children.",
    diseases: ["Burn Reconstruction", "Hand Surgery", "Cleft Lip/Palate", "Breast Reconstruction", "Scar Revision", "Cosmetic Surgery"],
    avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: true, Sun: false },
    slots: ["09:00 AM", "10:00 AM", "11:30 AM", "01:30 PM", "03:00 PM", "04:30 PM"]
  },

  {
    id: 18, name: "Dr. Hemant Choudhary", spec: "Hematologist", degree: "MBBS, MD, DM Clinical Hematology", exp: 10, fee: 1400, rating: 4.6, reviews: 156,
    image: "https://randomuser.me/api/portraits/men/83.jpg",
    hospital: "AIIMS", city: "Jodhpur",
    desc: "Specializes in hemophilia, sickle cell disease, and bone marrow transplant. Runs a dedicated thalassemia clinic and has performed 100+ successful BMTs.",
    diseases: ["Anemia", "Hemophilia", "Leukemia", "Lymphoma", "Thalassemia", "Myeloma"],
    avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: false, Sat: true, Sun: false },
    slots: ["10:00 AM", "11:00 AM", "12:00 PM", "02:30 PM", "03:30 PM", "05:00 PM"]
  },

  {
    id: 19, name: "Dr. Neelam Dubey", spec: "Infectious Disease", degree: "MBBS, MD, DNB Infectious Diseases", exp: 8, fee: 1100, rating: 4.5, reviews: 121,
    image: "https://randomuser.me/api/portraits/women/54.jpg",
    hospital: "Marengo Asia", city: "Lucknow",
    desc: "Expert in HIV management, tropical fevers, and antimicrobial stewardship. Led COVID‑19 response team and specializes in post‑infectious rehabilitation.",
    diseases: ["HIV/AIDS", "Tuberculosis", "Dengue", "Malaria", "Typhoid", "Fungal Infections"],
    avail: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
    slots: ["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
  },

  {
    id: 20, name: "Dr. Pradeep Sinha", spec: "Interventional Radiologist", degree: "MBBS, MD, DNB Radiodiagnosis", exp: 13, fee: 1600, rating: 4.8, reviews: 210,
    image: "https://randomuser.me/api/portraits/men/38.jpg",
    hospital: "Max Super Specialty", city: "Delhi",
    desc: "Performs minimally invasive image‑guided procedures including embolization, angioplasty, and tumor ablation. Reduces need for open surgery in high‑risk patients.",
    diseases: ["Uterine Fibroids", "Liver Tumors", "Peripheral Artery Disease", "AV Malformations", "Varicose Veins", "Biliary Obstruction"],
    avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
    slots: ["08:00 AM", "09:00 AM", "10:00 AM", "02:00 PM", "03:30 PM", "04:30 PM"]
  },

  {
    id: 21, name: "Dr. Ankita Sharma", spec: "Geriatrician", degree: "MBBS, MD Geriatric Medicine", exp: 11, fee: 1200, rating: 4.9, reviews: 187,
    image: "https://randomuser.me/api/portraits/women/43.jpg",
    hospital: "Rainbow Geriatric Care", city: "Jaipur",
    desc: "Focuses on age‑related conditions, polypharmacy, and fall prevention. Advocates for comprehensive geriatric assessment and home‑based palliative support.",
    diseases: ["Dementia", "Falls", "Frailty", "Osteoporosis", "Incontinence", "Parkinson's Care"],
    avail: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: true, Sat: true, Sun: false },
    slots: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
  },

  {
    id: 22, name: "Dr. Vineet Agarwal", spec: "Pain Medicine", degree: "MBBS, MD, FIPP", exp: 9, fee: 1000, rating: 4.7, reviews: 134,
    image: "https://randomuser.me/api/portraits/men/27.jpg",
    hospital: "Artemis Hospitals", city: "Gurugram",
    desc: "Specialist in interventional pain management, epidural injections, and radiofrequency ablation. Treats chronic back pain, cancer pain, and neuralgias.",
    diseases: ["Chronic Back Pain", "Neck Pain", "Migraine", "Cancer Pain", "Post‑Surgical Pain", "Sciatica"],
    avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: false, Sun: false },
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:30 PM", "03:30 PM", "05:00 PM"]
  },

  {
    id: 23, name: "Dr. Sonal Mehta", spec: "Neonatologist", degree: "MBBS, MD, DM Neonatology", exp: 12, fee: 1400, rating: 4.8, reviews: 298,
    image: "https://randomuser.me/api/portraits/women/31.jpg",
    hospital: "Cloudnine Hospital", city: "Pune",
    desc: "Expert in premature newborn care, neonatal ventilation, and therapeutic hypothermia. Runs a level‑III NICU with survival rates among the best nationally.",
    diseases: ["Preterm Care", "Neonatal Jaundice", "Respiratory Distress", "Neonatal Sepsis", "Birth Asphyxia", "Congenital Anomalies"],
    avail: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: true, Sat: true, Sun: false },
    slots: ["08:30 AM", "09:30 AM", "10:30 AM", "12:30 PM", "02:00 PM", "03:30 PM"]
  },

  {
    id: 24, name: "Dr. Ashwin Nair", spec: "Hepatologist", degree: "MBBS, MD, DM Hepatology", exp: 10, fee: 1500, rating: 4.9, reviews: 245,
    image: "https://randomuser.me/api/portraits/men/88.jpg",
    hospital: "Medanta", city: "Lucknow",
    desc: "Specializes in liver cirrhosis, hepatitis B/C, and fatty liver disease. Performs transient elastography and leads liver transplant coordination team.",
    diseases: ["Cirrhosis", "Hepatitis B", "Hepatitis C", "NAFLD", "Liver Cancer", "Acute Liver Failure"],
    avail: { Mon: true, Tue: false, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
    slots: ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "04:30 PM"]
  },

  {
    id: 25, name: "Dr. Rupali Kulkarni", spec: "Pediatric Surgeon", degree: "MBBS, MS, MCh Pediatric Surgery", exp: 15, fee: 1600, rating: 4.8, reviews: 229,
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    hospital: "Rainbow Children's Hospital", city: "Hyderabad",
    desc: "Performs complex neonatal surgeries, laparoscopic pediatric procedures, and hypospadias repair. Dedicated to minimally invasive techniques for faster recovery.",
    diseases: ["Congenital Hernia", "Hypospadias", "Neonatal Obstruction", "Undescended Testis", "Pediatric Tumors", "Chest Wall Deformities"],
    avail: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: true, Sun: false },
    slots: ["08:00 AM", "09:00 AM", "10:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"]
  },
];
