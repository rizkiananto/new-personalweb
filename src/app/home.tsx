/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from 'react';
import { 
  MapPin,
} from 'lucide-react';
import { LanguageLabel, ProjectFilter, Tool, Languages, IRootContext } from '@/types';
import { translations } from '@/data';
import { RootContext } from '@/contexts/RootContext';
import Navbar from '@/components/section/Navbar';
import Sidebar from '@/components/section/Sidebar';
import Content from '@/components/section/Content';

const Portfolio = () => {
  const [language, setLanguage] = useState<keyof Languages>('EN');
  const [viewMode, setViewMode] = useState('Compact');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [projectFilters, setProjectFilters] = useState<ProjectFilter>({
    all: true,
    companyRoles: false,
    taskResponsibility: false,
    portfolio: false
  });
  const [activeTab, setActiveTab] = useState('description');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      
      // Mobile device patterns
      const mobilePatterns = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
        /Opera Mini/i,
        /IEMobile/i,
        /Mobile/i
      ];
      
      // Tablet patterns (you might want to treat these differently)
      const tabletPatterns = [
        /iPad/i,
        /Android(?!.*Mobile)/i, // Android tablets
        /Tablet/i
      ];
      
      const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent));
      const isTablet = tabletPatterns.some(pattern => pattern.test(userAgent));
      
      // Touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Screen size as backup
      const smallScreen = window.innerWidth < 768;
      
      // Combine checks
      const isMobileDevice = isMobile || (hasTouch && smallScreen && !isTablet);
      
      console.log('Device info:', {
        userAgent,
        isMobile,
        isTablet,
        hasTouch,
        screenWidth: window.innerWidth,
        finalDecision: isMobileDevice ? 'Mobile' : 'Compact'
      });
      
      setIsMobile(isMobileDevice);
      setViewMode(isMobileDevice ? 'Mobile' : 'Compact');
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  const t:LanguageLabel = translations[language];


  return (
    <RootContext.Provider value={{
      language, 
      viewMode,
      selectedTools,
      projectFilters,
      activeTab,
      isMobile,
      t,
      setLanguage,
      setViewMode,
      setSelectedTools,
      setProjectFilters,
      setActiveTab,
      setIsMobile
    }}>
      <div className="min-h-screen bg-gray-50">
        {viewMode === 'Compact' && !isMobile ? (
          <div className="h-screen flex">
            <div className="w-[530px] border-r border-gray-200">
              <Sidebar />
            </div>
            <div className="flex-1 relative">
              <Content />
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-2xl shadow-2xl relative pt-14">
              <div className="bg-white">
                <Sidebar />
              </div>
              <Content />
            </div>
          </div>
        )}
      </div>
    </RootContext.Provider>
  );
};

export default Portfolio;