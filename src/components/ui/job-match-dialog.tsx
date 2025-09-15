"use client"
"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRight, 
  Target,
  Clock,
  Award,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { JobMatchResponse } from '@/types';

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

const MatchScore = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <div className={`rounded-lg border p-4 ${getScoreColor(score)}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{score}%</p>
          <p className="text-sm font-medium">{getScoreText(score)}</p>
        </div>
        <Target className="h-8 w-8" />
      </div>
    </div>
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
        return <AlertTriangle className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />;
      default:
        return <ArrowRight className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" />;
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
  
  console.log('cm:: ', matchData)
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
            <MatchScore score={matchData.match_result.match_score} />

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

            {/* Analysis Overview */}
            <SectionCard
              icon={Users}
              title="Analysis Overview"
              content={
                <p className="text-sm text-gray-700 leading-relaxed">
                  {matchData.match_result.analysis}
                </p>
              }
            />

            {/* Key Strengths */}
            <SectionCard
              icon={CheckCircle}
              title="Key Alignments"
              variant="success"
              content={
                <ListSection 
                  items={matchData.match_result.key_alignments} 
                  variant="success" 
                />
              }
            />

            {/* Areas of Concern */}
            <SectionCard
              icon={AlertTriangle}
              title="Potential Concerns"
              variant="warning"
              content={
                <ListSection 
                  items={matchData.match_result.potential_concerns} 
                  variant="warning" 
                />
              }
            />

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SectionCard
                icon={DollarSign}
                title="Salary Alignment"
                content={
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {matchData.match_result.salary_fit}
                  </p>
                }
              />
              
              <SectionCard
                icon={Users}
                title="Culture Fit"
                content={
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {matchData.match_result.culture_fit}
                  </p>
                }
              />
            </div>

            <SectionCard
              icon={TrendingUp}
              title="Growth Potential"
              content={
                <p className="text-sm text-gray-700 leading-relaxed">
                  {matchData.match_result.growth_potential}
                </p>
              }
            />

            {/* Next Steps */}
            <SectionCard
              icon={Clock}
              title="Recommended Next Steps"
              content={
                <p className="text-sm text-gray-700 leading-relaxed">
                  {matchData.match_result.next_steps.recruiter}
                </p>
              }
            />

            {/* Recommendations */}
            <SectionCard
              icon={ArrowRight}
              title="Strategic Recommendations"
              content={
                <p className="text-sm text-gray-700 leading-relaxed">
                  {matchData.match_result.recommendations.recruiter}
                </p>
              }
            />

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground text-center pt-4 border-t">
              Analysis completed on {new Date(matchData.analysis_timestamp).toLocaleString()}
            </div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </CustomDialogContent>
    </Dialog>
  );
};

export default JobMatchDialog;