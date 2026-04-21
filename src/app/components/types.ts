// Shared types for all components
export interface College {
  id: string;
  name: string;
  fullName: string;
  location: string;
  rating: number;
  students: string;
  type: string;
  image: string;
  gallery?: string[];
  established?: string;
  affiliation?: string;
  accreditation?: string[];
  ranking?: string;
  nirfRank?: string;
  courses?: string[];
  courseFees?: {
    [key: string]: string;
  };
  highestPackage?: string;
  averagePackage?: string;
  topRecruiters?: string[];
  placementRate?: string;
  facilities?: string[];
  contact?: {
    phone: string;
    email: string;
    website?: string;
    tollFree?: string;
    helpline?: string;
  };
  fees?: string;
  reviews?: number;
  description?: string;
  specializations?: string[];
  brochure?: string;
  achievements?: string[];
  alumniCount?: string;
  facultyCount?: string;
  faqs?: FAQ[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full Time' | 'Part Time' | 'Internship' | 'Contract';
  category: 'Engineering' | 'Medical' | 'Management' | 'IT' | 'Teaching' | 'Sales' | 'Other';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applyLink: string;
  deadline?: string;
  openings: number;
}

export interface Exam {
  id: string;
  name: string;
  fullName: string;
  category: 'Engineering' | 'Medical' | 'Management' | 'Civil Services' | 'Law' | 'Other';
  level: 'National' | 'State' | 'University';
  conductingBody: string;
  applicationDate: string;
  examDate: string;
  resultDate?: string;
  eligibility: string[];
  syllabus: string[];
  officialSite: string;
  previousPapers: {
    year: string;
    pdfLink: string;
  }[];
}