/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useContext } from 'react';
import {
  MapPin,
  Calendar1,
  BriefcaseBusiness,
  HandHeart,
  PlaneTakeoff,
  Wand,
  Hand,
  Link,
  Link2,
  Link2Off
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

  const { t, projectFilters, setProjectFilters } = context;
  // Projects Data
  const getProjects = () => {
    return [
      {
        id: 10,
        title: "Cold-Approach Job Hunter",
        company: "Vacansearch",
        type: "Portfolio",
        location: "Remote",
        duration: "Personal",
        badges: ["Official Link (Active)"],
        link: "https://vacansearch.com",
        date: "May 2026 - Current",
        features: [
          "Vibe engineering: defined the product specs with Claude, supervised Claude Code's implementation, and deployed to my own VPS manually (no CI/CD)",
          "Built an active-search + cold-approach companion — curate target companies first, then auto-scan their career pages for openings instead of scraping job boards",
          "When a company has openings users apply directly; when it doesn't, they can still cold-email — backed by a company analysis that briefs the profile and the problems worth solving",
          "Added classic active job search that scrapes job boards, social media, and company pages using a targeted role keyword",
          "Architected as a pnpm monorepo — React + Vite frontend and a Hono.js API — with Playwright-powered scraping",
          "Containerized with Docker and served behind Nginx on a personal VPS",
        ],
        techStack: ["react", "vite", "hono", "playwright", "scraper", "pnpm", "docker", "nginx", "vps", "github", "claude"],
        roles: [Role.FullstackDeveloper],
      },
      {
        id: 2,
        title: "Logistic Management",
        company: "PT Energy Logistics",
        duration: "Contract employee for 6 month (June - December 2025)",
        location: "South Jakarta",
        date: "Jun 2025 - Current",
        badges: ["Official Link (Active)", "Tribute"],
        link: "https://energy-logistics.co.id/",
        type: "Portfolio",
        features: [
          "Participate in migration from PHP 5 Native into CodeIgniter 3 with jQuery and Bootstrap",
          "Initiate gradual migration by injecting Alpine JS and tailwindcss along with Codeigniter 3",
          "Advising and planning future proof migration by using Next.JS, PostgreSQL, Nest.JS, including database normalization and migration from MySQL",
          "Redesign UI to be more readable, and easy to use for user",
          "Handling feature development, improvement, and bug fixing",
        ],
        techStack: ["ci", "jquery", "mysql", "js", "bootstrap", "tailwind", "alpine", "gemini", "github"],
        tracking: "shipment-tracking.png",
        images: ["enlog.png", "enlog2.png"],
        roles: [Role.FrontendWebDeveloper],
      },
      {
        id: 1,
        title: "AI Chatbot (CXM)",
        company: "AiChat Pte Ltd (PT Aichat Teknologi Indonesia).",
        duration: "Fulltime Employee for 3 years (2022 - 2025)",
        type: "Portfolio",
        badges: ["Official Link (Active)", "Tribute"],
        link: "https://www.aichat.com/",
        remote: true,
        location: "Remote",
        date: "Jan 2022 - Apr 2025",
        features: [
          "Develop new Aichat and Client Specific Feature on website CMS v1.0 using React.JS and Laravel, CMS v2.0 using Next.JS, mobile app using React Native, and webchat widget using Native Javascript and web socket",
          "Developed new UI features to seamlessly integrate chatbots with various platforms (e.g., Instagram, Google), significantly reducing user effort and increasing operational efficiency on the AiChat platform",
          "Brainstorming, Discuss, and Coordinating with Product Manager and Backend Developer in order to deliver robust feature",
          "Provided technical explanations to Account Managers, leading to successful client feature adoption/satisfaction",
          "Tracking, Monitoring, and Fixing issue on mobile app, CMS, and web widget"
        ],
        techStack: ["next", "react", "vite", "expo", "js", "ts", "zustand", "formik", "react-hook-form", "socketio", "tailwind", "laravel", "bootstrap", "github", "gitlab", "slack", "clickup", "ryver"],
        images: ["aichat.png", "aichat2.png"],
        roles: [Role.FrontendWebDeveloper, Role.MobileDeveloper],
      },
      {
        id: 9,
        title: "AI Challenge Buddy",
        company: "Lemiles",
        type: "Portfolio",
        location: "Remote",
        duration: "Personal",
        badges: ["Official Link (Active)"],
        link: "https://lemiles.com",
        date: "Apr 2025 - Current",
        features: [
          "First AI-native project — acted as sole engineer designing and shipping the full product",
          "Built a Telegram bot using the Hermes agent framework + Gemini 2.0 Flash with natural language intent detection (confirm / plan / undo / story)",
          "Implemented missed-day detection with tiered empathetic responses (1 day → gentle nudge, 7+ days → soft intervention)",
          "Built web dashboard with streak tracking, GitHub-style heatmap, and activity feed using Next.js 15 App Router",
          "Automated Google Sheets sync per user via service account — auto-created, styled, and shared read-only on registration",
          "Designed full data model and deployed on VPS with PostgreSQL, Drizzle ORM, and Auth.js v5"
        ],
        techStack: ["next", "ts", "tailwind", "hermes-agent", "gemini", "telegram", "postgres", "drizzle", "docker", "github"],
        images: ["lemiles.png", "lemiles2.png"],
        roles: [Role.FullstackDeveloper],
      },
      {
        id: 7,
        title: "AI Job Analysis",
        company: "Personaized",
        type: "Portfolio",
        location: "Remote",
        badges: ["Official Link"],
        link: "https://personaized.com/",
        duration: "Personal",
        date: "May 2025 - Current",
        features: [
          "Research and analysis of the problems to genreate a solution",
          "Designing system, architecture, and development the whole project",
        ],
        techStack: ["next", "ts", "tailwind", "qoder", "claude", "gemini", "postgres", "supabase", "github", "docker", "cloudflare", "nginx"],
        images: ["personaized.png", "personaized2.png"],
        roles: [Role.FullstackDeveloper],
      },
      {
        id: 3,
        title: "LMS for Teacher",
        company: "Proedu (PT Alhasan Prima Edukasi)",
        duration: "Fulltime Employee for 1 years (2020 - 2021)",
        location: "Bintaro, South Jakarta",
        date: "Aug 2020 - Dec 2021",
        type: "Portfolio",
        badges: ["Official (Inactive)", "Tribute"],
        features: [
          "Develop new feature and slicing UI/UX using React JS and Codeigniter",
          "Led the development of the initial React Native mobile app release within a 2 month timeline",
          "Coordinating with Backend to integrate REST API and UI/UX to develop new feature",
          "Participate in brainstorming with stakeholder to determine what feature or issue they want to add to platform"
        ],
        techStack: ["react", "expo", "js", "jquery", "ci", "mysql", "github"],
        images: ["proedu2.png", "proedu3.png"],
        roles: [Role.FrontendWebDeveloper, Role.MobileDeveloper]
      },
      {
        id: 4,
        title: "Property Rent",
        company: "Izislay (PT Mega Kreasi Digital)",
        duration: "Fulltime Employee for 1 years (2020 - 2021)",
        location: "Bintaro, South Jakarta",
        date: "Aug 2018 - Jul 2020",
        badges: ["Official (Inactive)", "Tribute"],
        type: "Portfolio",
        features: [
          "Implemented UI/UX design using bootstrap",
          "Develop new feature using Codeigniter, JQuery, AJAX, and other tech stack  in supervision by Tech Lead",
          "Contributed to design discussion for feature flows, ensuring alignment with overall project objectives",
        ],
        techStack: ["ci", "mysql", "js", "jquery", "github"],
        images: ["izistay3.png", "izistay2.png"],
        roles: [Role.FullstackDeveloper]
      },
      {
        id: 5,
        title: "Product Catalog (V2)",
        company: "Sumaplafon",
        type: "Portfolio",
        location: "Remote",
        badges: ["Official (Active)", "Tribute"],
        duration: "Freelance",
        date: "Dec 2024 - Mar 2025",
        features: [
          "Develop the feature using Next JS, Prisma ORM, and PostgreSQL. then Deploy the app into VPS using Docker",
          "Communicate with client about feature, requirement, and development process ",
        ],
        techStack: ["next", "js", "ts", "prisma", "zustand", "docker", "github", "nginx"],
        images: ["suma-next.png", "suma-next-2.png"],
        roles: [Role.FullstackDeveloper]
      },
      {
        id: 6,
        title: "Product Catalog",
        company: "Sumaplafon",
        type: "Portfolio",
        location: "Remote",
        badges: ["Official (Inactive)"],
        duration: "Freelance",
        date: "Feb 2020 - May 2020",
        features: [
          "Design wireframe, database, and decide tech stack to be used in the system using Laravel and Boostrap",
          "Maintain, Fixing, and Checking issues "
        ],
        techStack: ["laravel", "mysql", "bootstrap"],
        images: ["suma-next.png", "suma-next-2.png"],
        roles: [Role.FullstackDeveloper],
      },
      {
        id: 8,
        title: "Portfolio Website",
        company: "[Personal Client]",
        type: "Portfolio",
        location: "Remote",
        duration: "Freelance",
        badges: ["Official Link"],
        link: "https://nrharyani.com/",
        date: "Oct 2024 - Nov 2024",
        features: [
          "Develop the website using React.js",
          "Deploy the website using Vercel Netlify"
        ],
        techStack: ["react", "github", "netlify"],
        images: ["ani.png", "ani2.png"],
        roles: [Role.FullstackDeveloper],
      },
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
  const shouldShowSection = (section: string) => {
    if (projectFilters.all) return true;
    return projectFilters[section as keyof ProjectFilter];
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 relative ">
      <Navbar />
      <div className="hidden p-6 space-y-6">
        {/* Projects Header */}
        <div className="space-y-4">
          <section className='flex gap-2 items-start relative'>
            <BriefcaseBusiness className='relative z-10' />
            <div className='relative z-10'>
              <h2 className="text-md font-bold text-gray-900">{t.projects}</h2>

              {/* Filter Checkboxes */}
              <section>
                <p className='text-xs text-gray-400 mb-3'>Choose what you want to read</p>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer border-r border-dashed border-sky-500 pr-5">
                    <Checkbox
                      checked={projectFilters.all}
                      onCheckedChange={() => handleFilterChange('all')}
                    />
                    <Label className='text-xs'>{t.all}</Label>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={projectFilters.companyRoles}
                      onCheckedChange={() => handleFilterChange('companyRoles')}
                    />
                    <Label className='text-xs'>{t.companyRoles}</Label>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={projectFilters.taskResponsibility}
                      onCheckedChange={() => handleFilterChange('taskResponsibility')}
                    />
                    <Label className='text-xs'>{t.taskResponsibility}</Label>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={projectFilters.portfolio}
                      onCheckedChange={() => handleFilterChange('portfolio')}
                    />
                    <Label className='text-xs'>{t.portfolio}</Label>
                  </label>
                </div>
              </section>
            </div>
            <div className='bg-gradient-to-br from-teal-300 via-50% via-teal-100 to-teal-50 absolute rounded-full -left-3 -top-3 h-10 w-10 z-0'></div>
          </section>
        </div>

        {/* Projects Grid - 2 columns */}
        <div className="grid grid-cols-1 gap-6">
          {getProjects().map(project => (
            <div key={project.id} className="relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              {project.duration === "Freelance" && (
                <div className="absolute -top-2 -right-3 transform origin-center">
                  <div className="bg-yellow-100 ps-3 pe-2 shadow-md rounded-tl-md rounded-r-md">
                    <span className="text-xs text-gray-500 font-semibold tracking-wide">Freelance</span>
                  </div>
                </div>
              )}
              {project.duration === "Personal" && (
                <div className="absolute -top-2 -right-3 transform origin-center">
                  <div className="bg-gray-600 ps-3 pe-2 py-1 shadow-md rounded-tl-md rounded-r-md flex gap-1 items-center">
                    {/* <Hand size={12} className='text-zinc-500'/> */}
                    <span className="text-xs text-gray-200 font-semibold tracking-wide">Personal Project</span>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {/* Company & Roles Section */}
                {shouldShowSection('companyRoles') && (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between relative">
                      <div className="space-y-1 flex-1 pt-5 md:pt-0">
                        <h3 className="text-md font-semibold text-gray-900">{project.title}</h3>
                        <div className="flex items-center justify-start space-x-1 flex-wrap text-xs text-gray-500">
                          <p className="text-xs font-medium text-gray-500">{project.company} - </p>
                          <section className='flex gap-1 items-center'>
                            <MapPin className="w-3 h-3" />
                            <span>{project.location}</span>
                          </section>
                        </div>
                        {project.link ? (
                          <div className='flex gap-1 items-center my-2 hover:cursor-pointer text-gray-600 hover:text-blue-600'>
                            <Link2 className="" size={12} />
                            <a href={project.link} target='_blank' className="text-xs "> Visit Project</a>
                          </div>
                        ) : (
                          <div className='flex gap-1 items-center my-2'>
                            <Link2Off className="text-gray-600" size={12} />
                            <a href={project.link} target='_blank' className="text-xs text-gray-600 line-through"> Visit Project</a>
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
                    <section className='flex flex-wrap gap-2 items-center'>
                      {project.roles.map((role, idx) => {
                        return (
                          <span key={idx} className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-sm whitespace-nowrap
                            ${role === Role.FrontendWebDeveloper ? 'bg-sky-50 text-sky-700' : ''}
                            ${role === Role.MobileDeveloper ? 'bg-lime-50 text-lime-700' : ''}
                            ${role === Role.FullstackDeveloper ? 'bg-rose-50 text-rose-700' : ''}
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
                            <Wand size={14} />
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