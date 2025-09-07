/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useContext, useRef } from 'react';
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
  ChevronsRight
} from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

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
import { Role } from '@/types';
import { CustomSeparator } from '../ui/separator';

const Sidebar = () => {
  const context = useContext(RootContext);

  if (!context) {
    throw new Error('Navbar must be used within a RootContext Provider');
  }
  
  const {t, setSelectedTools, selectedTools, viewMode, isMobile} = context;
  const sidebarRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (sidebarRef.current) {
        sidebarRef.current.scrollTo({
          top: sidebarRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 0);
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
              <h1 className="text-md text-gray-900 font-semibold">
                {t.title}
              </h1>
              <p className="text-gray-600 text-sm">
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
                <p className="text-gray-900">~{t.name}</p>
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
          <p className='text-sm m-0 font-semibold'>{t.tagline}</p>
          <p className='text-xs text-muted-foreground'>{t.agentDescription}</p>
        </div>
        {/* Personaice.com section */}
        <div className="flex w-full flex-col gap-6">
          <Tabs defaultValue="written">
            <TabsList>
              <TabsTrigger className='text-xs' value="written"><PencilLine /> Type your request</TabsTrigger>
              <TabsTrigger className='text-xs' value="image"><ImageLucide/> Upload image</TabsTrigger>
              <TabsTrigger className='text-xs' value="link"><Link/> Paste Link</TabsTrigger>
            </TabsList>
            <TabsContent value="written" className=''>
              <>
                <Textarea rows={50} className='placeholder:text-xs min-h-[150px] text-xs' placeholder={t.sampleAgentValue} /> 
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
            <p className='text-xs text-muted-foreground'></p>
            <div className='flex justify-end mt-2'>
              <Button>Analyze</Button>
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
          <div className="grid grid-cols-5 gap-2 mt-7">
            {tools.map((tool, i) => 
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
                      scrollToBottom();
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

          {/* Next.js Badge */}
          {selectedTools.map((toolId, i) => {
            const toolDetail = tools.find(t => t.id === toolId)
            return (
              <div className="p-3 shadow-md rounded-lg" key={i} id={`tool-explanation-${i}`}>
                <section className='flex gap-2 justify-start items-start relative'>
                  <Image src={`/tech-icon/${toolDetail?.icon}`} alt="ToolLogo" width={28} height={28} />
                  <div>
                    <p className="text-sm font-medium">{toolDetail?.name}</p>
                    <p className='text-xs text-muted-foreground'>React Framework</p>
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
    </div>
  );
};

export default Sidebar;