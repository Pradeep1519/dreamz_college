// src/app/data/testimonialData.ts

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  college: string;
  feedback: string;
  rating: number;
  image: string;
  date: string;
  achievement?: string; // optional - like "Placed at Amazon", "Gold Medalist", etc.
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priyanku Mandal",
    course: "B.Tech Computer Science",
    college: "Mangalmay Institute of Engineering and Technology",
    feedback: "Dreamz College helped me find the perfect engineering college. Their counselors guided me through the entire admission process. I got placed at TCS with 7.5 LPA package! Highly recommended!",
    rating: 5,
    image: "/testimonials/akash.jpg",
    date: "March 2024",
    achievement: "Placed at TCS - 7.5 LPA"
  },
  {
    id: "2",
    name: "Teemraj Sharma",
    course: "BSc (CS)",
    college: "GNIOT",
    feedback: "I was confused about which BSc (CS) college to choose. Dreamz College counselors understood my profile and suggested the best options. Their placement assistance helped me get into Rim Las Pvt Ltd. Thank you Dreamz College!",
    rating: 5,
    image: "/testimonials/priya.jpg",
    date: "February 2025",
    achievement: "Placed at Rim Las Pvt Ltd."
  },
  {
    id: "3",
    name: "Sudhansu Raj",
    course: "B.Tech Computer Science Engineering",
    college: "Mangalmay Institute of Engineering and Technology",
    feedback: "The best part about Dreamz College is that their service is completely free. They never asked for money. My counselor was very supportive and helped me get admission in a good college. Highly satisfied!",
    rating: 4,
    image: "/testimonials/rahul.jpg",
    date: "January 2025",
    achievement: "Software Developer at Infosys"
  },
  {
    id: "4",
    name: "Neha Gupta",
    course: "B.Sc Nursing",
    college: "Metro College of Nursing",
    feedback: "Dreamz College made my nursing admission process so easy. From college selection to fee payment, they guided me at every step. Now I'm working at Apollo Hospital. Grateful to the entire team!",
    rating: 5,
    image: "/testimonials/neha.jpg",
    date: "December 2024",
    achievement: "Staff Nurse at Apollo Hospital"
  },
  {
    id: "5",
    name: "Vikash Kumar",
    course: "B.Tech Lateral Entry",
    college: "Accurate Institute",
    feedback: "After my diploma, I wanted to do B.Tech. Dreamz College helped me with lateral entry admission. The process was smooth and transparent. Now I'm placed at Wipro. Best decision ever!",
    rating: 5,
    image: "/testimonials/vikash.jpg",
    date: "November 2024",
    achievement: "System Engineer at Wipro - 6.2 LPA"
  },
  {
    id: "6",
    name: "Anjali Mehta",
    course: "BA LLB",
    college: "GNIOT College of Law",
    feedback: "I was worried about law college admission. Dreamz College counselors guided me through CLAT preparation and college selection. Their support was amazing throughout my journey.",
    rating: 4,
    image: "/testimonials/anjali.jpg",
    date: "October 2024",
    achievement: "Legal Associate at Law Firm"
  }
];