// fix-remaining-courses.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAklxGh5b93k50GL9wQnZVK1n4_lRr4Cl4",
  authDomain: "dreamz-college.firebaseapp.com",
  projectId: "dreamz-college",
  storageBucket: "dreamz-college.firebasestorage.app",
  messagingSenderId: "1061753087979",
  appId: "1:1061753087979:web:e15483b7e613e43b1a9bae",
  measurementId: "G-R7D0M124FL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function createYearFeeStructure(years, amounts) {
  const yearNames = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const result = [];
  for (let i = 0; i < years; i++) {
    result.push({ year: yearNames[i], amount: amounts[i] });
  }
  return result;
}

function createSemesterFeeStructure(amounts) {
  const result = [];
  for (let i = 0; i < amounts.length; i++) {
    if (amounts[i] > 0 || i < 4) {
      result.push({ semester: `Semester ${i + 1}`, amount: amounts[i] });
    }
  }
  return result;
}

const coursesToFix = [
  {
    id: "mangalmay_btech_cse",
    name: "B.Tech CSE",
    duration: "4 Years",
    university: "Dr. A.P.J. Abdul Kalam Technical University, Lucknow",
    category: "engineering",
    seats: 180,
    registrationFee: 10000,
    feePerYear: 165000,
    totalFee: 660000,
    yearAmounts: [165000, 165000, 165000, 165000],
    semesterAmounts: [82500, 82500, 82500, 82500, 82500, 82500, 82500, 82500],
    eligibility: "10+2 with PCM minimum 45% marks. JEE Main/UPSEE qualified.",
    highlights: ["NBA Accredited", "Advanced Computing Labs", "Industry Certifications", "Research Opportunities"]
  },
  {
    id: "mangalmay_btech_cse_ai_ds",
    name: "B.Tech (AI/DS)",
    duration: "4 Years",
    university: "Dr. A.P.J. Abdul Kalam Technical University, Lucknow",
    category: "engineering",
    seats: 120,
    registrationFee: 10000,
    feePerYear: 165000,
    totalFee: 660000,
    yearAmounts: [165000, 165000, 165000, 165000],
    semesterAmounts: [82500, 82500, 82500, 82500, 82500, 82500, 82500, 82500],
    eligibility: "10+2 with PCM minimum 45% marks. JEE Main/UPSEE qualified.",
    highlights: ["AI & Data Science Specialization", "Machine Learning", "Deep Learning", "Industry Projects"]
  },
  {
    id: "mangalmay_btech_leet",
    name: "B.Tech (LEET) - CSE",
    duration: "3 Years",
    university: "Dr. A.P.J. Abdul Kalam Technical University, Lucknow",
    category: "engineering",
    seats: 60,
    registrationFee: 10000,
    feePerYear: 165000,
    totalFee: 495000,
    yearAmounts: [0, 165000, 165000],
    semesterAmounts: [0, 0, 82500, 82500, 82500, 82500],
    eligibility: "Diploma in Engineering with minimum 45% marks",
    highlights: ["Lateral Entry", "Direct 2nd Year Admission", "Fast Track Program"]
  },
  {
    id: "mangalmay_bpharm",
    name: "B.Pharm",
    duration: "4 Years",
    university: "CCS University, Meerut",
    category: "pharmacy",
    seats: 100,
    registrationFee: 10000,
    feePerYear: 110000,
    totalFee: 440000,
    yearAmounts: [110000, 110000, 110000, 110000],
    semesterAmounts: [55000, 55000, 55000, 55000, 55000, 55000, 55000, 55000],
    eligibility: "10+2 with PCB/PCM with minimum 50% marks",
    highlights: ["PCI Approved", "Modern Labs", "Herbal Garden", "Industry Training"]
  },
  {
    id: "mangalmay_ba_bed",
    name: "B.A. B.Ed (Integrated)",
    duration: "4 Years",
    university: "CCS University, Meerut",
    category: "education",
    seats: 100,
    registrationFee: 5000,
    feePerYear: 55000,
    totalFee: 220000,
    yearAmounts: [55000, 55000, 55000, 55000],
    semesterAmounts: [27500, 27500, 27500, 27500, 27500, 27500, 27500, 27500],
    eligibility: "10+2 with minimum 50% marks",
    highlights: ["NCTE Approved", "Integrated Curriculum", "Teaching Practice", "School Internship"]
  },
  {
    id: "mangalmay_bba",
    name: "BBA",
    duration: "3 Years",
    university: "CCS University, Meerut",
    category: "management",
    seats: 180,
    registrationFee: 10000,
    feePerYear: 84000,
    totalFee: 252000,
    yearAmounts: [84000, 84000, 84000],
    semesterAmounts: [42000, 42000, 42000, 42000, 42000, 42000],
    eligibility: "10+2 with minimum 45% marks from recognized board",
    highlights: ["Industry Exposure", "Soft Skills Training", "Internship Program", "Digital Marketing Training"]
  },
  {
    id: "mangalmay_bca",
    name: "BCA",
    duration: "3 Years",
    university: "CCS University, Meerut",
    category: "it",
    seats: 120,
    registrationFee: 10000,
    feePerYear: 84000,
    totalFee: 252000,
    yearAmounts: [84000, 84000, 84000],
    semesterAmounts: [42000, 42000, 42000, 42000, 42000, 42000],
    eligibility: "10+2 with Mathematics/Computer Science with minimum 45% marks",
    highlights: ["Programming Labs", "Industry Certifications", "Project Based Learning", "Web Development"]
  },
  {
    id: "mangalmay_bcom",
    name: "B.Com",
    duration: "3 Years",
    university: "CCS University, Meerut",
    category: "commerce",
    seats: 120,
    registrationFee: 10000,
    feePerYear: 55000,
    totalFee: 165000,
    yearAmounts: [55000, 55000, 55000],
    semesterAmounts: [27500, 27500, 27500, 27500, 27500, 27500],
    eligibility: "10+2 with minimum 45% marks",
    highlights: ["Tally Training", "GST Certification", "Financial Accounting", "Soft Skills Development"]
  }
];

async function fixRemainingCourses() {
  console.log('🔧 Fixing remaining Mangalmay courses...\n');
  
  let success = 0;
  let fail = 0;
  
  for (const course of coursesToFix) {
    try {
      const feeStructure = createYearFeeStructure(course.yearAmounts.length, course.yearAmounts);
      const semesterFeeStructure = createSemesterFeeStructure(course.semesterAmounts);
      
      const courseData = {
        collegeId: "mangalmay",
        collegeName: "Mangalmay Group of Institutions",
        name: course.name,
        category: course.category,
        duration: course.duration,
        university: course.university,
        seats: course.seats,
        registrationFee: course.registrationFee,
        feePerYear: course.feePerYear,
        totalFee: course.totalFee,
        feeStructure: feeStructure,
        feeStructureSemester: semesterFeeStructure,
        eligibility: course.eligibility,
        highlights: course.highlights,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const courseRef = doc(db, 'courses', course.id);
      await setDoc(courseRef, courseData);
      console.log(`✅ Fixed: ${course.name}`);
      success++;
      
    } catch (error) {
      console.log(`❌ Failed: ${course.name} - ${error.message}`);
      fail++;
    }
  }
  
  console.log(`\n🎉 Done! Fixed ${success}/${success + fail} courses`);
}

fixRemainingCourses();