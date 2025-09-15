import { LanguageLabel, ProjectFilter, Tool, Languages } from '@/types';
import { MonitorCog, Gpu, TabletSmartphone, Lightbulb } from 'lucide-react';

// Tools/Tech Stack
export const tools:Tool[] = [
  { id: 'js', name: 'Javascript', icon: 'javascript.png', category: 'programming language', section: 'Frontend', selected: false, details: 'Dynamic programming language for web development and interactive user interfaces.', projects: ['AiChat', 'Suma'] },
  { id: 'ts', name: 'TypeScript', icon: 'typescript.svg', category: 'programming language', section: 'Frontend', selected: false, details: 'Typed superset of JavaScript that adds static type definitions for better code quality.', projects: ['AiChat', 'Suma'] },
  { id: 'svelte', name: 'SvelteKit', icon: 'svelte.svg', category: 'frontend framework', section: 'Frontend', selected: false, details: 'Modern web framework that compiles components to efficient vanilla JavaScript.', projects: ['AiChat', 'Suma'] },
  { id: 'next', name: 'Next.JS', icon: 'nextjs.png', category: 'framework', section: 'Frontend', selected: false, details: '2 years Experience, used for both as a Frontend and Fullstack. familiar with App Router, with integration with Tanstack Query, Zustand, Drizzle ORM, and Docker.', projects: ['AiChat', 'Suma'] },
  { id: 'react', name: 'React.JS', icon: 'reactjs-square.png', category: 'frontend library', section: 'Frontend', selected: false, details: 'JavaScript library for building user interfaces with component-based architecture.', projects: ['AiChat', 'Suma'] },
  { id: 'zustand', name: 'Zustand', icon: 'zustand.jpeg', category: 'state management', section: 'Frontend', selected: false, details: 'Lightweight state management solution for React applications with minimal boilerplate.', projects: ['AiChat', 'Suma'] },
  { id: 'tanstack', name: 'Tanstack', icon: 'tanstack.png', category: 'data fetching', section: 'Frontend', selected: false, details: 'Powerful data synchronization library for fetching, caching, and updating server state.', projects: ['AiChat', 'Suma'] },
  { id: 'postgres', name: 'PostgreSQL', icon: 'postgresql.png', category: 'relational database', section: 'Backend', selected: false, details: 'Advanced open-source relational database with robust features and SQL compliance.', projects: ['AiChat', 'Suma'] },
  { id: 'mysql', name: 'MySQL', icon: 'mysql.png', category: 'relational database', section: 'Backend', selected: false, details: 'Popular open-source relational database management system for web applications.', projects: ['AiChat', 'Proedu', 'Energy Logistics']},
  { id: 'drizzle', name: 'Drizzle', icon: 'drizzle.png', category: 'ORM', section: 'Backend', selected: false, details: 'TypeScript ORM with type-safe database queries and excellent developer experience.', projects: ['AiChat', 'Suma'] },
  { id: 'docker', name: 'Docker', icon: 'docker.webp', category: 'containerization', section: 'Other Service', selected: false, details: 'Platform for developing, shipping, and running applications using containerization technology.', projects: ['AiChat', 'Suma'] },
  { id: 'nest', name: 'Nest.JS', icon: 'nestjs.png', category: 'backend framework', section: 'Backend', selected: false, details: 'Progressive Node.js framework for building scalable server-side applications with TypeScript.', projects: ['AiChat', 'Suma'] },
  { id: 'expo', name: 'React Expo', icon: 'expo.png', category: 'mobile framework', section: 'Frontend', selected: false, details: 'React Native Framework to create mobile app using React. very helpful since it also provide development build app and other usefull function like OTA update and EAS', projects: ['AiChat', 'Proedu'] },
  { id: 'tailwind', name: 'Tailwind CSS', icon: 'tailwind.png', category: 'CSS framework', section: 'Frontend', selected: false, details: 'Utility-first CSS framework for rapidly building custom user interfaces.', projects: ['AiChat', 'Suma', 'Energy Logistics']},
  { id: 'framer-motion', name: 'Framer Motion', icon: 'framer-motion.svg', category: 'animation library', section: 'Frontend', selected: false, details: 'React library for building performant and scalable animations and transitions.', projects: ['Personaize']},
  { id: 'bootstrap', name: 'Bootstrap', icon: 'bootstrap.png', category: 'CSS framework', section: 'Frontend', selected: false, details: 'Popular CSS framework for developing responsive and mobile-first websites.', projects: ['AiChat', 'Suma', 'Energy Logistics']},
  { id: 'mantine', name: 'Mantine', icon: 'mantine.png', category: 'UI library', section: 'Frontend', selected: false, details: 'React components library with native dark theme support and flexible customization.', projects: ['AiChat', 'Suma', 'Energy Logistics']},
  { id: 'heroui', name: 'Hero UI', icon: 'hero-ui.webp', category: 'UI library', section: 'Frontend', selected: false, details: 'Modern React UI library with beautiful components and excellent accessibility features.', projects: ['Suma']},
  { id: 'laravel', name: 'Laravel', icon: 'laravel.jpeg', category: 'backend framework', section: 'Backend', selected: false, details: 'PHP web application framework with expressive syntax and robust features for web development.', projects: ['AiChat', 'Suma'] },
  { id: 'ci', name: 'Codeigniter', icon: 'codeigniter.png', category: 'backend framework', section: 'Backend', selected: false, details: 'Lightweight PHP framework with simple configuration and excellent performance.', projects: ['Energy Logistics', 'Proedu', 'Izistay']},
  { id: 'jquery', name: 'jQuery', icon: 'jquery2.svg', category: 'JavaScript library', section: 'Frontend', selected: false, details: 'Fast and lightweight JavaScript library for DOM manipulation and event handling.', projects: ['Energy Logistics', 'Izistay', 'Proedu']},
  { id: 'alpine', name: 'Alpine JS', icon: 'alpinejs.png', category: 'JavaScript framework', section: 'Frontend', selected: false, details: 'Minimal framework for composing JavaScript behavior directly in HTML markup.', projects: ['Energy Logistics']},
  { id: 'socketio', name: 'Socket.IO', icon: 'socket-io.svg', category: 'real-time communication', section: 'Backend', selected: false, details: 'Real-time bidirectional event-based communication library for web applications.', projects: ['AiChat']},
  { id: 'zod', name: 'zod', icon: 'zod.jpeg', category: 'schema validation', section: 'Backend', selected: false, details: 'TypeScript-first schema validation library with static type inference.', projects: ['AiChat']},
  { id: 'formik', name: 'Formik', icon: 'formik.png', category: 'form library', section: 'Frontend', selected: false, details: 'React library for building forms with validation, error handling, and field management.', projects: ['AiChat']},
  { id: 'react-hook-form', name: 'React Hook Form', icon: 'react-hook-form.png', category: 'form library', section: 'Frontend', selected: false, details: 'Performant, flexible forms library with easy validation and minimal re-renders.', projects: ['Suma']},
  { id: 'vite', name: 'Vite', icon: 'vite.png', category: 'build tool', section: 'Frontend', selected: false, details: 'Fast build tool and development server with hot module replacement for modern web projects.', projects: ['AiChat']},
  { id: 'prisma', name: 'Prisma ORM', icon: 'prisma.webp', category: 'ORM', section: 'Backend', selected: false, details: 'Modern database toolkit with type-safe client and intuitive data modeling.', projects: ['Suma']},
  { id: 'claude', name: 'Calude (Anthropic)', icon: 'claude.svg', category: 'AI model', section: 'AI', selected: false, details: 'Advanced AI assistant by Anthropic for natural language processing and conversation.', projects: ['AIChat']},
  { id: 'gemini', name: 'Google Gemini', icon: 'gemini-old.png', category: 'AI model', section: 'AI', selected: false, details: 'Google\'s multimodal AI model for text, image, and code generation tasks.', projects: ['AIChat']},
  { id: 'deepseek', name: 'Deepseek', icon: 'deepseek.png', category: 'AI model', section: 'AI', selected: false, details: 'Powerful AI model optimized for coding and technical problem-solving tasks.', projects: ['AIChat']},
  { id: 'vscode', name: 'Visual Studio Code', icon: 'vscode.png', category: 'code editor', section: 'Code Editor', selected: false, details: 'Popular source code editor with rich ecosystem of extensions and integrated terminal.', projects: ['AIChat']},
  { id: 'cursor', name: 'Cursor', icon: 'cursor.png', category: 'AI-powered editor', section: 'Code Editor', selected: false, details: 'AI-enhanced code editor with intelligent suggestions and automated code generation.', projects: ['Suma']},
  { id: 'qoder', name: 'Qoder', icon: 'qoder.png', category: 'AI-powered editor', section: 'Code Editor', selected: false, details: 'Advanced AI-powered development environment with intelligent code assistance and collaboration.', projects: ['Personaize']},
  { id: 'void', name: 'Void', icon: 'void.png', category: 'code editor', section: 'Code Editor', selected: false, details: 'Minimalist code editor focused on speed and simplicity for efficient coding workflow.', projects: ['Personaize']},
  { id: 'supabase', name: 'Supabase', icon: 'supabase.jpeg', category: 'BaaS (Backend as a Service)', section: 'Backend', selected: false, details: 'Provides a managed PostgreSQL database and other essential backend tools (authentication, serverless functions, etc)', projects: ['Personaice']},
  { id: 'neondb', name: 'Neon DB', icon: 'neondb.jpeg', category: 'Cloud Database Service (postgresql)', section: 'Backend', selected: false, details: 'Cloud-native, serverless, fully managed PostgreSQL database service', projects: ['Suma']},
  { id: 'firebase', name: 'Firebase', icon: 'firebase2.png', category: 'BaaS (Backend as a Service)', section: 'Backend', selected: false, details: 'Set of backend cloud computing services and application development platforms provided by Google', projects: ['AiChat']},
  { id: 'github', name: 'Github', icon: 'github.png', category: 'Git', section: 'Other Service', selected: false, details: 'Git platform to store, share, and work together with others to write code', projects: ['Izistay, Proedu, Suma, AiChat, Personaize']},
  { id: 'gitlab', name: 'Gitlab', icon: 'gitlab.png', category: 'Git', section: 'Other Service', selected: false, details: 'Git platform to store, share, and work together with others to write code', projects: ['AiChat']},
  { id: 'netlify', name: 'Netlify', icon: 'netlify.webp', category: 'Deployment', section: 'Other Service', selected: false, details: 'Fast Static Web Hosting with Continuous Deployment by Vercel', projects: ['Portfolio Ani']},
  { id: 'cloudflare', name: 'Cloudflare', icon: 'cloudflare.jpg', category: 'CDN', section: 'Other Service', selected: false, details: 'Cloudflare is a global CDN and DDoS protection service.', projects: ['Personaize', 'Suma']},
  { id: 'nginx', name: 'Nginx', icon: 'nginx.webp', category: 'Web Server', section: 'Other Service', selected: false, details: 'High-performance web server and reverse proxy server.', projects: ['Personaize', 'Suma']},
  { id: 'slack', name: 'Slack', icon: 'slack.png', category: 'Team Collaboration', section: 'Other Service', selected: false, details: 'Slack is a communication platform that connects teams and enables them to work together more efficiently.', projects: ['AiChat']},
  { id: 'clickup', name: 'Clickup', icon: 'clickup.png', category: 'Project Management', section: 'Other Service', selected: false, details: 'All-in-one work management platform that helps teams stay organized and productive.', projects: ['AiChat']},
  { id: 'ryver', name: 'Ryver', icon: 'ryver.webp', category: 'Team Management', section: 'Other Service', selected: false, details: 'Communication and collaboration platform for teams, similar to Slack.', projects: ['AiChat']},
];

