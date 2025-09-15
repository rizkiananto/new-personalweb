/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useContext } from 'react';
import { Download, Moon } from 'lucide-react';
import { RootContext } from '@/contexts/RootContext';
import { Roboto_Slab } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import SwitcherDemo from '../ui/switcher-custom';

const roboto = Roboto_Slab({
  subsets: ['latin'], // Or other desired subsets
  weight: ['400', '700'], // Or other desired weights
});

const Navbar = () => {
  const context = useContext(RootContext);
  
  if (!context) {
    throw new Error('Navbar must be used within a RootContext Provider');
  }
  
  const { language, setLanguage, viewMode, setViewMode, isMobile, t } = context;

  return (
    <div className={`${viewMode === 'Mobile' ? 'fixed max-w-2xl left-1/2 top-0 -translate-x-1/2' : 'sticky top-0 left-0'} w-full z-50 bg-gray-300/10 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10`}>
      <div className={`px-6`}>
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6 font-semibold">
            {/* <button className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
              {t.myWorks}
            </button> */}
            <a href="https://id.linkedin.com/in/akbarrizki" target='_blank'>
            <button className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>{t.downloadCV}</span>
            </button>
            </a>
            <a href="https://id.linkedin.com/in/akbarrizki" target='_blank'>
            <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t.contactMe}
            </button>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            {!isMobile && (
              <>
                <SwitcherDemo
                  onClick={() => setViewMode(viewMode === 'Compact' ? 'Mobile' : 'Compact')}
                  value={viewMode !== 'Compact'}
                  />
              </>
            )}
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'ID' : 'EN')}
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`flag-${language}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.4, 0, 0.2, 1] 
                  }}
                  className="text-lg"
                >
                  <span className="font-medium">{language === 'ID' ? "🇮🇩" : "🇺🇸"}</span>
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`code-${language}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.1 
                  }}
                  className="font-medium text-gray-700 text-sm whitespace-nowrap"
                >
                  <span className="font-medium">{language}</span>
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;