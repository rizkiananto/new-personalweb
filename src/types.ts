import { LucideIcon } from "lucide-react"

export interface Role {
  title: string
  icon: LucideIcon
}
export interface LanguageLabel {
  myWorks: string
  contactMe: string
  downloadCV: string
  title: string
  subtitle: string
  name: string
  // roles: string[]
  roles: Role[]
  location: string
  tagline: string
  storedTagline: string
  agentDescription: string
  storedDescription: string
  writeDescription: string
  sampleAgentValue: string
  uploadJobPoster: string
  pasteLink: string
  requirementPlaceholder: string
  requirementHelp: string
  analyzeProfile: string
  toolsTitle: string
  toolsSubtitle: string
  projects: string
  all: string
  companyRoles: string
  taskResponsibility: string
  portfolio: string
  fulltime: string
  contract: string
  freelance: string
  remote: string
  officialActive: string
  officialInactive: string
  tribute: string
  nextExperience: string
  shipmentTracking: string
}

export interface Tool {
  id: string
  name: string
  icon: string
  category: string
  section: string
  selected: boolean
  details: string
  projects: string[]
}

export interface ProjectFilter {
  all: boolean,
  companyRoles: boolean,
  taskResponsibility: boolean,
  portfolio: boolean
}

export interface Languages {
  EN: LanguageLabel,
  ID: LanguageLabel
}

export interface JobMatchResult {
  match_score: number;
  analysis: string;
  recommendations: {
    candidate: string;
    recruiter: string;
  };
  key_alignments: string[];
  potential_concerns: string[];
  next_steps: {
    candidate: string;
    recruiter: string;
  };
  salary_fit: string;
  culture_fit: string;
  growth_potential: string;
}

export interface JobMatchResponse {
  match_result: JobMatchResult;
  persona_id: string;
  analysis_timestamp: string;
}

export interface IRootContext {
  language: keyof Languages;
  viewMode: string;
  selectedTools: string[];
  projectFilters: ProjectFilter;
  activeTab: string;
  isMobile: boolean;
  t: LanguageLabel;
  setLanguage: (language: keyof Languages) => void;
  setViewMode: (viewMode: string) => void;
  setSelectedTools: React.Dispatch<React.SetStateAction<string[]>>
  setProjectFilters: React.Dispatch<React.SetStateAction<ProjectFilter>>
  setIsMobile: (isMobile: boolean) => void;
  setActiveTab: (activeTab: string) => void;
}