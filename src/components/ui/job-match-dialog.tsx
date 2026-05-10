"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Target,
  Clock,
  Award,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Search
} from 'lucide-react';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface MatchRate {
  Tech: string;
  Exp: string;
  Teamwork: string;
  Overall: string;
}

interface MatchResult {
  'Title': string;
  'Plus Points': string[];
  'Match Rate': MatchRate;
  'Dig Deeper (Things to be considered)': string[];
}

export interface JobMatchResponse {
    match_result: MatchResult;
    persona_id: string;
    job_match_id: string;
    analysis_timestamp: string;
}

interface JobMatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  matchData: JobMatchResponse | null;
  error: string | null;
  jobDescription?: string;
  email?: string;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="text-sm text-muted-foreground">Analyzing job match...</p>
    </div>
  </div>
);

const ErrorMessage = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center space-y-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div>
        <p className="text-sm font-medium text-red-600">Analysis Failed</p>
        <p className="text-xs text-muted-foreground mt-1">{error}</p>
      </div>
    </div>
  </div>
);

const MatchScore = ({ title, overallScore }: { title: string; overallScore: string }) => {
  const score = parseInt(overallScore);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`rounded-lg border p-4 ${getScoreColor(score)}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{overallScore}</p>
          <p className="text-sm font-medium">{title}</p>
        </div>
        <Target className="h-8 w-8" />
      </div>
    </div>
  );
};

const MatchRateBreakdown = ({ matchRate }: { matchRate: MatchRate }) => {
  const categories = [
    { label: 'Technical Skills', value: matchRate.Tech, icon: BarChart3 },
    { label: 'Experience Level', value: matchRate.Exp, icon: Award },
    { label: 'Teamwork Experience', value: matchRate.Teamwork, icon: Clock },
  ];

  const getBarColor = (value: string) => {
    const score = parseInt(value);
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <BarChart3 className="h-4 w-4" />
          Match Rate Breakdown
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-6 space-y-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const score = parseInt(category.value);
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{category.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getBarColor(category.value)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const SectionCard = ({ 
  icon: Icon, 
  title, 
  content, 
  variant = 'default' 
}: { 
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <Card className={`${getVariantStyles()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-6">
        {content}
      </div>
    </Card>
  );
};

const ListSection = ({ items, variant = 'default' }: { items: string[]; variant?: 'success' | 'warning' | 'default' }) => {
  const getItemIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />;
      case 'warning':
        return <Search className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />;
      default:
        return <CheckCircle className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" />;
    }
  };

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          {getItemIcon()}
          <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
};

// Custom DialogContent without default animations
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
CustomDialogContent.displayName = "CustomDialogContent";

const JobMatchDialog: React.FC<JobMatchDialogProps> = ({
  isOpen,
  onClose,
  isLoading,
  matchData,
  error,
  jobDescription,
  email
}) => {
  const [isJobDescriptionOpen, setIsJobDescriptionOpen] = useState(false);
  
  console.log('cm:: ', matchData);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <CustomDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 mb-5">
              <Award className="h-5 w-5 text-blue-600" />
              Job Match Analysis
            </DialogTitle>
          </DialogHeader>

          {isLoading && <LoadingSpinner />}
          
          {error && <ErrorMessage error={error} />}
          
          <AnimatePresence mode="wait">
            {matchData && !isLoading && !error && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {/* Match Score */}
                <MatchScore 
                  title={matchData.match_result.Title} 
                  overallScore={matchData.match_result['Match Rate'].Overall} 
                />

                {/* Job Description Collapsible Section */}
                {jobDescription && (
                  <div className="border rounded-lg">
                    <button
                      onClick={() => setIsJobDescriptionOpen(!isJobDescriptionOpen)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Job Description {email && `(${email})`}</span>
                      </div>
                      {isJobDescriptionOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    {isJobDescriptionOpen && (
                      <div className="px-4 pb-4 border-t bg-gray-50">
                        <div className="pt-3">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                            {jobDescription}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Match Rate Breakdown */}
                <MatchRateBreakdown matchRate={matchData.match_result['Match Rate']} />

                {/* Plus Points */}
                <SectionCard
                  icon={CheckCircle}
                  title="Plus Points"
                  variant="success"
                  content={
                    <ListSection 
                      items={matchData.match_result['Plus Points']} 
                      variant="success" 
                    />
                  }
                />

                {/* Dig Deeper */}
                <SectionCard
                  icon={Search}
                  title="Dig Deeper (Things to be considered)"
                  variant="warning"
                  content={
                    <ListSection 
                      items={matchData.match_result['Dig Deeper (Things to be considered)']} 
                      variant="warning" 
                    />
                  }
                />

                {/* Timestamp */}
                {matchData.analysis_timestamp && (
                  <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                    Analysis completed on {new Date(matchData.analysis_timestamp).toLocaleString()}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CustomDialogContent>
    </Dialog>
  );
};

export default JobMatchDialog;
