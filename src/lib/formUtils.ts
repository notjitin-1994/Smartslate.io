import type { ExpertFormState, LeaderFormState, InvestorFormState, EngineerFormState } from '../types/forms/types';

export type FormType = 'standard' | 'instructor' | 'introduction' | 'investor' | 'expert' | 'leader' | 'engineer' | 'ignition_interest' | 'strategy_consultation';

export interface StandardFormData {
  name: string;
  organization: string;
  email: string;
  phone: string;
  interest?: string;
}

export interface InstructorFormData {
  name: string;
  email: string;
  phone: string;
  expertise: string;
  portfolio: string;
}

export interface IntroductionFormData {
  yourName: string;
  yourEmail: string;
  contactName: string;
  contactDesignation: string;
  contactOrg: string;
  contactInfo: string;
}

// This can be removed if not used elsewhere, or kept for other purposes.
export interface OldInvestorFormData {
  name: string;
  email: string;
  phone: string;
  fundName: string;
  role: string;
}

export type FormData = StandardFormData | InstructorFormData | IntroductionFormData | OldInvestorFormData | ExpertFormState | LeaderFormState | InvestorFormState | EngineerFormState;

// Returns the initial state object for a given form type.
export const getInitialState = (type: FormType): FormData => {
  switch (type) {
    case 'expert':
      return { fullName: '', email: '', linkedinProfile: '', fieldOfExpertise: '', yearsOfExperience: '', courseIdea: '', hasTaughtBefore: '', teachingExperience: '' };
    case 'leader':
      return { fullName: '', email: '', linkedinProfile: '', organization: '', role: '', interest: '' };
    case 'investor':
        return { fullName: '', email: '', linkedinProfile: '', fundName: '', investmentStage: '', interest: '' };
    case 'engineer':
      return { fullName: '', email: '', linkedinProfile: '', githubProfile: '', yearsOfExperience: '', techStack: '', interest: '' };
    case 'instructor':
      return { name: '', email: '', phone: '', expertise: '', portfolio: '' };
    case 'introduction':
      return { yourName: '', yourEmail: '', contactName: '', contactDesignation: '', contactOrg: '', contactInfo: '' };
    case 'standard':
    default:
      return { name: '', organization: '', email: '', phone: '', interest: '' };
  }
};

// Validates form data based on the form type and returns an errors object.
export const validateForm = (formData: FormData, formType: FormType): Record<string, string> => {
  const errors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

  // General validations
  if ('fullName' in formData && !formData.fullName.trim()) errors.fullName = "Full Name is required.";
  if ('email' in formData && !emailRegex.test(formData.email)) errors.email = "Invalid email address.";
  if ('linkedinProfile' in formData && !formData.linkedinProfile.trim()) errors.linkedinProfile = "LinkedIn Profile is required.";

  // Type-specific validations
  switch (formType) {
    case 'expert': {
      const expertData = formData as ExpertFormState;
      if (!expertData.fieldOfExpertise.trim()) errors.fieldOfExpertise = "Field of expertise is required.";
      if (!expertData.yearsOfExperience.trim()) errors.yearsOfExperience = "Years of experience is required.";
      if (!expertData.courseIdea.trim()) errors.courseIdea = "Course idea is required.";
      if (!expertData.hasTaughtBefore.trim()) errors.hasTaughtBefore = "This field is required.";
      break;
    }
    case 'leader': {
      const leaderData = formData as LeaderFormState;
      if (!leaderData.organization.trim()) errors.organization = "Organization is required.";
      if (!leaderData.role.trim()) errors.role = "Your role is required.";
      if (!leaderData.interest.trim()) errors.interest = "Please specify your interest.";
      break;
    }
    case 'investor': {
      const investorData = formData as InvestorFormState;
      if (!investorData.fundName.trim()) errors.fundName = "Fund name is required.";
      if (!investorData.investmentStage.trim()) errors.investmentStage = "Investment stage is required.";
      if (!investorData.interest.trim()) errors.interest = "Please specify your interest.";
      break;
    }
    case 'engineer': {
      const engineerData = formData as EngineerFormState;
      if (!engineerData.githubProfile.trim()) errors.githubProfile = "GitHub Profile is required.";
      if (!engineerData.yearsOfExperience.trim()) errors.yearsOfExperience = "Years of experience is required.";
      if (!engineerData.techStack.trim()) errors.techStack = "Tech stack is required.";
      if (!engineerData.interest.trim()) errors.interest = "Please specify your interest.";
      break;
    }
    // Keep old cases for now
    case 'standard': {
      const standardData = formData as StandardFormData;
      if ('name' in standardData && !standardData.name.trim()) errors.name = "Name is required.";
      if (!standardData.organization?.trim()) errors.organization = "Organization is required.";
      break;
    }
    case 'instructor': {
      const instructorData = formData as InstructorFormData;
      if ('name' in instructorData && !instructorData.name.trim()) errors.name = "Name is required.";
      if (!instructorData.expertise?.trim()) errors.expertise = "Area of expertise is required.";
      if (!instructorData.portfolio?.trim()) errors.portfolio = "Portfolio URL is required.";
      break;
    }
    case 'introduction': {
      const introData = formData as IntroductionFormData;
      if (!introData.yourName?.trim()) errors.yourName = "Your name is required.";
      if (!introData.yourEmail?.trim() || !emailRegex.test(introData.yourEmail)) errors.yourEmail = "A valid email is required.";
      if (!introData.contactName?.trim()) errors.contactName = "Contact's name is required.";
      if (!introData.contactDesignation?.trim()) errors.contactDesignation = "Contact's designation is required.";
      if (!introData.contactOrg?.trim()) errors.contactOrg = "Contact's organization is required.";
      if (!introData.contactInfo?.trim()) errors.contactInfo = "Contact information is required.";
      break;
    }
  }
  return errors;
};