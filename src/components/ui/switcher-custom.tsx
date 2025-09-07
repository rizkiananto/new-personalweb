import React, { useState } from 'react';
import { Moon, Sun, ListChevronsDownUp, Expand, Phone, LucideIcon, LaptopMinimal, Smartphone } from 'lucide-react';

interface CustomSwitcherProps {
  checked: boolean;
  onToggle: () => void;
  activeIcon: LucideIcon;
  inactiveIcon: LucideIcon;
  activeText: string;
  inactiveText: string;
  className?: string;
}

export const CustomSwitcher = ({ 
  checked, 
  onToggle, 
  activeIcon: ActiveIcon, 
  inactiveIcon: InactiveIcon, 
  activeText, 
  inactiveText,
  className = ""
}: CustomSwitcherProps) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex items-center justify-between
        w-24 h-9 px-1 py-1
        bg-gray-100 dark:bg-gray-700
        rounded-xl border-2 border-gray-200 dark:border-gray-600
        transition-all duration-300 ease-in-out
        hover:shadow-lg focus:outline-none
        ${checked ? 'bg-blue-100 dark:bg-blue-900 border-blue-400' : ''}
        ${className}
      `}
    >
      {/* Background slide effect */}
      <div
        className={`
          absolute top-0.5 left-0.5 w-11 h-7
          bg-white dark:bg-gray-800 rounded-lg
          shadow-md transition-transform duration-300 ease-in-out
          ${checked ? 'transform translate-x-11' : 'transform translate-x-0'}
        `}
      />
      
      {/* Left side (inactive state) */}
      <div 
        className={`
          relative z-10 flex items-center justify-center w-10 h-8
          transition-opacity duration-300
          ${!checked ? 'opacity-100' : 'opacity-40'}
        `}
      >
        <InactiveIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      
      {/* Right side (active state) */}
      <div 
        className={`
          relative z-10 flex items-center justify-center w-10 h-8
          transition-opacity duration-300
          ${checked ? 'opacity-100' : 'opacity-40'}
        `}
      >
        <ActiveIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      
      {/* Text overlay on the sliding element */}
      <div 
        className={`
          absolute top-0.5 w-11 h-8
          flex items-center justify-center
          text-xs font-medium text-gray-700 dark:text-gray-300
          transition-transform duration-300 ease-in-out pointer-events-none
          ${checked ? 'transform translate-x-12' : 'transform translate-x-0.5'}
        `}
      >
        {/* {checked ? activeText : inactiveText} */}
      </div>
    </button>
  );
};

const SwitcherDemo = ({onClick, value}: {onClick: () => void, value: boolean}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [wifi, setWifi] = useState(true);

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      {/* Standalone switchers */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <CustomSwitcher
            checked={value}
            onToggle={onClick}
            activeIcon={ListChevronsDownUp}
            inactiveIcon={Expand}
            activeText="Dark"
            inactiveText="Light"
          />
        </div>
      </div>
    </div>
  );
};

export default SwitcherDemo;