/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from 'react';
import { 
  MapPin,
} from 'lucide-react';
import { ProjectFilter, Tool, IRootContext } from '@/types';
import { content } from '@/data';
import { RootContext } from '@/contexts/RootContext';
import Profile from '@/components/section/Profile';
import Content from '@/components/section/Content';

const Portfolio = () => {
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
      
      setIsMobile(isMobileDevice);
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  return (
    <RootContext.Provider value={{
      selectedTools,
      projectFilters,
      activeTab,
      isMobile,
      t: content,
      setSelectedTools,
      setProjectFilters,
      setActiveTab,
      setIsMobile
    }}>
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex items-center justify-center overflow-x-hidden">
          <div className="w-full max-w-2xl shadow-2xl relative pt-14">
            <div className="bg-white">
              <Profile />
            </div>
            <Content />
          </div>
        </div>
      </div>
    </RootContext.Provider>
  );
};

export default Portfolio;