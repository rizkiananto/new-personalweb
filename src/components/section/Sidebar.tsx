/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useContext, useRef, useState, useEffect } from 'react';
import { 
  MapPin, 
  ExternalLink, 
  WandSparkles, 
  Upload, 
  Bot, 
  Image as ImageLucide, 
  Link, 
  X,
  PencilLine, 
  MessageCircleX,
  Minus,
  ChevronsRight,
  ChevronUp,
  ChevronDown
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
import { Role, JobMatchResponse } from '@/types';
import { CustomSeparator } from '../ui/separator';
import JobMatchDialog from '../ui/job-match-dialog';
import { getApiUrl, getApiHeaders, API_CONFIG } from '@/lib/api-config';
import axios from 'axios';

const Sidebar = () => {
  const context = useContext(RootContext);

  if (!context) {
    throw new Error('Navbar must be used within a RootContext Provider');
  }
  
  const {t, setSelectedTools, selectedTools, viewMode, isMobile} = context;
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      if (sidebarRef.current) {
        const firstTool = document.getElementById('tool-explanation-0');
        if (firstTool) {
          firstTool.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else {
          sidebarRef.current.scrollTo({
            top: sidebarRef.current.scrollHeight,
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

  return (
    <div className={`h-full overflow-y-auto ${viewMode==='Compact'?'bg-white':'bg-gray-50'}`} ref={sidebarRef} >
      <div className="p-6 space-y-3">
        {/* Profile Section */}
        <div className="space-y-4 flex gap-4">
          <div className="h-24 w-24 min-w-24 rounded-lg shadow-md overflow-hidden mb-0">
              <Image src="/avatar.jpg" alt="Profile Picture" width={80} height={80} className='object-cover w-full h-full'/>
          </div>
          <section className='flex-1 flex flex-col justify-between'>
            <div>
              <h1 className="text-md text-gray-900">
                {t.title}
              </h1>
              <p className="text-gray-500 text-sm">
                {t.subtitle}
              </p>
              <div className='flex gap-1 flex-wrap'>
              {t.roles.map((role:Role, idx:number) => {
                const IconCompoent = role.icon;
                return (
                  <div key={idx} className='flex items-center'>
                    <IconCompoent className='text-teal-700 text-shadow-md' size={16} />
                    <p className="text-teal-700 text-shadow-2xs mb-0 rounded-2xl text-xs px-2 py-1">{role.title}</p>
                    {idx < t.roles.length -1 && <><ChevronsRight size={8}/></>}
                  </div>
                )
              })}
              </div>
            </div>

            <div className="text-sm space-y-1 mt-6">
              <div className='flex justify-between items-center'>
                <p className="text-gray-900 font-semibold">~{t.name}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-600 px-1 rounded-md">
                  <MapPin className="w-3 h-3" />
                  <span className='text-gray-500 text-xs'>{t.location}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <CustomSeparator icon={Bot} />
        <div className=''>
          <p className='text-sm m-0 font-semibold'>{!hasStoredAnalysis ? t.tagline : t.storedTagline.replace("{email}", email)}</p>
          <p className='text-xs text-muted-foreground'>{!hasStoredAnalysis ? t.agentDescription : t.storedDescription.replace("{email}", email)}</p>
        </div>
        {/* Personaice.com section */}
        <div className="flex w-full flex-col gap-6">
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
                <TabsContent value="written" className=''>
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
                          className="mt-1 text-xs"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobDescription" className="text-xs">Job Description *</Label>
                        <MarkdownTextarea 
                          id="jobDescription"
                          rows={50} 
                          className='placeholder:text-xs min-h-[150px] text-xs mt-1' 
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
                    <Upload size={28} color='gray'/>
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

        <CustomSeparator icon={WandSparkles} />
        {/* Tools Section */}
        <div className="space-y-3 transition-all">
          <section className='relative'>
            <h3 className="font-semibold text-md text-gray-900">{t.toolsTitle}</h3>
            <p className="text-xs text-muted-foreground">{t.toolsSubtitle}</p>
            {
              selectedTools.length > 0 &&
              <div className='absolute right-0 top-0'>
                <button 
                  className='flex gap-2 text-xs items-center bg-red-50 text-black px-2 py-1 rounded-md hover:cursor-pointer hover:bg-red-400 hover:text-white transition-all'
                  onClick={() => setSelectedTools([])}
                  >
                  Clear
                  <X size={12}/>
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
                  <p className='line-clamp-1 rotate-270 m-0 text-center bg-gradient-to-r from-slate-200 via-slate-300 to-slate-100 px-2 py-1 rounded-md text-sm'>
                    {section}
                  </p> 
                </div>
                <div className="grid grid-cols-5 gap-2 ps-2">
                  {sectionTools.map((tool, i) => 
                    {
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
                          className={`group relative flex flex-col items-center py-2 rounded-lg transition-all gap-2 justify-between grayscale hover:grayscale-0 duration-300 ease-in-out cursor-pointer ${
                            selectedTools.includes(tool.id)
                              ? 'bg-sky-50 ring-2 ring-gray-50 grayscale-0'
                              : 'hover:bg-gray-50'
                          }`}
                          title={tool.name}
                        >
                          <Image src={`/tech-icon/${tool.icon}`} alt='tool icon' width={28} height={28} 
                            className='' />
                          <span className="text-xs text-gray-600">{tool.name}</span>
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
                      <span key={i} className='px-2 py-1 border border-gray-200 hover:cursor-pointer rounded-md flex gap-2 justify-center items-center'>{project}<ExternalLink size={12}/></span>
                    ))}
                  </section>
                </section>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Mini Toast */}
      {showToast && selectedTools.length > 0 && (
        <div className={`fixed ${isMobile ? 'bottom-20' : 'bottom-4'} left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
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
    </div>
  );
};

export default Sidebar;