// Translations
export const translations:Languages = {
  EN: {
    myWorks: "My Works",
    contactMe: "Contact Me",
    downloadCV: "Download CV",
    title: "Website Developer for 7 years.",
    subtitle: "ready to transform and grow your business together",
    name: "Rizkianto Akbar",
    roles: [
      {
        title: "Frontend",
        icon: Gpu,
      },
      {
        title: "Software Engineer",
        icon: MonitorCog,
      },
      {
        title: "Product Maker",
        icon: Lightbulb,
      },
    ],
    location: "Indonesia (Bogor)",
    tagline: "Looking to collaborate? Put your request through the form below.",
    agentDescription: "A custom AI will analyze our potential match.",
    storedTagline: "Hello {email}, you still there?",
    storedDescription: "We have analyzed your description before, click 'view' to check it out.",
    writeDescription: "Write description",
    sampleAgentValue: `Job Requirements Example

Position: Frontend Web Developer

Experience Required: 2+ years

Key Technologies:
- Frontend & Fullstack development
- App Router architecture
- State management with **Zustand**
- API handling with **Tanstack Query**
- Database ORM with **Drizzle**
- Containerization with **Docker**

What to include in your job posting:
1. **Job Title** and **Company Name**
2. **Required Experience Level**
3. **Specific Technologies** or frameworks
4. **Employment Type** (Remote/On-site/Hybrid)
5. **Key Responsibilities**

*Tip: The more specific you are, the better the analysis will be!*`,
    uploadJobPoster: "Upload job poster",
    pasteLink: "Paste Link",
    requirementPlaceholder: "Paste your requirement here...",
    requirementHelp: "don't know what exactly you are looking for? or you need help to define the requirement? I have created one tools to help you out, check here!",
    analyzeProfile: "Analyze Profile",
    toolsTitle: "The Tools of My Craft",
    toolsSubtitle: "select one or more tools to find out more details",
    projects: "Experience Milestone",
    all: "All",
    companyRoles: "Company & Roles",
    taskResponsibility: "Task & Responsibility",
    portfolio: "Portfolio",
    fulltime: "Fulltime Employee",
    contract: "Contract employee",
    freelance: "Freelance",
    remote: "Remote",
    officialActive: "Official Link (Active)",
    officialInactive: "Official Link (Inactive)",
    tribute: "Tribute",
    nextExperience: "2 years Experience, used for both as a Frontend and Fullstack. familiar with App Router, with integration with Tanstack Query, Zustand, Drizzle ORM, and Docker.",
    shipmentTracking: "SHIPMENT TRACKING"
  },
  ID: {
    myWorks: "Karya Saya",
    contactMe: "Hubungi Saya",
    downloadCV: "Unduh CV",
    title: "Pembuat Website selama 7 tahun.",
    subtitle: "siap untuk membantu digitalisasi bisnis Anda!",
    name: "Rizkianto Akbar",
    roles: [
      {
        title: "Front End",
        icon: Gpu,
      },
      {
        title: "Software Engineer",
        icon: MonitorCog,
      },
      {
        title: "Product Maker",
        icon: Lightbulb,
      },
    ],
    location: "Indonesia (Bogor)",
    tagline: "Apakah saya orang yang anda cari? Cepat cek sekarang!",
    agentDescription: "Tulis deskripsi sejelas mungkin untuk hasil yang lebih baik",
    storedTagline: "Halo apakah kamu {email}",
    storedDescription: "Kamu telah mendapatkan analisa dari deskripsi sebelumnya, klik 'view' untuk melihatnya.",
    writeDescription: "Tulis deskripsi",
    sampleAgentValue: `## Contoh Persyaratan Pekerjaan

**Posisi:** Frontend Web Developer

**Pengalaman yang Dibutuhkan:** 2+ tahun

**Teknologi Utama:**
- Pengembangan Frontend & Fullstack
- Arsitektur App Router
- Manajemen state dengan **Zustand**
- Penanganan API dengan **Tanstack Query**
- Database ORM dengan **Drizzle**
- Kontainerisasi dengan **Docker**

**Yang perlu disertakan dalam posting pekerjaan:**
1. **Nama Posisi** dan **Nama Perusahaan**
2. **Level Pengalaman yang Dibutuhkan**
3. **Teknologi Spesifik** atau framework
4. **Jenis Pekerjaan** (Remote/On-site/Hybrid)
5. **Tanggung Jawab Utama**

*Tips: Semakin spesifik informasi yang diberikan, semakin baik hasil analisisnya!*`,
    uploadJobPoster: "Unggah poster pekerjaan",
    pasteLink: "Tempel Tautan",
    requirementPlaceholder: "Tempel kebutuhan Anda di sini...",
    requirementHelp: "tidak tahu persis apa yang Anda cari? atau butuh bantuan untuk mendefinisikan kebutuhan? Saya telah membuat alat untuk membantu Anda, cek di sini!",
    analyzeProfile: "Analisis Profil",
    toolsTitle: "Alat-alat Keahlian Saya",
    toolsSubtitle: "pilih satu atau lebih tools untuk mengetahui detail lebih lanjut",
    projects: "Pengalaman Kerja",
    all: "Semua",
    companyRoles: "Perusahaan & Peran",
    taskResponsibility: "Tugas & Tanggung Jawab",
    portfolio: "Portofolio",
    fulltime: "Karyawan Tetap",
    contract: "Karyawan Kontrak",
    freelance: "Freelance",
    remote: "Remote",
    officialActive: "Link Resmi (Aktif)",
    officialInactive: "Link Resmi (Tidak Aktif)",
    tribute: "Tribute",
    nextExperience: "Digunakan selama 2 tahun, pengalaman pertama saat bekerja di AiChat sering menggunakan app router, memiliki pengalaman menggunakannya sebagai FullStack mandiri atau sebagai Tech Stack Frontend khusus.",
    shipmentTracking: "PELACAKAN PENGIRIMAN"
  }
};