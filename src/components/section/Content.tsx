/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useContext } from 'react';
import { 
  MapPin,
  Calendar1,
  BriefcaseBusiness,
  HandHeart,
  PlaneTakeoff,
  Wand
} from 'lucide-react';
import { ProjectFilter } from '@/types';
import { RootContext } from '@/contexts/RootContext';
import Navbar from './Navbar';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '../ui/label';
import { tools } from '@/data';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

enum Role {
  FrontendWebDeveloper = "Frontend Web Developer",
  BackendDeveloper = "Backend Developer",
  MobileDeveloper = "Mobile Developer",
  FullstackDeveloper = "Fullstack Developer",
  Designer = "Designer",
  QA = "QA",
  ProjectManager = "Project Manager",
  Other = "Other",
}

const Content = () => {
  const context = useContext(RootContext);
  
  if (!context) {
    throw new Error('RootContext is not available')
  }

  const { language, t, projectFilters, setProjectFilters, viewMode } = context;
  // Projects Data with translated content
  const getProjects = () => {
    const isEN = language === 'EN';
    return [
      {
        id: 1,
        title: "AI Chatbot (CXM)",
        company: "AiChat Pte Ltd (PT Aichat Teknologi Indonesia)",
        duration: isEN ? "Fulltime Employee for 3 years (2022 - 2025)" : "Karyawan Tetap selama 3 tahun (2022 - 2025)",
        type: "Portfolio",
        badges: [isEN ? "Official Link (Active)" : "Link Resmi (Aktif)", "Tribute"],
        remote: true,
        location: "Remote",
        date: "Jan 2022 - Apr 2025",
        features: isEN ? [
          "Develop new Aichat and Client Specific Feature on website CMS v1.0 using React.JS and Laravel, CMS v2.0 using Next.JS, mobile app using React Native, and webchat widget using Native Javascript and web socket",
          "Developed new UI features to seamlessly integrate chatbots with various platforms (e.g., Instagram, Google), significantly reducing user effort and increasing operational efficiency on the AiChat platform",
          "Brainstorming, Discuss, and Coordinating with Product Manager and Backend Developer in order to deliver robust feature",
          "Provided technical explanations to Account Managers, leading to successful client feature adoption/satisfaction",
          "Tracking, Monitoring, and Fixing issue on mobile app, CMS, and web widget"
        ] : [
          "Mengembangkan fitur baru Aichat dan Klien Spesifik pada website CMS v1.0 menggunakan React.JS dan Laravel, CMS v2.0 menggunakan Next.JS, aplikasi mobile menggunakan React Native, dan widget webchat menggunakan Native Javascript dan web socket",
          "Mengembangkan fitur UI baru untuk mengintegrasikan chatbot dengan berbagai platform (mis., Instagram, Google), secara signifikan mengurangi upaya pengguna dan meningkatkan efisiensi operasional pada platform AiChat",
          "Brainstorming, Diskusi, dan Koordinasi dengan Product Manager dan Backend Developer untuk menghasilkan fitur yang robust",
          "Memberikan penjelasan teknis kepada Account Manager, yang menghasilkan adopsi/kepuasan fitur klien yang sukses",
          "Melacak, Memantau, dan Memperbaiki masalah pada aplikasi mobile, CMS, dan widget web"
        ],
        techStack: ["next", "react", "vite", "expo", "js", "ts", "zustand", "formik", "socketio", "tailwind", "laravel", "bootstrap"],
        images: ["aichat.png", "aichat2.png"],
        roles: [Role.FrontendWebDeveloper, Role.MobileDeveloper],
      },
      {
        id: 2,
        title: isEN ? "Logistic Management" : "Management Logistik",
        company: "PT Energy Logistics",
        duration: isEN ? "Contract employee for 6 month (June - December 2025)" : "Karyawan Kontrak selama 6 bulan (Juni - Desember 2025)",
        location: isEN ? "South Jakarta" : "Jakarta Selatan",
        date: "Jun 2025 - Current",
        badges: [isEN ? "Official Link (Active)" : "Link Resmi (Aktif)", "Tribute"],
        type: "Portfolio",
        features: isEN ? [
          "Participate in migration from PHP 5 Native into CodeIgniter 3 with jQuery and Bootstrap",
          "Initiate gradual migration by injecting Alpine JS and tailwindcss along with Codeigniter 3",
          "Advising and planning future proof migration by using Next.JS, PostgreSQL, Nest.JS, including database normalization and migration from MySQL",
          "Redesign UI to be more readable, and easy to use for user",
          "Handling feature development, improvement, and bug fixing",
        ] : [
          "Berpartisipasi dalam migrasi dari PHP 5 Native ke CodeIgniter 3 dengan jQuery dan Bootstrap",
          "Menginisiasi migrasi bertahap dengan menggunakan Alpine JS and tailwindcss dalam Codeigniter 3",
          "Menyarankan dan merencanakan migrasi future proof dengan menggunakan Next.JS, PostgreSQL, Nest.JS, termasuk normalisasi database dan migrasi dari MySQL",
          "Mendesain ulang UI agar lebih mudah dibaca dan digunakan oleh pengguna",
          "Menghandle pengembangan dan peningkatan performa fitur, dan memperbaikin bug",
        ],
        techStack: ["ci","jquery","mysql", "js", "bootstrap", "tailwind", "alpine"],
        tracking: "shipment-tracking.png",
        images: ["enlog.png", "enlog2.png"],
        roles: [Role.FrontendWebDeveloper],
      },
      {
        id: 3,
        title: "LMS for Teacher",
        company: "Proedu (PT Alhasan Prima Edukasi)",
        duration: isEN ? "Fulltime Employee for 1 years (2020 - 2021)" : "Karyawan Tetap selama 1 tahun (2020 - 2021)",
        location: isEN ? "Bintaro, South Jakarta" : "Bintaro, Jakarta Selatan",
        date: "Jan 2022 - Apr 2025",
        type: "Portfolio",
        badges: [isEN ? "Official (Inactive)" : "Resmi (Tidak Aktif)", "Tribute"],
        features: isEN ? [
          "Develop new feature and slicing UI/UX using React JS and Codeigniter",
          "Led the development of the initial React Native mobile app release within a 2 month timeline",
          "Coordinating with Backend to integrate REST API and UI/UX to develop new feature",
          "Participate in brainstorming with stakeholder to determine what feature or issue they want to add to platform"
        ] : [
          "Develop new feature and slicing UI/UX using React JS and Codeigniter",
          "Led the development of the initial React Native mobile app release within a 2 month timeline",
          "Coordinating with Backend to integrate REST API and UI/UX to develop new feature",
          "Participate in brainstorming with stakeholder to determine what feature or issue they want to add to platform"
        ],
        techStack: ["react", "expo", "js", "jquery" ,"ci", "mysql"],
        images: ["proedu2.png", "proedu3.png"],
        roles: [Role.FrontendWebDeveloper, Role.MobileDeveloper]
      },
      {
        id: 4,
        title: "Property Rent",
        company: "Izislay (PT Mega Kreasi Digital)",
        duration: isEN ? "Fulltime Employee for 1 years (2020 - 2021)" : "Karyawan Tetap selama 1 tahun (2020 - 2021)",
        location: isEN ? "Bintaro, South Jakarta" : "Bintaro, Jakarta Selatan",
        date: "Aug 2018 - Jul 2020",
        badges: [isEN ? "Official (Inactive)" : "Resmi (Tidak Aktif)", "Tribute"],
        type: "Portfolio",
        features: isEN ? [
          "Implemented UI/UX design using bootstrap",
          "Develop new feature using Codeigniter, JQuery, AJAX, and other tech stack  in supervision by Tech Lead",
          "Contributed to design discussion for feature flows, ensuring alignment with overall project objectives",
        ] : [
          "Implemented UI/UX design using bootstrap",
          "Develop new feature using Codeigniter, JQuery, AJAX, and other tech stack  in supervision by Tech Lead",
          "Contributed to design discussion for feature flows, ensuring alignment with overall project objectives",
        ],
        techStack: ["ci", "mysql", "js", "jquery"],
        images: ["izistay3.png", "izistay2.png"],
        roles: [Role.FullstackDeveloper]
      },
      {
        id: 5,
        title: isEN ? "Product Catalog (V2)" : "Katalog Produk (V2)",
        company: "Sumaplafon",
        type: "Portfolio",
        location: "Remote",
        badges: [isEN ? "Official (Active)" : "Resmi (Aktif)", "Tribute"],
        duration: "Freelance",
        date: "Dec 2024 - Mar 2025",
        features: isEN ? [
          "Develop the feature using Next JS, Prisma ORM, and PostgreSQL. then Deploy the app into VPS using Docker",
          "Communicate with client about feature, requirement, and development process ",
        ] : [
          "Develop the feature using Next JS, Prisma ORM, and PostgreSQL. then Deploy the app into VPS using Docker",
          "Communicate with client about feature, requirement, and development process ",
        ],
        techStack: ["next", "js", "ts", "prisma", "zustand", "docker"],
        images: ["suma-next.png", "suma-next-2.png"],
        roles: [Role.FullstackDeveloper]
      },
      {
        id: 6,
        title: isEN ? "Product Catalog" : "Katalog Produk",
        company: "Sumaplafon",
        type: "Portfolio",
        location: "Remote",
        badges: [isEN ? "Official (Inactive)" : "Resmi (Tidak Aktif)"],
        duration: "Freelance",
        date: "Feb 2020 - May 2020",
        features: isEN ? [
          "Design wireframe, database, and decide tech stack to be used in the system using Laravel and Boostrap",
          "Maintain, Fixing, and Checking issues "
        ] : [
          "Design wireframe, database, and decide tech stack to be used in the system using Laravel and Boostrap",
          "Maintain, Fixing, and Checking issues "
        ],
        techStack: ["laravel", "mysql", "bootstrap"],
        images: ["suma-next.png", "suma-next-2.png"],
        roles: [Role.FullstackDeveloper],
      }
    ];
  };

  // Handle filter changes
  const handleFilterChange = (filter: keyof ProjectFilter) => {
    if (filter === 'all') {
      setProjectFilters({
        all: true,
        companyRoles: false,
        taskResponsibility: false,
        portfolio: false
      });
    } else {
      const newFilters = { ...projectFilters, [filter]: !projectFilters[filter as keyof ProjectFilter] };
      // If any other filter is active, deactivate "all"
      if (newFilters.companyRoles || newFilters.taskResponsibility || newFilters.portfolio) {
        newFilters.all = false;
      }
      // If no filters are active, activate "all"
      if (!newFilters.companyRoles && !newFilters.taskResponsibility && !newFilters.portfolio) {
        newFilters.all = true;
      }
      setProjectFilters(newFilters);
    }
  };

  // Determine what to show based on filters
  const shouldShowSection = (section:string) => {
    if (projectFilters.all) return true;
    return projectFilters[section as keyof ProjectFilter];
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 relative ">
      <Navbar/>
      <div className="p-6 space-y-6">
        {/* Projects Header */}
        <div className="space-y-4">
          <section className='flex gap-2 items-center relative'>
            <BriefcaseBusiness className='z-1'/> 
            <h2 className="text-2xl font-bold text-gray-900 z-2">{t.projects}</h2>
            <div className='bg-gradient-to-br from-teal-300 via-50% via-teal-100 to-teal-50 absolute rounded-full -left-3 -top-3 h-10 w-10 z-0'></div>
          </section>
          {/* Filter Checkboxes */}
          <section>
          <p className='text-xs text-gray-500 mb-3'>Choose what you want to read</p>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer border-r border-dashed border-sky-500 pr-5">
              <Checkbox
                checked={projectFilters.all}
                onCheckedChange={() =>  handleFilterChange('all')}
              />
              <Label className='text-xs'>{t.all}</Label>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={projectFilters.companyRoles}
                onCheckedChange={() =>  handleFilterChange('companyRoles')}
              />
              <Label className='text-xs'>{t.companyRoles}</Label>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={projectFilters.taskResponsibility}
                onCheckedChange={() =>  handleFilterChange('taskResponsibility')}
              />
              <Label className='text-xs'>{t.taskResponsibility}</Label>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={projectFilters.portfolio}
                onCheckedChange={() =>  handleFilterChange('portfolio')}
              />
              <Label className='text-xs'>{t.portfolio}</Label>
            </label>
          </div>
          </section>
        </div>

        {/* Projects Grid - 2 columns */}
        <div className={`grid grid-cols-1 ${viewMode === 'Compact' ? 'xl:grid-cols-2' : ''} gap-6`}>
          {getProjects().map(project => (
            <div key={project.id} className="relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow overflow-hidden">
              {project.duration === "Freelance" && (
                <div className="absolute top-1 -left-6 transform -rotate-45 origin-center">
                  <div className="bg-gradient-to-r from-sky-400 to-teal-500 text-white px-5 shadow-md">
                    <span className="text-[7px] font-semibold tracking-wide">FREELANCE</span>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {/* Company & Roles Section */}
                {shouldShowSection('companyRoles') && (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between relative">
                      <div className="space-y-1 flex-1">
                        <h3 className="text-md font-semibold text-gray-900">{project.title}</h3>
                        <div className="flex items-center justify-start space-x-1 flex-wrap text-xs text-gray-500">
                          <p className="text-xs font-medium text-gray-500">{project.company} - </p>
                          <section className='flex gap-1 items-center'>
                            <MapPin className="w-3 h-3" />
                            <span>{project.location}</span>
                          </section>
                        </div>
                        {project.badges && (
                          <div className="flex items-center space-x-2 my-2">
                            {project.badges.map((badge, idx) => (
                              <span key={idx} className="inline-flex items-center space-x-1 text-xs">
                                {badge.includes('Active') || badge.includes('Aktif') ? (
                                  <>
                                    <PlaneTakeoff size={14} className='text-green-800'/>
                                    <span className="text-gray-600">{badge}</span>
                                  </>
                                ) : badge.includes('Inactive') || badge.includes('Tidak Aktif') ? (
                                  <>
                                    <span className="text-gray-400">🔗</span>
                                    <span className="text-gray-600">{badge}</span>
                                  </>
                                ) : badge === 'Tribute' ? (
                                  <>
                                    <HandHeart size={14} className='text-pink-500'/>
                                    <span className="text-gray-600">{badge}</span>
                                  </>
                                ) : badge === 'Remote' ? (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                    {badge}
                                  </span>
                                ) : (
                                  <span className="text-gray-600">{badge}</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {project.location && (
                        <div className="absolute right-0 top-1 flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar1 className="w-3 h-3" />
                          <span>{project.date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Task & Responsibility Section */}
                {shouldShowSection('taskResponsibility') && project.features && (
                  <div className="space-y-4">
                    <section className='flex gap-2 items-center'>
                      {project.roles.map((role, idx) => {
                        return (
                          <span key={idx} className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-sm 
                            ${role === Role.FrontendWebDeveloper ? 'bg-sky-100 text-sky-700' : ''}
                            ${role === Role.MobileDeveloper ? 'bg-lime-100 text-lime-700' : ''}
                            ${role === Role.FullstackDeveloper ? 'bg-rose-100 text-rose-700' : ''}
                            `}
                            >
                            <span className="text-gray-600">{role}</span>
                          </span>
                        );
                      })}
                    </section>
                    {/* Always show tech stack */}
                    {project.techStack && (
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech, idx) => {
                          const tool = tools.find(t => t.id === tech);
                          return (
                            <div className='w-5 h-5 grayscale-100 hover:grayscale-0' key={idx}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image src={`/tech-icon/${tool?.icon}`} alt='tool icon' width={20} height={20} className='object-contain' />
                                </TooltipTrigger>
                                <TooltipContent className='max-w-[400px]'>
                                  {tool?.name}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <ul className="space-y-2">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                          <span className="text-gray-400">
                            <Wand size={14}/>
                          </span>
                          <span className='text-xs'>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Portfolio Section - Images/Tracking */}
                {shouldShowSection('portfolio') && (
                  <>
                    {project.images && (
                      <div className="mt-4 flex space-x-3">
                        {project.images.map((img, idx) => (
                          <div key={idx} className="flex-1 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <Image src={`/porto-image/${img}`} alt={img} width={200} height={200} className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;