// src/app/data/blogData.ts

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  // ========== BLOG 1: JUNIORDREAM - PREMIUM VERSION ==========
  {
    id: "1",
    title: "JuniorDream: India's Most Comprehensive Student Growth Ecosystem for Classes 6-12",
    slug: "juniordream-student-growth-ecosystem",
    excerpt: "JuniorDream is a revolutionary growth ecosystem that combines academic excellence, life mentorship from real achievers, and parent involvement to shape students from Class 6 to 12 into future leaders.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">JuniorDream Private Limited is not just another tuition or EdTech platform - it's a complete growth ecosystem for students from Class 6 to 12, where teachers, mentors, and parents work together to shape a child's mindset, confidence, and clarity for a successful future.</p>
        </div>

        <h2>🎯 Core Philosophy</h2>
        <p>At JuniorDream, we believe that education should go beyond textbooks and examinations. Our philosophy is simple: <strong>prepare students for life, not just for exams</strong>. We combine academic rigor with real-world mentorship to create well-rounded individuals who are ready to face any challenge.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="text-3xl mb-3">📚</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Academic Clarity</h3>
            <p class="text-gray-600">Subject-wise expert teaching that builds strong foundations in Science, Mathematics, English, and other core subjects through conceptual learning rather than rote memorization.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="text-3xl mb-3">🌟</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Life Mentorship</h3>
            <p class="text-gray-600">Real achievers - doctors, engineers, IAS officers, entrepreneurs - guide students personally, sharing their journeys and helping develop the right mindset and ambition.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="text-3xl mb-3">👨‍👩‍👧</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Parent Involvement</h3>
            <p class="text-gray-600">Monthly progress updates, mentorship alignment sessions, and clear next-step plans keep parents actively involved in their child's learning journey.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="text-3xl mb-3">🎯</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Career Direction</h3>
            <p class="text-gray-600">Early career exposure and strength discovery help students identify their aptitudes and build toward their dream careers from an early age.</p>
          </div>
        </div>

        <h2>📊 The Three-Stage Learning Path</h2>
        <div class="bg-gray-50 rounded-xl p-6 my-6">
          <div class="space-y-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">Stage 1</span>
                <h3 class="text-xl font-bold text-gray-900">Dream Foundation (Classes 6-7)</h3>
              </div>
              <p>Building curiosity, strong basics, and the right mindset. Students learn how to learn, develop study habits, and explore different subjects with interest.</p>
            </div>
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">Stage 2</span>
                <h3 class="text-xl font-bold text-gray-900">Dream Explorer (Classes 8-9)</h3>
              </div>
              <p>Skill discovery and early career exposure. Students explore different career options, identify their strengths, and start building relevant skills.</p>
            </div>
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">Stage 3</span>
                <h3 class="text-xl font-bold text-gray-900">Dream Achiever (Classes 10-12)</h3>
              </div>
              <p>Direction, board preparation, and real-world readiness. Students focus on exam preparation while developing practical skills for their chosen career path.</p>
            </div>
          </div>
        </div>

        <h2>💡 Beyond Academics: Future Skills Development</h2>
        <p>JuniorDream focuses on both hard skills and soft skills to create well-rounded individuals:</p>
        <ul>
          <li><strong>Hard Skills:</strong> Science, Mathematics, English, and subject-specific knowledge</li>
          <li><strong>Soft Skills:</strong> Communication, confidence, discipline, decision-making, leadership, teamwork</li>
          <li><strong>Life Skills:</strong> Time management, stress management, goal setting, problem-solving</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Our Mission</h3>
          <p class="text-white/90 text-lg">To empower 1 million students across India with the right education, right mentors, and the right mindset - so that every dream has a direction.</p>
        </div>

        <h2>📈 Why JuniorDream is Different</h2>
        <p>Traditional coaching focuses only on syllabus and marks. JuniorDream goes beyond that - our students learn concepts + character + clarity. Each student is paired with a personal mentor who guides them, inspires them, and helps them make better life decisions.</p>
        
        <p><strong>JuniorDream = Learning + Mentorship + Direction</strong> - It's where knowledge meets purpose. We don't just prepare students for exams - we prepare them for life.</p>
      </div>
    `,
    author: "JuniorDream Team",
    date: "April 15, 2025",
    readTime: "8 min read",
    category: "JuniorDream",
    image: "/blog/JuniorDream.png",
    tags: ["JuniorDream", "Classes 6-12", "Mentorship", "Academic Clarity", "Career Direction", "Life Skills"]
  },

  // ========== BLOG 2: DREAMZ COLLEGE - PREMIUM VERSION ==========
  {
    id: "2",
    title: "Dreamz College: Your Trusted Partner for Higher Education Success",
    slug: "dreamz-college-higher-education-guidance",
    excerpt: "Dreamz College, an initiative by JuniorDream Pvt Ltd, provides end-to-end higher education guidance - from career counseling to college admission and placement support.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">Dreamz College is an initiative by JuniorDream Private Limited - a trusted education and career guidance platform dedicated to helping students make the right academic choices for higher education. Founded in 2015, we have guided over 50,000+ students to their dream colleges.</p>
        </div>

        <h2>🎓 Our Core Services</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="text-3xl mb-3">🏛️</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Wide College Network</h3>
            <p class="text-gray-600">Access to 38+ reputed colleges across Delhi NCR, including Noida, Greater Noida, Gurugram, Faridabad, and Delhi. Our partner colleges include top engineering, management, pharmacy, nursing, law, and arts & science institutions.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="text-3xl mb-3">🎯</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Personalized Career Guidance</h3>
            <p class="text-gray-600">Expert counselors understand each student's unique profile - interests, academic background, budget, location preference - and recommend the most suitable college and course options.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="text-3xl mb-3">📋</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">End-to-End Admission Support</h3>
            <p class="text-gray-600">From career counseling to college selection, application filling, document verification, and final enrollment - we guide students at every step of the admission journey.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="text-3xl mb-3">💼</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Placement Assistance</h3>
            <p class="text-gray-600">Eligible students receive placement support through our network of 500+ partner companies across IT, Finance, Marketing, Healthcare, and other sectors.</p>
          </div>
        </div>

        <h2>📊 Partner Colleges Distribution</h2>
        <div class="bg-gray-50 rounded-xl p-6 my-6">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div><span class="text-2xl font-bold text-purple-600">12+</span><br><span class="text-sm text-gray-600">Engineering</span></div>
            <div><span class="text-2xl font-bold text-purple-600">8+</span><br><span class="text-sm text-gray-600">MBA</span></div>
            <div><span class="text-2xl font-bold text-purple-600">6+</span><br><span class="text-sm text-gray-600">Nursing</span></div>
            <div><span class="text-2xl font-bold text-purple-600">5+</span><br><span class="text-sm text-gray-600">Law</span></div>
            <div><span class="text-2xl font-bold text-purple-600">7+</span><br><span class="text-sm text-gray-600">BCA/BBA</span></div>
          </div>
        </div>

        <h2>💪 Our Commitment to Students</h2>
        <ul>
          <li><strong>100% Free Service</strong> - We never charge students for our counseling services. No hidden fees, ever.</li>
          <li><strong>Expert Counselors</strong> - Our team of 50+ experienced education professionals provides personalized guidance.</li>
          <li><strong>Wide College Network</strong> - Access to 38+ trusted partner colleges across Delhi NCR.</li>
          <li><strong>Placement Support</strong> - Guaranteed placement assistance for eligible students who meet academic criteria.</li>
          <li><strong>End-to-End Support</strong> - From the first counseling session to final placement, we stay with you.</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Our Mission</h3>
          <p class="text-white/90 text-lg">To guide students in choosing the right college and career path with clarity and confidence. We believe every student deserves access to quality education and career opportunities.</p>
        </div>

        <h2>📈 Success Track Record</h2>
        <ul>
          <li>50,000+ students successfully guided</li>
          <li>98% student satisfaction rate</li>
          <li>38+ partner colleges across India</li>
          <li>500+ placement partner companies</li>
          <li>Students placed in TCS, Infosys, Amazon, Deloitte, KPMG, and more</li>
        </ul>

        <h2>🚀 Start Your Journey with Dreamz College</h2>
        <p>Choosing the right college is one of the most important decisions for your future. At Dreamz College, we make this journey simple, guided, and successful with expert support and trusted college options.</p>
      </div>
    `,
    author: "JuniorDream Team",
    date: "April 14, 2025",
    readTime: "7 min read",
    category: "Dreamz College",
    image: "/blog/Dreamz.png",
    tags: ["Dreamz College", "Higher Education", "College Admission", "Career Guidance", "Placement Support"]
  },

  // ========== BLOG 3: PLACEMENT ASSISTANCE - PREMIUM VERSION ==========
  {
    id: "3",
    title: "Placement Assistance Guarantee: How Dreamz College Secures Your Career Future",
    slug: "placement-assistance-guarantee-dreamz-college",
    excerpt: "Dreamz College offers comprehensive placement assistance to eligible students with a network of 500+ partner companies. From resume building to interview preparation, we support you.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">One of the biggest fears students have is about getting a job after completing their degree. Dreamz College addresses this concern with our comprehensive placement assistance program for eligible students.</p>
        </div>

        <h2>💼 What We Offer</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
            <div class="text-3xl mb-3">📄</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Resume Building</h3>
            <p class="text-gray-600 text-sm">Professional resume writing workshops to create ATS-friendly resumes that get noticed by recruiters.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
            <div class="text-3xl mb-3">🧠</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Aptitude Training</h3>
            <p class="text-gray-600 text-sm">Comprehensive aptitude preparation for placement exams and company-specific tests.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
            <div class="text-3xl mb-3">🎤</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Mock Interviews</h3>
            <p class="text-gray-600 text-sm">Practice interviews with industry experts to build confidence and improve performance.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
            <div class="text-3xl mb-3">💬</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Soft Skills Training</h3>
            <p class="text-gray-600 text-sm">Communication, body language, group discussion, and personality development sessions.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
            <div class="text-3xl mb-3">💻</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Technical Prep</h3>
            <p class="text-gray-600 text-sm">Domain-specific technical interview preparation based on your specialization.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
            <div class="text-3xl mb-3">🌐</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Placement Network</h3>
            <p class="text-gray-600 text-sm">Access to our database of 500+ partner companies actively hiring.</p>
          </div>
        </div>

        <h2>🏢 Our Placement Network (500+ Companies)</h2>
        <div class="bg-gray-50 rounded-xl p-6 my-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-3"><span class="font-bold">TCS</span></div>
            <div class="text-center p-3"><span class="font-bold">Infosys</span></div>
            <div class="text-center p-3"><span class="font-bold">Amazon</span></div>
            <div class="text-center p-3"><span class="font-bold">Deloitte</span></div>
            <div class="text-center p-3"><span class="font-bold">KPMG</span></div>
            <div class="text-center p-3"><span class="font-bold">ICICI Bank</span></div>
            <div class="text-center p-3"><span class="font-bold">Wipro</span></div>
            <div class="text-center p-3"><span class="font-bold">HCL</span></div>
            <div class="text-center p-3"><span class="font-bold">Accenture</span></div>
            <div class="text-center p-3"><span class="font-bold">Tech Mahindra</span></div>
            <div class="text-center p-3"><span class="font-bold">IBM</span></div>
            <div class="text-center p-3"><span class="font-bold">Genpact</span></div>
          </div>
        </div>

        <h2>📊 Placement Statistics</h2>
        <ul>
          <li>Highest Package Offered: 25+ LPA</li>
          <li>Average Package: 4-8 LPA (depending on course and college)</li>
          <li>Top 25% Students Average: 11.80 LPA</li>
          <li>Placement Rate: 93.7% for eligible students</li>
          <li>Companies Visited in Last Session: 422+</li>
          <li>Offers in 2025 Batch: 857+</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Success Stories</h3>
          <p class="text-white/90">Over 50,000+ students have trusted us for their career journey. Our students have secured packages ranging from 3 LPA to 25+ LPA in top companies across India.</p>
        </div>

        <h2>🎯 How to Avail Placement Assistance</h2>
        <ol>
          <li>Book a free counseling session with Dreamz College</li>
          <li>Complete your admission through our partner colleges</li>
          <li>Maintain good academic standing and attendance</li>
          <li>Participate in our placement training programs</li>
          <li>Get access to our placement network and opportunities</li>
        </ol>
      </div>
    `,
    author: "JuniorDream Team",
    date: "April 12, 2025",
    readTime: "6 min read",
    category: "Placement",
    image: "/blog/Placement.png",
    tags: ["Placement", "Career", "Jobs", "Dreamz College", "Placement Assistance"]
  },

  // ========== BLOG 4: CAREER COUNSELING - PREMIUM VERSION ==========
  {
    id: "4",
    title: "Free Career Counseling: Find Your Perfect Career Path with Dreamz College",
    slug: "free-career-counseling-services",
    excerpt: "Dreamz College offers 100% free career counseling to help students choose the right college and career path based on their interests, skills, and goals.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">Choosing the right career path is one of the most important decisions in a student's life. Dreamz College offers 100% free career counseling to help students navigate this crucial decision with confidence and clarity.</p>
        </div>

        <h2>🎯 Why Career Counseling Matters</h2>
        <p>Many students feel confused and overwhelmed by the numerous career options available today. Without proper guidance, they may choose the wrong path, leading to dissatisfaction and career setbacks. Dreamz College's expert counselors help students:</p>
        <ul>
          <li>Identify their natural strengths and interests</li>
          <li>Understand various career options and their requirements</li>
          <li>Match their profile with suitable courses and colleges</li>
          <li>Make informed decisions about their future</li>
        </ul>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 class="text-xl font-bold text-gray-900 mb-2">📝 Personalized Career Assessment</h3>
            <p>We understand each student's interests, goals, academic background, and budget to recommend the most suitable college and course options.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 class="text-xl font-bold text-gray-900 mb-2">👨‍🏫 Expert Counselor Guidance</h3>
            <p>Our team of 50+ experienced education counselors provides one-on-one guidance to help students make informed decisions.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 class="text-xl font-bold text-gray-900 mb-2">🏛️ College Selection Support</h3>
            <p>We help students identify the best colleges based on location, budget, course specialization, placement record, and other preferences.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 class="text-xl font-bold text-gray-900 mb-2">📋 Admission Process Assistance</h3>
            <p>From filling application forms to document verification and fee payment, we guide students through the entire admission process.</p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">100% Free Service</h3>
          <p class="text-white/90 text-lg">No hidden charges, no fees - ever. Our mission is to help students, not to profit from them.</p>
        </div>

        <h2>📊 Counseling Process</h2>
        <div class="bg-gray-50 rounded-xl p-6 my-6">
          <div class="flex flex-col md:flex-row justify-between gap-4">
            <div class="text-center flex-1"><span class="text-2xl font-bold text-purple-600 block">Step 1</span><span class="text-sm">Book Free Session</span></div>
            <div class="text-center flex-1"><span class="text-2xl font-bold text-purple-600 block">Step 2</span><span class="text-sm">Profile Assessment</span></div>
            <div class="text-center flex-1"><span class="text-2xl font-bold text-purple-600 block">Step 3</span><span class="text-sm">College Recommendations</span></div>
            <div class="text-center flex-1"><span class="text-2xl font-bold text-purple-600 block">Step 4</span><span class="text-sm">Admission Support</span></div>
            <div class="text-center flex-1"><span class="text-2xl font-bold text-purple-600 block">Step 5</span><span class="text-sm">Placement Assistance</span></div>
          </div>
        </div>

        <h2>💪 Why Choose Dreamz College for Counseling?</h2>
        <ul>
          <li><strong>100% Free Service</strong> - We never charge students for counseling</li>
          <li><strong>Expert Counselors</strong> - 50+ experienced education professionals</li>
          <li><strong>Wide College Network</strong> - Access to 38+ partner colleges</li>
          <li><strong>Placement Support</strong> - Assistance for eligible students</li>
          <li><strong>Proven Track Record</strong> - 50,000+ students guided successfully</li>
        </ul>
      </div>
    `,
    author: "JuniorDream Team",
    date: "April 10, 2025",
    readTime: "5 min read",
    category: "Counseling",
    image: "/blog/Counseling.png",
    tags: ["Career Counseling", "Free Service", "Dreamz College", "Guidance"]
  },

  // ========== BLOG 5: ENGINEERING COLLEGES - PREMIUM VERSION ==========
  {
    id: "5",
    title: "Top Engineering Colleges in Delhi NCR 2025: Complete Admission Guide",
    slug: "top-engineering-colleges-delhi-ncr",
    excerpt: "Dreamz College helps students get admission in top engineering colleges across Delhi NCR. Free counseling, scholarship guidance, and placement assistance available.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">Delhi NCR has emerged as one of India's premier education hubs for engineering. With world-class infrastructure, industry connections, and excellent placement records, students here get exceptional career opportunities.</p>
        </div>

        <h2>🏛️ Top Engineering Colleges in Delhi NCR</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-xl mb-6">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-bold text-gray-900">College Name</th>
                <th class="px-4 py-3 text-left text-sm font-bold text-gray-900">Average Package</th>
                <th class="px-4 py-3 text-left text-sm font-bold text-gray-900">Key Recruiters</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr><td class="px-4 py-3">GNIOT Group</td><td class="px-4 py-3">5-8 LPA</td><td class="px-4 py-3">TCS, Infosys, Amazon</td></tr>
              <tr><td class="px-4 py-3">Mangalmay Group</td><td class="px-4 py-3">4-7 LPA</td><td class="px-4 py-3">Microsoft, IBM, Wipro</td></tr>
              <tr><td class="px-4 py-3">ITS Engineering College</td><td class="px-4 py-3">4-6 LPA</td><td class="px-4 py-3">Deloitte, Accenture</td></tr>
              <tr><td class="px-4 py-3">Galgotias University</td><td class="px-4 py-3">5-10 LPA</td><td class="px-4 py-3">Amazon, Google, Microsoft</td></tr>
              <tr><td class="px-4 py-3">Sharda University</td><td class="px-4 py-3">4-8 LPA</td><td class="px-4 py-3">TCS, HCL, Tech Mahindra</td></tr>
              <tr><td class="px-4 py-3">Bennett University</td><td class="px-4 py-3">6-12 LPA</td><td class="px-4 py-3">Microsoft, Adobe, Amazon</td></tr>
              <tr><td class="px-4 py-3">Amity University</td><td class="px-4 py-3">5-9 LPA</td><td class="px-4 py-3">Google, Facebook, IBM</td></tr>
            </tbody>
          </table>
        </div>

        <h2>📚 Popular Engineering Specializations</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div class="bg-gray-50 rounded-lg p-3 text-center"><span class="font-bold">Computer Science</span></div>
          <div class="bg-gray-50 rounded-lg p-3 text-center"><span class="font-bold">Artificial Intelligence</span></div>
          <div class="bg-gray-50 rounded-lg p-3 text-center"><span class="font-bold">Data Science</span></div>
          <div class="bg-gray-50 rounded-lg p-3 text-center"><span class="font-bold">Information Technology</span></div>
          <div class="bg-gray-50 rounded-lg p-3 text-center"><span class="font-bold">Electronics & Communication</span></div>
          <div class="bg-gray-50 rounded-lg p-3 text-center"><span class="font-bold">Mechanical Engineering</span></div>
          <div class="bg-gray-50 rounded-lg p-3 text-center"><span class="font-bold">Civil Engineering</span></div>
          <div class="bg-gray-50 rounded-lg p-3 text-center"><span class="font-bold">Cloud Computing</span></div>
        </div>

        <h2>📊 Engineering Placement Statistics</h2>
        <ul>
          <li>Top companies: TCS, Infosys, Microsoft, Amazon, IBM, Cisco, Intel, Dell, Wipro, Samsung</li>
          <li>Average package range: 4-8 LPA</li>
          <li>Highest package: 25+ LPA</li>
          <li>Placement rate: 85-95% in top colleges</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Dreamz College Engineering Support</h3>
          <p class="text-white/90">We provide free counseling for engineering admissions, help with JEE Main preparation, college selection, and placement assistance for eligible students.</p>
        </div>

        <h2>🎯 How Dreamz College Helps</h2>
        <ul>
          <li>Free career counseling for engineering aspirants</li>
          <li>College selection based on JEE score and 12th percentage</li>
          <li>Scholarship guidance to reduce education cost</li>
          <li>Admission process assistance from start to finish</li>
          <li>Placement support for eligible students</li>
        </ul>
      </div>
    `,
    author: "JuniorDream Team",
    date: "April 8, 2025",
    readTime: "7 min read",
    category: "Engineering",
    image: "/blog/Engineering.png",
    tags: ["Engineering", "B.Tech", "College Admission", "Dreamz College", "Delhi NCR"]
  },

  // ========== BLOG 6: MBA ADMISSIONS - PREMIUM VERSION ==========
  {
    id: "6",
    title: "MBA Admissions 2025: Complete Guide to Top B-Schools in Delhi NCR",
    slug: "mba-admissions-top-bschools-delhi-ncr",
    excerpt: "Dreamz College provides free MBA admission guidance. Get expert help with college selection, entrance exams, GD-PI preparation, and placement assistance.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">Delhi NCR is home to some of India's best B-schools with excellent placement records, strong industry connections, and unparalleled corporate exposure. Dreamz College helps you navigate the MBA admission journey successfully.</p>
        </div>

        <h2>📚 MBA Entrance Exams</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">CAT</span><br>Most prestigious, accepted by IIMs and top B-schools</div>
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">MAT</span><br>Conducted 4 times a year, easier than CAT</div>
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">XAT</span><br>For XLRI and other top B-schools</div>
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">CMAT</span><br>For AICTE approved colleges</div>
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">GMAT</span><br>For international MBA programs</div>
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">NMAT</span><br>For NMIMS and other top B-schools</div>
        </div>

        <h2>🏛️ Top MBA Colleges in Delhi NCR</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-xl mb-6">
            <thead class="bg-gray-50">
              <tr><th class="px-4 py-3 text-left">College Name</th><th class="px-4 py-3 text-left">Average Package</th><th class="px-4 py-3 text-left">Key Recruiters</th></tr>
            </thead>
            <tbody>
              <tr><td class="px-4 py-3 border-t">GNIOT MBA Program</td><td class="px-4 py-3 border-t">7-10 LPA</td><td class="px-4 py-3 border-t">Deloitte, KPMG, Amazon</td></tr>
              <tr><td class="px-4 py-3 border-t">Mangalmay Institute</td><td class="px-4 py-3 border-t">6-9 LPA</td><td class="px-4 py-3 border-t">ICICI, HDFC, Accenture</td></tr>
              <tr><td class="px-4 py-3 border-t">ITS School of Management</td><td class="px-4 py-3 border-t">5-8 LPA</td><td class="px-4 py-3 border-t">Wipro, Tech Mahindra</td></tr>
              <tr><td class="px-4 py-3 border-t">Lloyd Institute</td><td class="px-4 py-3 border-t">6-9 LPA</td><td class="px-4 py-3 border-t">BYJU'S, JustDial, PolicyBazaar</td></tr>
            </tbody>
          </table>
        </div>

        <h2>📊 Popular MBA Specializations</h2>
        <ul>
          <li>Marketing - Highest demand, diverse opportunities</li>
          <li>Finance - Banking, investment, corporate finance roles</li>
          <li>Human Resources - Recruitment, training, employee relations</li>
          <li>Operations - Supply chain, logistics, production management</li>
          <li>Business Analytics - Data-driven decision making</li>
          <li>International Business - Global trade and MNC roles</li>
          <li>Digital Marketing - Growing field with high demand</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Dreamz College MBA Support</h3>
          <p class="text-white/90">Free MBA counseling, entrance exam guidance, college selection, GD-PI preparation, and placement assistance for eligible students.</p>
        </div>
      </div>
    `,
    author: "JuniorDream Team",
    date: "April 6, 2025",
    readTime: "6 min read",
    category: "MBA",
    image: "/blog/mba.png",
    tags: ["MBA", "Admission", "B-School", "Dreamz College", "Placement"]
  },

  // ========== BLOG 7: NURSING & MEDICAL - PREMIUM VERSION ==========
  {
    id: "7",
    title: "Medical & Nursing College Admissions 2025: Complete Career Guide",
    slug: "medical-nursing-college-admissions",
    excerpt: "Dreamz College helps students get admission in B.Sc Nursing, GNM, ANM, and other medical courses. Free counseling, college selection, and placement support available.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">Healthcare is one of the fastest-growing sectors in India. Nurses and medical professionals are in high demand in hospitals, clinics, and abroad. Dreamz College helps you build a successful healthcare career.</p>
        </div>

        <h2>📚 Nursing Courses Available</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">B.Sc Nursing</span><br>4 years, most popular nursing degree</div>
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">GNM</span><br>3.5 years, General Nursing and Midwifery</div>
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">ANM</span><br>2 years, Auxiliary Nursing Midwifery</div>
          <div class="bg-white border border-gray-200 rounded-xl p-4"><span class="font-bold text-purple-600">Post Basic B.Sc Nursing</span><br>2 years, for GNM graduates</div>
        </div>

        <h2>📊 Eligibility Criteria</h2>
        <ul>
          <li>10+2 with PCB (Physics, Chemistry, Biology) with 45-50% marks</li>
          <li>Minimum age 17 years at the time of admission</li>
          <li>Some colleges require entrance exam scores (NEET for some courses)</li>
        </ul>

        <h2>🏛️ Top Nursing Colleges We Partner With</h2>
        <ul>
          <li>GNIOT Institute of Medical Sciences</li>
          <li>Metro College of Nursing</li>
          <li>ITS Health Sciences</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Career Opportunities in Nursing</h3>
          <p class="text-white/90">Starting salary: 2.5-4 LPA | Experienced: 6-10 LPA | International opportunities in UK, USA, Canada, Australia, Gulf countries</p>
        </div>
      </div>
    `,
    author: "JuniorDream Team",
    date: "April 4, 2025",
    readTime: "5 min read",
    category: "Medical",
    image: "/blog/medical.png",
    tags: ["Nursing", "Medical", "B.Sc Nursing", "Dreamz College", "Healthcare"]
  },

  // ========== BLOG 8: LAW ADMISSIONS - PREMIUM VERSION ==========
  {
    id: "8",
    title: "Law Admissions 2025: Complete Guide to BA LLB, LLB, and LLM",
    slug: "law-admissions-ba-llb-llb-guide",
    excerpt: "Dreamz College provides free law admission guidance. Get expert help with college selection, CLAT preparation, and placement assistance in law firms.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">Law is a prestigious and rewarding career option with opportunities in litigation, corporate law, judiciary, legal process outsourcing, and more. Dreamz College helps you navigate the law admission journey.</p>
        </div>

        <h2>📚 Law Courses Available</h2>
        <ul>
          <li><strong>BA LLB (5 years)</strong> - Integrated course after 12th for arts/commerce students</li>
          <li><strong>B.Com LLB (5 years)</strong> - For commerce students interested in corporate law</li>
          <li><strong>LLB (3 years)</strong> - For graduates from any discipline</li>
          <li><strong>LLM (2 years)</strong> - Postgraduate specialization in various law fields</li>
        </ul>

        <h2>📊 Career Opportunities in Law</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-xl mb-6">
            <thead class="bg-gray-50"><tr><th class="px-4 py-3">Career Path</th><th class="px-4 py-3">Salary Range</th></tr></thead>
            <tbody>
              <tr><td class="px-4 py-3 border-t">Corporate Lawyer</td><td class="px-4 py-3 border-t">5-12 LPA</td></tr>
              <tr><td class="px-4 py-3 border-t">Criminal Lawyer</td><td class="px-4 py-3 border-t">3-8 LPA</td></tr>
              <tr><td class="px-4 py-3 border-t">Legal Advisor</td><td class="px-4 py-3 border-t">4-10 LPA</td></tr>
              <tr><td class="px-4 py-3 border-t">Judiciary Services</td><td class="px-4 py-3 border-t">8-15 LPA</td></tr>
              <tr><td class="px-4 py-3 border-t">Legal Process Outsourcing</td><td class="px-4 py-3 border-t">3-7 LPA</td></tr>
            </tbody>
          </table>
        </div>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Dreamz College Law Support</h3>
          <p class="text-white/90">Free law admission counseling, CLAT preparation guidance, college selection, and placement assistance for eligible students.</p>
        </div>
      </div>
    `,
    author: "JuniorDream Team",
    date: "April 2, 2025",
    readTime: "4 min read",
    category: "Law",
    image: "/blog/law.png",
    tags: ["Law", "BA LLB", "LLB", "Dreamz College", "CLAT"]
  },

  // ========== BLOG 9: BCA & BBA - PREMIUM VERSION ==========
  {
    id: "9",
    title: "BCA & BBA Admissions 2025: Top Colleges in Delhi NCR",
    slug: "bca-bba-admissions-top-colleges",
    excerpt: "Dreamz College helps students get admission in BCA and BBA programs. Free counseling, college selection, and placement assistance available for eligible students.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Overview</h2>
          <p class="text-gray-700">BCA and BBA are popular undergraduate programs that lead to excellent career opportunities in IT, management, and corporate sectors. Dreamz College helps you choose the right path.</p>
        </div>

        <h2>📚 BCA vs BBA: Which One to Choose?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-white border border-gray-200 rounded-xl p-5"><span class="font-bold text-purple-600 text-lg">BCA</span><br>Focuses on computer applications, programming, software development. Ideal for students interested in IT careers. Starting salary: 3-6 LPA</div>
          <div class="bg-white border border-gray-200 rounded-xl p-5"><span class="font-bold text-purple-600 text-lg">BBA</span><br>Focuses on management, marketing, finance, HR. Ideal for students interested in business careers. Starting salary: 3-5 LPA</div>
        </div>

        <h2>📊 Career Opportunities</h2>
        <ul>
          <li><strong>After BCA:</strong> Software Developer, Web Developer, Data Analyst, System Administrator, Cloud Architect, Database Administrator</li>
          <li><strong>After BBA:</strong> Marketing Executive, HR Associate, Business Analyst, Operations Manager, Entrepreneur, Sales Manager</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Dreamz College BCA/BBA Support</h3>
          <p class="text-white/90">Free counseling, college selection, admission assistance, and placement support for eligible students.</p>
        </div>
      </div>
    `,
    author: "JuniorDream Team",
    date: "March 30, 2025",
    readTime: "5 min read",
    category: "BCA-BBA",
    image: "/blog/bbabca.png",
    tags: ["BCA", "BBA", "Computer Applications", "Management", "Dreamz College"]
  },

  // ========== BLOG 10: WHY DREAMZ COLLEGE - PREMIUM VERSION ==========
  {
    id: "10",
    title: "Why Dreamz College is India's Most Trusted Education Counseling Platform",
    slug: "why-choose-dreamz-college",
    excerpt: "Discover why 50,000+ students trust Dreamz College for career guidance. 100% free service, expert counselors, 38+ partner colleges, and placement assistance.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Trusted by 50,000+ Students</h2>
          <p class="text-gray-700">Since 2015, Dreamz College has been the preferred choice for students seeking genuine, free, and expert education counseling. Our track record speaks for itself.</p>
        </div>

        <h2>📊 Our Impact by the Numbers</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-center">
          <div class="bg-gray-50 rounded-xl p-4"><span class="text-3xl font-bold text-purple-600">8+</span><br>Years Experience</div>
          <div class="bg-gray-50 rounded-xl p-4"><span class="text-3xl font-bold text-purple-600">50K+</span><br>Students Guided</div>
          <div class="bg-gray-50 rounded-xl p-4"><span class="text-3xl font-bold text-purple-600">38+</span><br>Partner Colleges</div>
          <div class="bg-gray-50 rounded-xl p-4"><span class="text-3xl font-bold text-purple-600">98%</span><br>Success Rate</div>
        </div>

        <h2>💪 What Makes Us Different</h2>
        <ul>
          <li><strong>100% Free Service</strong> - We never charge students for our counseling services</li>
          <li><strong>Expert Counselors</strong> - 50+ experienced education professionals</li>
          <li><strong>Wide College Network</strong> - 38+ partner colleges across Delhi NCR</li>
          <li><strong>Placement Support</strong> - Assistance for eligible students</li>
          <li><strong>End-to-End Support</strong> - From counseling to placement</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
          <p class="text-white/90">Book your free counseling session today and take the first step towards your dream career!</p>
        </div>
      </div>
    `,
    author: "JuniorDream Team",
    date: "March 28, 2025",
    readTime: "4 min read",
    category: "Dreamz College",
    image: "/blog/Why.png",
    tags: ["Dreamz College", "Counseling", "Placement", "Free Service", "Career Guidance"]
  },

  // ========== BLOG 11: ADMISSION WITHOUT DONATION - PREMIUM VERSION ==========
  {
    id: "11",
    title: "College Admission Without Donation: Genuine Guidance by Dreamz College",
    slug: "college-admission-without-donation",
    excerpt: "Dreamz College helps students get genuine college admissions without any donation. Merit-based and management quota admissions with complete transparency.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">Myth vs Reality</h2>
          <p class="text-gray-700">Many students and parents believe that getting admission in top colleges requires paying heavy donations. This is not true! There are many ways to get merit-based and genuine management quota admissions.</p>
        </div>

        <h2>📚 Genuine Admission Pathways</h2>
        <ul>
          <li><strong>Merit-Based Admission</strong> - Based on entrance exam scores and 12th percentage</li>
          <li><strong>Management Quota</strong> - Filled based on merit, not donation</li>
          <li><strong>Scholarship-Based Admission</strong> - Based on academic performance or financial need</li>
          <li><strong>Direct Admission</strong> - Based on 12th percentage in some colleges</li>
        </ul>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Dreamz College Commitment</h3>
          <p class="text-white/90">We help students get admission without any donation. Our counseling is completely free, and we guide you through transparent admission processes.</p>
        </div>
      </div>
    `,
    author: "JuniorDream Team",
    date: "March 25, 2025",
    readTime: "4 min read",
    category: "Admission",
    image: "/blog/Admission.png",
    tags: ["Admission", "No Donation", "Merit", "Dreamz College", "Transparent Admission"]
  },

  // ========== BLOG 12: B.TECH LATERAL ENTRY - PREMIUM VERSION ==========
  {
    id: "12",
    title: "B.Tech Lateral Entry 2025: Complete Guide for Diploma Holders",
    slug: "btech-lateral-entry-complete-guide",
    excerpt: "Dreamz College helps diploma holders get direct admission to second year of B.Tech. Free counseling, college selection, and placement support available.",
    content: `
      <div class="prose prose-lg max-w-none">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mt-0">What is B.Tech Lateral Entry?</h2>
          <p class="text-gray-700">Lateral Entry allows diploma holders to directly join the second year of B.Tech programs, saving one year of study. This is an excellent opportunity for diploma graduates to upgrade to a degree.</p>
        </div>

        <h2>📚 Benefits of Lateral Entry</h2>
        <ul>
          <li>Save one year of education time</li>
          <li>Same degree as regular B.Tech students</li>
          <li>Same placement opportunities</li>
          <li>Lower overall fee compared to 4-year program</li>
        </ul>

        <h2>📊 Eligibility Criteria</h2>
        <ul>
          <li>Diploma in Engineering with 45-50% marks</li>
          <li>Valid UPSEE / LEET score (in some states)</li>
          <li>Some colleges offer direct admission based on diploma percentage</li>
        </ul>

        <h2>🏛️ Top Colleges Offering Lateral Entry</h2>
        <p>GNIOT, Mangalmay, ITS, Accurate Institute, and many other AKTU-affiliated colleges offer lateral entry admission. Contact Dreamz College for the complete list.</p>

        <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl my-8 text-center">
          <h3 class="text-2xl font-bold mb-2">Dreamz College Lateral Entry Support</h3>
          <p class="text-white/90">Free counseling, college selection, admission assistance, and placement support for eligible students.</p>
        </div>
      </div>
    `,
    author: "JuniorDream Team",
    date: "March 22, 2025",
    readTime: "5 min read",
    category: "Engineering",
    image: "/blog/Lateral.png",
    tags: ["Lateral Entry", "Diploma", "B.Tech", "Admission", "Dreamz College"]
  }
];

export const categories = [
  "All", 
  "JuniorDream", 
  "Dreamz College", 
  "Placement", 
  "Counseling", 
  "Engineering", 
  "MBA", 
  "Medical", 
  "Law", 
  "BCA-BBA", 
  "Admission"
];