/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useContext, useState } from 'react';
import { Download, MapPin, Moon } from 'lucide-react';
import { RootContext } from '@/contexts/RootContext';
import { Roboto_Slab } from 'next/font/google';
import ContactDialog from '@/components/ui/contact-dialog';

const roboto = Roboto_Slab({
  subsets: ['latin'], // Or other desired subsets
  weight: ['400', '700'], // Or other desired weights
});

const Navbar = () => {
  const context = useContext(RootContext);

  if (!context) {
    throw new Error('Navbar must be used within a RootContext Provider');
  }

  const { t } = context;
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="fixed max-w-2xl left-1/2 top-0 -translate-x-1/2 w-full z-50 bg-gray-300/10 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10">
      <div className={`px-6`}>
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6 font-semibold">
            {/* <button className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
              {t.myWorks}
            </button> */}
            {/* https://drive.google.com/file/d/1srguRQlY1_lZi3S8gdV0xOtINds7vGxn/view?usp=drive_link */}
            <a href="https://drive.google.com/uc?export=download&id=1PnDeJAsF74xYqtbfwx35b8xJLh_eI-Ae" target='_blank'>
              <button className="flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors">
                <Download className="w-4 h-4" />
                <span>{t.downloadCV}</span>
              </button>
            </a>
            <button
              type='button'
              onClick={() => setContactOpen(true)}
              className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              {t.contactMe}
            </button>
            <a href="https://blog.rizkiananto.com" target='_blank'>
              <button className="flex items-center text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Blog
              </button>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              🇮🇩
              <span className='text-xs truncate'>{t.location}</span>
            </div>
          </div>
        </div>
      </div>
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
};

export default Navbar;