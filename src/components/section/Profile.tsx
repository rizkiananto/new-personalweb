/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  MapPin,
  ExternalLink,
  WandSparkles,
  Upload,
  Infinity,
  Bot,
  Image as ImageLucide,
  Link,
  X,
  PencilLine,
  MessageCircleX,
  Minus,
  ChevronUp,
  ChevronDown,
  Quote,
  ChevronsUp,
  Globe,
  Headset,
  GraduationCap,
  Truck,
  Building2,
  ShoppingBag,
  MessageCircle,
  Calendar1,
  BriefcaseBusiness,
  Handshake,
  Rocket
} from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownTextarea } from '@/components/ui/markdown-textarea';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { tools } from '@/data';
import { RootContext } from '@/contexts/RootContext';
import { ContributedProps, Role } from '@/types';
import { JobMatchResponse } from '../ui/job-match-dialog';
import { CustomSeparator } from '../ui/separator';
import JobMatchDialog from '../ui/job-match-dialog';
import ContactDialog from '../ui/contact-dialog';
import { getApiUrl, getApiHeaders, API_CONFIG } from '@/lib/api-config';
import axios from 'axios';
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function InfiniteCarousel({ contributed, speed = 50 }: { contributed: ContributedProps[], speed: number }) {
  const [paused, setPaused] = useState(false);

  // Triple-clone for ultra-safe seamless loop
  const items = [...contributed, ...contributed, ...contributed];
  const GAP = 50; // gap-6 = 24px
  const ITEM_W = 80 + GAP; // image width + gap
  const loopWidth = contributed.length * ITEM_W;
  const duration = loopWidth / speed;

  return (
    <div className="relative w-full overflow-hidden" style={{ maxWidth: "85vw" }}>
      {/* Fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

      <motion.div
        className="flex items-center"
        style={{ width: "max-content", gap: GAP }}
        animate={{ x: paused ? undefined : [-loopWidth, 0] }}
        transition={{
          x: {
            // repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {items.map((product, idx) => (
          <a
            key={idx}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="grayscale hover:grayscale-0 transition-all duration-300"
              style={{ width: 80, height: 48 }}
            >
              <Image
                src={`/product-contributed/${product.image}`}
                alt={product.name}
                width={80}
                height={80}
                className="h-12 w-full object-contain rounded-full"
                draggable={false}
              />
            </div>
          </a>
        ))}
      </motion.div>
    </div>
  );
}

function MarqueeText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled || !containerRef.current || !textRef.current) return;
      const overflow = textRef.current.scrollWidth - containerRef.current.clientWidth;
      setDistance(overflow > 0 ? overflow : 0);
    };
    measure();
    const raf = requestAnimationFrame(measure);
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [text]);

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className ?? ''}`}>
      <span
        ref={textRef}
        className={`inline-block ${distance > 0 ? 'animate-marquee' : ''}`}
        style={distance > 0 ? ({
          '--marquee-distance': `${distance}px`,
          animationDuration: `${Math.max(2.5, distance / 25) + 1}s`,
        } as React.CSSProperties) : undefined}
      >
        {text}
      </span>
    </div>
  );
}

interface FreelanceEntry {
  title: string;
  company: string;
  date: string;
  brief: string;
}

interface MilestoneEntry {
  title: string;
  company: string;
  year: string;
  yearEnd: string;
  date: string;
  location: string;
  brief: string;
}

type TimelineBlock =
  | { type: 'fulltime'; data: MilestoneEntry }
  | { type: 'freelance'; data: FreelanceEntry };

function MilestoneCard({ m, badgeSide }: { m: MilestoneEntry; badgeSide: 'left' | 'right' }) {
  const isCurrent = m.yearEnd === 'Current';
  return (
    <div className={`relative border rounded-lg p-3.5 ${isCurrent ? 'border-blue-200 bg-blue-50/40 ring-1 ring-blue-100' : 'border-blue-100 bg-white'}`}>
      <span className={`absolute -top-3 ${badgeSide === 'left' ? '-left-3' : '-right-3'} flex items-center justify-center h-6 w-6 rounded-full border ${isCurrent ? 'bg-blue-50 border-blue-300 text-blue-500' : 'bg-blue-50/60 border-blue-200 text-blue-400'}`}>
        <BriefcaseBusiness size={11} strokeWidth={2} />
      </span>
      <p className='text-xs font-semibold text-gray-900 leading-tight'>
        {m.title} <span className='font-normal text-gray-400'>· {m.company}</span>
      </p>
      <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-gray-400'>
        <span className='flex items-center gap-1'><Calendar1 size={10} />{m.date}</span>
        <span className='flex items-center gap-1'><MapPin size={10} />{m.location}</span>
      </div>
      <p className='text-[11px] text-gray-500 leading-relaxed mt-1.5'>{m.brief}</p>
    </div>
  );
}

function FreelanceCard({ items }: { items: FreelanceEntry[] }) {
  return (
    <div className='space-y-4'>
      {items.map((f, i) => (
        <div key={i} className='relative border border-dashed border-gray-200 rounded-lg bg-gray-50/60 p-2.5'>
          <span className='absolute -top-2.5 left-3 flex items-center gap-1 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-gray-500 tracking-wide'>
            <Handshake size={9} /> Freelance
          </span>
          <p className='text-[11px] font-semibold text-gray-800 leading-tight mt-1'>
            {f.title} <span className='font-normal text-gray-400'>· {f.company}</span>
          </p>
          <p className='flex items-center gap-1 text-[9px] text-gray-400 mt-0.5'><Calendar1 size={9} />{f.date}</p>
          <p className='text-[10px] text-gray-500 leading-snug mt-1'>{f.brief}</p>
        </div>
      ))}
    </div>
  );
}

type BentoVariant = 'big' | 'medium' | 'small' | 'wide' | 'full';

interface BentoCell {
  span: string;
  variant: BentoVariant;
}

// Lays cases out in groups of 5 (a tall flagship + 4 cells that exactly fill the columns
// beside/below it). Whatever doesn't fill a complete group gets packed into full-width
// rows instead, so the mosaic never leaves a lone card stranded with empty space beside it.
function getBentoLayout(total: number): BentoCell[] {
  const cells: BentoCell[] = [];
  const fullGroups = Math.floor(total / 5);

  for (let g = 0; g < fullGroups; g++) {
    cells.push({ span: 'col-span-6 sm:col-span-3 sm:row-span-2', variant: 'big' });
    cells.push({ span: 'col-span-6 sm:col-span-3 sm:row-span-1', variant: 'medium' });
    cells.push({ span: 'col-span-6 sm:col-span-3 sm:row-span-1', variant: 'medium' });
    cells.push({ span: 'col-span-6 sm:col-span-2 sm:row-span-1', variant: 'small' });
    cells.push({ span: 'col-span-6 sm:col-span-4 sm:row-span-1', variant: 'wide' });
  }

  let remainder = total % 5;
  while (remainder >= 2) {
    cells.push({ span: 'col-span-6 sm:col-span-3 sm:row-span-1', variant: 'medium' });
    cells.push({ span: 'col-span-6 sm:col-span-3 sm:row-span-1', variant: 'medium' });
    remainder -= 2;
  }
  if (remainder === 1) {
    cells.push({ span: 'col-span-6 sm:row-span-1', variant: 'full' });
  }

  return cells;
}

const Profile = () => {
  const context = useContext(RootContext);

  if (!context) {
    throw new Error('Profile must be used within a RootContext Provider');
  }

  const { t, setSelectedTools, selectedTools, isMobile } = context;
  const profileRef = useRef<HTMLDivElement>(null);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [matchData, setMatchData] = useState<JobMatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Job description and email state
  const [jobDescription, setJobDescription] = useState("");
  const [email, setEmail] = useState("");

  // Toast state
  const [showToast, setShowToast] = useState(false);


  // Check if analysis exists in localStorage
  const [hasStoredAnalysis, setHasStoredAnalysis] = useState(false);

  useEffect(() => {
    const storedAnalysis = localStorage.getItem('jobAnalysis');
    const storedJobDescription = localStorage.getItem('jobDescription');
    const storedEmail = localStorage.getItem('jobEmail');

    if (storedAnalysis && storedJobDescription && storedEmail) {
      try {
        const parsedData = JSON.parse(storedAnalysis);

        // More flexible validation - just check if it has match_result
        if (parsedData && parsedData.match_result) {
          setHasStoredAnalysis(true);
          setMatchData(parsedData);
          setJobDescription(storedJobDescription);
          setEmail(storedEmail);
        } else {
          console.error('Invalid stored data structure, clearing localStorage');
          // Clear corrupted data
          localStorage.removeItem('jobAnalysis');
          localStorage.removeItem('jobDescription');
          localStorage.removeItem('jobEmail');
        }
      } catch (error) {
        console.error('Error parsing stored data:', error);
        // Clear corrupted data
        localStorage.removeItem('jobAnalysis');
        localStorage.removeItem('jobDescription');
        localStorage.removeItem('jobEmail');
      }
    }
  }, []);

  const scrollToDetails = () => {
    setTimeout(() => {
      if (profileRef.current) {
        const firstTool = document.getElementById('tool-explanation-0');
        if (firstTool) {
          firstTool.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else {
          profileRef.current.scrollTo({
            top: profileRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }
      setShowToast(false);
    }, 0);
  }

  // Show toast when tools are selected
  useEffect(() => {
    if (selectedTools.length > 0) {
      setShowToast(true);
      // Auto-hide toast after 5 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [selectedTools.length]);

  const requestJobMatcher = async () => {
    // Validation
    if (!jobDescription.trim()) {
      setError('Job description is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const postData = {
      'job_opportunity': jobDescription,
      'email': email
    };

    setIsLoading(true);
    setError(null);
    setIsDialogOpen(true);

    try {
      const response = await axios.post(
        getApiUrl(API_CONFIG.endpoints.matchJob),
        postData,
        {
          headers: {
            'Authorization': `Bearer pk_bBqr3n2B5jSu1fKwGFRwWBoE1qyrwxgx`
          }
        },
      );

      console.log('Raw API response:', response);
      console.log('Response data:', response.data);

      const analysisData = response.data;
      console.log('Analysis data to be set and stored:', analysisData);

      setMatchData(analysisData.data);

      // Store in localStorage
      localStorage.setItem('jobAnalysis', JSON.stringify(analysisData.data));
      localStorage.setItem('jobDescription', jobDescription);
      localStorage.setItem('jobEmail', email);
      setHasStoredAnalysis(true);

    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Failed to analyze job match');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const viewStoredAnalysis = () => {
    const storedAnalysis = localStorage.getItem('jobAnalysis');
    console.log(storedAnalysis)
    if (storedAnalysis) {
      try {
        const parsedData = JSON.parse(storedAnalysis);
        console.log('Stored analysis data:', parsedData);

        // More flexible validation - just check if it has match_result
        if (parsedData && parsedData.match_result) {
          setMatchData(parsedData);
          setIsDialogOpen(true);
        } else {
          console.error('Invalid data structure in localStorage:', parsedData);
          setError('Stored analysis data is corrupted. Please create a new analysis.');
          // Clear corrupted data
          localStorage.removeItem('jobAnalysis');
          localStorage.removeItem('jobDescription');
          localStorage.removeItem('jobEmail');
          setHasStoredAnalysis(false);
        }
      } catch (error) {
        console.error('Error parsing stored analysis:', error);
        setError('Failed to load stored analysis. Please create a new analysis.');
        // Clear corrupted data
        localStorage.removeItem('jobAnalysis');
        localStorage.removeItem('jobDescription');
        localStorage.removeItem('jobEmail');
        setHasStoredAnalysis(false);
      }
    }
  }

  const createNewAnalysis = () => {
    // Clear localStorage
    localStorage.removeItem('jobAnalysis');
    localStorage.removeItem('jobDescription');
    localStorage.removeItem('jobEmail');

    // Reset state
    setMatchData(null);
    setJobDescription("");
    setEmail("");
    setHasStoredAnalysis(false);
    setError(null);

    console.log('Cleared all stored analysis data');
  }

  // Mockup data — condensed from Content.tsx's experience list for the timeline preview (personal projects excluded, they're already covered in "Currently Building").
  // Fulltime and freelance work are interleaved by actual start date (newest first) rather than
  // nesting freelance under whichever fulltime job overlaps it — that way every block's position
  // matches its own dates instead of borrowing a neighboring job's year.
  const timeline: TimelineBlock[] = [
    { type: 'fulltime', data: { title: 'Logistic Management', company: 'PT Energy Logistics', year: '2025', yearEnd: 'Current', date: 'Jun 2025 - Current', location: 'South Jakarta', brief: 'Migrating a legacy PHP/CodeIgniter stack toward Next.js while shipping features and fixes.' } },
    { type: 'freelance', data: { title: 'Product Catalog (V2)', company: 'Sumaplafon', date: 'Dec 2024 - Mar 2025', brief: 'Rebuilt the catalog with Next.js, Prisma, and PostgreSQL.' } },
    { type: 'freelance', data: { title: 'Portfolio Website', company: 'Personal Client', date: 'Oct 2024 - Nov 2024', brief: 'Built and deployed a personal portfolio site with React.' } },
    { type: 'fulltime', data: { title: 'AI Chatbot (CXM)', company: 'AiChat Pte Ltd', year: '2022', yearEnd: '2025', date: 'Jan 2022 - Apr 2025', location: 'Remote', brief: '3 years building the CXM platform across web CMS, mobile app, and webchat widget.' } },
    { type: 'fulltime', data: { title: 'LMS for Teacher', company: 'Proedu', year: '2020', yearEnd: '2021', date: 'Aug 2020 - Dec 2021', location: 'Bintaro, South Jakarta', brief: "Led the team's first React Native app release and built LMS features." } },
    { type: 'freelance', data: { title: 'Product Catalog', company: 'Sumaplafon', date: 'Feb 2020 - May 2020', brief: 'Designed the wireframe, database, and tech stack using Laravel and Bootstrap.' } },
    { type: 'fulltime', data: { title: 'Property Rent', company: 'Izistay', year: '2018', yearEnd: '2020', date: 'Aug 2018 - Jul 2020', location: 'Bintaro, South Jakarta', brief: 'Implemented UI/UX and shipped new features under tech-lead supervision.' } },
  ];

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const yearsOfExperience = new Date().getFullYear() - 2018;

  // Only fulltime jobs flip which side of the line a block sits on — a freelance block
  // in between sits in the empty column opposite whichever fulltime chapter it falls under.
  const timelineWithSide = (() => {
    let fulltimeCount = 0;
    let currentSide = true;
    return timeline.map((block) => {
      const isLeft = block.type === 'fulltime' ? fulltimeCount % 2 === 0 : !currentSide;
      if (block.type === 'fulltime') {
        fulltimeCount++;
        currentSide = isLeft;
      }
      return { ...block, isLeft };
    });
  })();

  const servicesRow1 = [
    { icon: Globe, title: 'Website & Mobile', desc: 'Go online, on web and mobile' },
    { icon: Bot, title: 'AI Integration', desc: 'Enhance your app' },
    { icon: Headset, title: 'CXM', desc: 'Customer Management' },
  ];
  const servicesRow2 = [
    { icon: GraduationCap, title: 'LMS', desc: 'Education Platform' },
    { icon: Truck, title: 'Logistics', desc: 'Move things easier' },
    { icon: Building2, title: 'Property', desc: 'Listing, booking, management' },
    { icon: ShoppingBag, title: 'Online Store', desc: 'Sell your products online' },
  ];

  const buildLog = t.contributed.filter((c: ContributedProps) => c.problem);
  const bentoLayout = getBentoLayout(buildLog.length);

  return (
    <div className="h-full overflow-y-auto bg-gray-50" ref={profileRef} >
      <div className="p-6 space-y-3">
        {/* Profile Section */}
        <div className="flex flex-col gap-4 w-full">
          {/* Row: Avatar + Identity */}
          <div className="flex flex-col md:flex-row gap-3 items-start">
            <div className="hidden md:block w-16 h-16 aspect-square overflow-hidden rounded-full flex-shrink-0">
              <Image src="/avatar.jpg" alt="Profile Picture" width={64} height={64} className='object-cover w-full h-full' />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{t.name}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {t.roles.map((role: Role, idx: number) => (
                  <div className="flex gap-1 items-center" key={idx}>
                    <span key={idx} className="text-[11px] rounded-sm px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-300">
                      {role.title}
                    </span>
                    {idx !== t.roles.length - 1 && <span>·</span>}
                  </div>
                ))}
              </div>
              {/* <hr className='my-1.5 border border-dashed border-gray-200 max-w-40' /> */}
              <p className="text-xs font-medium text-gray-800 mt-3 leading-snug">{t.title} · {yearsOfExperience} years experience</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="relative flex h-2 w-2 items-center justify-center mb-0">
                  <span className="absolute inline-flex h-full w-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-blue-300 opacity-50 [transform:scale(1)]"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-200"></span>
                </div>
                <p className="text-[.7em] mb-0 text-gray-500 leading-snug">Currently working as Frontend Developer at <span className='text-blue-600 font-medium'>PT Energy Logistics</span></p>
              </div>
            </div>
          </div>

          {/* Currently Building */}
          <div className='relative mt-5'>
            <div className='flex items-center gap-1 bg-gray-50 absolute right-2 -top-3 px-2 py-1'>
              <Image
                src='/construction-icon.png'
                alt="Actively Building"
                width={10}
                height={10}
                className="h-4 w-4 object-contain flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                draggable={false}
              />
              <p className="text-[10px] text-gray-400 font-medium">Actively Building</p>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 items-stretch px-2 py-6 border-t border-l border-dashed border-gray-300 rounded-md"> */}
            <div className="space-y-8 py-6 border-t border-dashed border-gray-300 rounded-md">
              {['Energy Logistics', 'Vacansearch', 'Lemiles']
                .map((name) => t.contributed.find((c: ContributedProps) => c.name === name))
                .filter((product): product is ContributedProps => Boolean(product))
                .map((product: ContributedProps, i: number) => (
                  <div key={i} className='flex flex-col md:flex-row md:items-stretch gap-4 pt-5'>
                    <div className='md:w-1/2 flex flex-col'>
                      <a
                        href={product.link || '#'}
                        target={product.link ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 group py-3 mx-3 pe-3 max-w-max bg-gradient-to-tr from-transparent from-40% to-gray-300/60 rounded-md rounded-l-none border-t border-r border-dashed border-gray-300/80"
                      >
                        <Image
                          src={`/product-contributed/${product.image}`}
                          alt={product.name}
                          width={32}
                          height={20}
                          className="h-5 w-8 object-contain flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                          draggable={false}
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium text-gray-800 leading-tight truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{product.shortIntro}</p>
                        </div>
                      </a>
                      {product.techStack && product.techStack.length > 0 && (
                        <div className='flex items-center gap-1.5 px-5'>
                          {product.techStack.slice(0, 5).map((techId) => {
                            const tool = tools.find((tl) => tl.id === techId);
                            if (!tool) return null;
                            return (
                              <Image
                                key={techId}
                                src={`/tech-icon/${tool.icon}`}
                                alt={tool.name}
                                title={tool.name}
                                width={13}
                                height={13}
                                className='h-[13px] w-[13px] object-contain rounded-sm flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300'
                                draggable={false}
                              />
                            );
                          })}
                        </div>
                      )}
                      <p className='py-3 px-5 text-xs'>{product.buildingCaption}</p>
                    </div>
                    <a
                      href={product.link || '#'}
                      target={product.link ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className='relative w-full h-56 md:h-auto md:w-1/2 flex-shrink-0 overflow-hidden block'
                    >
                      <Image
                        src={`/${product.showcase}`}
                        alt={product.name}
                        fill
                        className="object-cover scale-110"
                        draggable={false}
                      />
                      <div className='pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-gray-50 to-transparent' />
                      <div className='pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-gray-50 to-transparent' />
                      <div className='pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-gray-50 to-transparent' />
                      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-gray-50 to-transparent' />
                    </a>
                  </div>
                ))}
            </div>
          </div>

          {/* Working At */}
          <div className='hidden'>
            <p className="text-[10px] text-gray-400 font-medium mb-1.5 tracking-medium">Current Fulltime Work</p>
            {t.contributed
              .filter((c: ContributedProps) => c.name === 'Energy Logistics')
              .map((co: ContributedProps, i: number) => (
                <a
                  key={i}
                  href={co.link || '#'}
                  target={co.link ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-100 border w-min border-gray-100 rounded-lg p-2 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                >
                  <Image
                    src={`/product-contributed/${co.image}`}
                    alt={co.name}
                    width={40}
                    height={24}
                    className="h-6 w-10 object-contain flex-shrink-0"
                    draggable={false}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-800 leading-tight">{co.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{co.shortIntro}</p>
                  </div>
                </a>
              ))}
          </div>
        </div>

        {/*<CustomSeparator icon={Infinity} />*/}
        <div className='flex items-center justify-center gap-3 mt-16 mb-10'>
          <h3 className='font-semibold'>What can I Build for you?</h3>
          <Image
            src='/emoji-puzzled.png'
            alt="emoji-puzzled.png"
            width={14}
            height={14}
            className="h-5 w-5 object-contain flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
            draggable={false}
          />
        </div>

        <div className='my-5 border border-gray-200 rounded-lg overflow-hidden'>
          <div className='grid grid-cols-1 sm:grid-cols-3 divide-x divide-y divide-gray-200'>
            {servicesRow1.map((service) => (
              <div key={service.title} className='flex items-start gap-3 px-4 py-3.5'>
                <div className='p-1.5 border border-gray-300 rounded-md flex-shrink-0 text-gray-700'>
                  <service.icon size={16} strokeWidth={1.75} />
                </div>
                <div className='min-w-0'>
                  <p className='text-xs font-semibold text-gray-900 leading-tight'>{service.title}</p>
                  <MarqueeText text={service.desc} className='text-[10px] text-gray-400 mt-0.5' />
                </div>
              </div>
            ))}
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-gray-200 border-t border-gray-200'>
            {servicesRow2.map((service) => (
              <div key={service.title} className='flex items-start gap-3 px-4 py-3.5'>
                <div className='p-1.5 border border-gray-300 rounded-md flex-shrink-0 text-gray-700'>
                  <service.icon size={16} strokeWidth={1.75} />
                </div>
                <div className='min-w-0'>
                  <p className='text-xs font-semibold text-gray-900 leading-tight'>{service.title}</p>
                  <MarqueeText text={service.desc} className='text-[10px] text-gray-400 mt-0.5' />
                </div>
              </div>
            ))}
          </div>
          <button
            type='button'
            onClick={() => setContactOpen(true)}
            className='group flex items-center justify-center gap-2 w-full px-4 py-3 border-t border-gray-200 hover:bg-gray-50 transition-colors'
          >
            <MessageCircle size={14} className='text-gray-500 group-hover:text-blue-600 transition-colors' />
            <p className='text-xs font-medium text-gray-600 group-hover:text-blue-600 transition-colors'>Have other idea in mind? Let&apos;s talk</p>
          </button>
        </div>

        <div className='mt-24 mb-16'>
          <h3 className="font-semibold text-sm text-gray-900">Problem, Then Product</h3>
          <p className="text-xs text-muted-foreground">Real gaps I ran into myself — the project is just the receipt</p>

          <div className='mt-6 grid grid-cols-6 grid-flow-row-dense gap-3 sm:auto-rows-[minmax(150px,auto)]'>
            {buildLog.map((entry: ContributedProps, i: number) => {
              const { span, variant } = bentoLayout[i];
              const highlight = variant === 'big' || variant === 'full';
              return (
                <div
                  key={entry.name}
                  className={`${span} flex flex-col rounded-lg border p-5 ${highlight ? 'border-dashed border-gray-300 bg-gradient-to-br from-blue-50/60 to-transparent' : 'border-gray-200'}`}
                >
                  <Quote
                    size={highlight ? 26 : 14}
                    strokeWidth={2.5}
                    className={`${highlight ? 'text-blue-200' : 'text-gray-200'} mb-2 flex-shrink-0`}
                  />
                  <p className={`${highlight ? 'text-[17px]' : 'text-[13px]'} text-gray-800 leading-snug font-medium`}>
                    {entry.problem}
                  </p>
                  <p className={`${highlight ? 'text-xs mt-3' : 'text-[11px] mt-2'} text-gray-500 leading-relaxed`}>
                    {entry.mainTask}
                  </p>
                  <a
                    href={entry.link || '#'}
                    target={entry.link ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className='mt-auto pt-3 inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors duration-200 w-fit'
                  >
                    <Image
                      src={`/product-contributed/${entry.image}`}
                      alt={entry.name}
                      width={12}
                      height={12}
                      className='h-3 w-3 object-contain rounded-full opacity-70 flex-shrink-0'
                      draggable={false}
                    />
                    {entry.name}
                    <ExternalLink size={9} className='opacity-50 flex-shrink-0' />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones Timeline (mockup) */}
        <div className='mt-16'>
          <h3 className="font-semibold text-sm text-gray-900">Milestones</h3>
          <p className="text-xs text-muted-foreground">Where I&apos;ve worked and shipped — full detail on request</p>

          {/* Mobile: single column, badge points at the line */}
          <div className='sm:hidden mt-6 border-l border-dashed border-gray-300 ps-6 space-y-5'>
            <div className='relative flex items-center gap-3'>
              <span className='absolute -left-9 flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 border border-blue-300'>
                <span className='relative flex h-2 w-2 items-center justify-center'>
                  <span className='absolute inline-flex h-full w-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-blue-300 opacity-50'></span>
                  <span className='relative inline-flex h-2 w-2 rounded-full bg-blue-200'></span>
                </span>
              </span>
              <p className='text-[11px] font-medium text-blue-500'>{currentMonthYear}</p>
            </div>
            <div className='space-y-6'>
              {timeline.map((block, i) => (
                <div key={i}>
                  {block.type === 'fulltime'
                    ? <MilestoneCard m={block.data} badgeSide='left' />
                    : <FreelanceCard items={[block.data]} />}
                </div>
              ))}
            </div>
            <div className='relative flex items-center gap-3'>
              <span className='absolute -left-9 flex items-center justify-center h-6 w-6 rounded-full bg-gray-50 border border-gray-300 text-gray-400'>
                <Rocket size={11} strokeWidth={2} />
              </span>
              <p className='text-[11px] font-medium text-gray-400'>Career started · 2018</p>
            </div>
          </div>

          {/* Desktop: alternating left/right, connected by a center line. Fulltime jobs are
              independent blocks positioned by their own dates — a freelance block never nests
              under a fulltime job, so its dot/date always matches its own content — but only a
              fulltime job flips which side of the line new blocks land on. */}
          <div className='hidden sm:block mt-6 relative'>
            <div className='absolute left-1/2 top-0 bottom-0 border-l border-dashed border-gray-300 -translate-x-1/2' />
            <div className='relative mb-5 flex justify-center'>
              <span className='relative z-10 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-blue-200 text-[11px] font-medium text-blue-500'>
                <span className='relative flex h-2 w-2 items-center justify-center'>
                  <span className='absolute inline-flex h-full w-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-blue-300 opacity-50'></span>
                  <span className='relative inline-flex h-2 w-2 rounded-full bg-blue-200'></span>
                </span>
                {currentMonthYear}
              </span>
            </div>
            <div className='space-y-8'>
              {timelineWithSide.map((block, i) => {
                const { isLeft } = block;
                if (block.type === 'freelance') {
                  const f = block.data;
                  return (
                    <div className='relative' key={i}>
                      <span className='absolute left-1/2 top-3 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-gray-200 ring-4 ring-gray-50' />
                      <div className={`w-[calc(50%-12px)] ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
                        <FreelanceCard items={[f]} />
                      </div>
                    </div>
                  );
                }
                const m = block.data;
                return (
                  <div className='relative' key={i}>
                    <span className='absolute left-1/2 top-5 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-gray-50' />
                    <span className={`absolute top-3 text-sm font-bold text-gray-400 ${isLeft ? 'left-[calc(50%+16px)]' : 'right-[calc(50%+16px)]'}`}>
                      {m.year}
                    </span>
                    <div className={`w-[calc(50%-12px)] ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
                      <MilestoneCard m={m} badgeSide={isLeft ? 'left' : 'right'} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='relative mt-5 flex justify-center'>
              <span className='relative z-10 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-300 text-[11px] font-medium text-gray-400'>
                <Rocket size={11} strokeWidth={2} />
                Career started · 2018
              </span>
            </div>
          </div>
        </div>

        <CustomSeparator icon={WandSparkles} />
        {/* Tools Section */}
        <div className="space-y-3 transition-all">
          <section className='relative'>
            <h3 className="font-semibold text-sm text-gray-900">{t.toolsTitle}</h3>
            <p className="text-xs text-muted-foreground">{t.toolsSubtitle}</p>
            {
              selectedTools.length > 0 &&
              <div className='absolute right-0 top-0'>
                <button
                  className='flex gap-2 text-xs items-center bg-red-50 text-black px-2 py-1 rounded-md hover:cursor-pointer hover:bg-red-400 hover:text-white transition-all'
                  onClick={() => setSelectedTools([])}
                >
                  Clear
                  <X size={12} />
                </button>
              </div>
            }
          </section>
          <div className="mt-7 space-y-3">
            {/* Group tools by section */}
            {Object.entries(
              tools.reduce((acc, tool) => {
                if (!acc[tool.section]) {
                  acc[tool.section] = [];
                }
                acc[tool.section].push(tool);
                return acc;
              }, {} as Record<string, typeof tools>)
            ).map(([section, sectionTools]) => (
              <div key={section} className="relative mb-10">
                <div className='section-tag absolute top-6 -left-15 w-24 h-5'>
                  <p className='line-clamp-1 rotate-270 m-0 text-center text-xs bg-gradient-to-r from-slate-200 via-slate-300 to-slate-100 px-2 py-1 rounded-md text-sm'>
                    {section}
                  </p>
                </div>
                <div className="grid grid-cols-6 gap-2 ps-2">
                  {sectionTools.map((tool, i) => {
                    return (
                      <button
                        key={tool.id}
                        type='button'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedTools(prev =>
                            prev.includes(tool.id)
                              ? prev.filter(id => id !== tool.id)
                              : [...prev, tool.id]
                          );
                        }}
                        className={`group relative flex flex-col items-center py-2 rounded-lg transition-all gap-2 justify-between grayscale hover:grayscale-0 duration-300 ease-in-out cursor-pointer ${selectedTools.includes(tool.id)
                          ? 'bg-sky-50 ring-2 ring-gray-50 grayscale-0'
                          : 'hover:bg-gray-50'
                          }`}
                        title={tool.name}
                      >
                        <Image src={`/tech-icon/${tool.icon}`} alt='tool icon' width={24} height={24}
                          className='' />
                        <span className="text-[11px] text-gray-600 text-center leading-tight">{tool.name}</span>
                      </button>
                    )
                  }
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tools Details */}
          {selectedTools.map((toolId, i) => {
            const toolDetail = tools.find(t => t.id === toolId)
            return (
              <div className="p-3 shadow-md rounded-lg" key={i} id={`tool-explanation-${i}`}>
                <section className='flex gap-2 justify-start items-start relative'>
                  <Image src={`/tech-icon/${toolDetail?.icon}`} alt="ToolLogo" width={28} height={28} />
                  <div>
                    <p className="text-sm font-medium">{toolDetail?.name}</p>
                    <p className='text-xs text-muted-foreground capitalize'>{toolDetail?.category}</p>
                  </div>
                  <MessageCircleX
                    className='absolute right-0 top-0 text-gray-300 hover:text-red-400 hover:cursor-pointer transition-all'
                    onClick={() => {
                      setSelectedTools(prev => prev.filter(id => id !== toolId))
                    }}
                  />
                </section>
                <section className='p-2 mt-2 border-t border-dashed border-gray-300'>
                  <p className="text-xs opacity-75">
                    {toolDetail?.details}
                  </p>
                  <section className='flex gap-2 mt-2 text-xs items-center'>
                    <p>Projets Involved: </p>
                    {toolDetail?.projects.map((project, i) => (
                      <span key={i} className='px-2 py-1 border border-gray-200 hover:cursor-pointer rounded-md flex gap-2 justify-center items-center'>{project}<ExternalLink size={12} /></span>
                    ))}
                  </section>
                </section>
              </div>
            )
          })}
        </div>

        {/* <CustomSeparator icon={Bot} /> */}
        <div className='hidden'>
          <p className='text-sm m-0 font-semibold'>{!hasStoredAnalysis ? t.tagline : t.storedTagline.replace("{email}", email)}</p>
          <p className='text-xs text-muted-foreground'>{!hasStoredAnalysis ? t.agentDescription : t.storedDescription.replace("{email}", email)}</p>
        </div>
        {/* Personaice.com section */}
        <div className="hidden flex w-full flex-col gap-6">
          <Tabs defaultValue="written">
            {/* <TabsList> */}
            {/* <TabsTrigger className='text-xs' value="written"><PencilLine /> Type your job specification</TabsTrigger> */}
            {/* <TabsTrigger className='text-xs' value="image"><ImageLucide/> Upload image</TabsTrigger> */}
            {/* <TabsTrigger className='text-xs' value="link"><Link/> Paste Link</TabsTrigger> */}
            {/* </TabsList> */}
            {hasStoredAnalysis ? (
              <>
              </>
            ) : (
              <>
                <TabsContent value="written" className='pt-5'>
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-xs">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 placeholder:text-xs"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobDescription" className="text-xs">Job Description *</Label>
                        <MarkdownTextarea
                          id="jobDescription"
                          rows={50}
                          className='placeholder:text-xs min-h-[150px] mt-1'
                          placeholder={t.sampleAgentValue}
                          enablePreview={false}
                          value={jobDescription}
                          onChange={setJobDescription}
                        />
                      </div>
                    </div>
                  </>
                </TabsContent>
                <TabsContent value="image">
                  <div className='h-[150px] text-xs border-dashed border border-gray-300 rounded-xl flex items-center justify-center flex-col'>
                    <Upload size={28} color='gray' />
                    <p className='mt-3 text-muted-foreground'>Drop your image here. or <span className='bg-sky-50 p-1 rounded-2xl'>click</span> to select a file</p>
                  </div>
                </TabsContent>
                <TabsContent value="link">
                  <div className='h-[150px] text-xs flex items-start px-6 py-8 flex-col border-dashed border border-gray-300 rounded-xl'>
                    <Label>Link to your job/project request</Label>
                    <p className='mt-1 mb-2 text-muted-foreground'>make sure the site is not forbid AI web scrapping</p>
                    <Input placeholder="https://example.com" />
                  </div>
                </TabsContent>
              </>
            )}
            <p className='text-xs text-muted-foreground'></p>
            {error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
            <div className='flex justify-end items-center gap-2 mt-2'>
              <div className="flex gap-2">
                {hasStoredAnalysis && (
                  <Button
                    variant="ghost"
                    onClick={createNewAnalysis}
                    className="text-xs bg-zinc-100"
                  >
                    Generate New Analysis
                  </Button>
                )}
              </div>
              <Button
                onClick={hasStoredAnalysis ? viewStoredAnalysis : requestJobMatcher}
                disabled={isLoading || (!hasStoredAnalysis && (!jobDescription.trim() || !email.trim()))}
                className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''}} text-xs`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : hasStoredAnalysis ? (
                  'View Previous Response'
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </Tabs>
        </div>

      </div>

      {/* Mini Toast */}
      {showToast && selectedTools.length > 0 && (
        <div className={`fixed ${isMobile ? 'bottom-20' : 'bottom-4'} left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
          <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3 transition-all duration-200 hover:shadow-xl animate-bounce hover:animate-none cursor-pointer">
            <button
              onClick={scrollToDetails}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <span>{selectedTools.length} tool{selectedTools.length > 1 ? 's' : ''} selected, see detail</span>
              <ChevronDown size={16} className="animate-pulse" />
            </button>
            <button
              onClick={() => setShowToast(false)}
              className="hover:bg-blue-800 rounded-full p-1 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Job Match Dialog */}
      <JobMatchDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isLoading={isLoading}
        matchData={matchData}
        error={error}
        jobDescription={jobDescription}
        email={email}
      />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
};

export default Profile;