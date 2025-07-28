import React, { useState, useRef, useEffect } from 'react';
import { getInitialState, validateForm, FormType } from '../../lib/formUtils';
import { StandardForm } from '../forms/StandardForm';
import { LeaderForm } from '../forms/collaborate/LeaderForm';
import { InvestorForm } from '../forms/collaborate/InvestorForm';
import { EngineerForm } from '../forms/collaborate/EngineerForm';
import { ExpertForm } from '../forms/collaborate/ExpertForm';



interface BaseFormState {
  name: string;
  email: string;
  phone: string;
  organization: string;
  interest: string;
  [key: string]: any; // For additional form fields
}

type FormState = BaseFormState;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFormType?: FormType;
  initialValues?: Partial<FormState>;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialFormType = 'standard',
  initialValues = {}
}) => {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    interest: '',
    ...initialValues
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setIsSubmitted(false);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle form input changes with proper type safety
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target as HTMLInputElement;
    const value = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle form submission with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cast formState to any to bypass TypeScript errors for dynamic form fields
    const validationErrors = validateForm(formState as any, initialFormType);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formState);
    setIsSubmitted(true);
  };

  const getTitle = () => {
    switch (initialFormType) {
      case 'standard': return 'Contact Us';
      case 'expert': return 'Become an Expert';
      case 'leader': return 'Partner with Us';
      case 'investor': return 'Invest in Smartslate';
      case 'engineer': return 'Join Our Team';
      case 'instructor': return 'Become an Instructor';
      case 'introduction': return 'Make an Introduction';
      default: return 'Get in Touch';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div 
        ref={modalContentRef}
        className="w-full max-w-lg bg-brand-card-bg rounded-xl shadow-2xl overflow-hidden border border-brand-accent/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-accent/10 bg-brand-card-bg/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {getTitle()}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 -mr-1.5 text-text-secondary hover:text-white rounded-full hover:bg-brand-accent/10 transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
              <p className="text-text-secondary mb-6">We've received your message and will get back to you shortly.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-brand-accent text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {initialFormType === 'standard' && (
                <StandardForm
                  formState={formState}
                  handleChange={handleChange}
                />
              )}
              {initialFormType === 'leader' && (
                <LeaderForm
                  formState={formState as any}
                  handleChange={handleChange}
                />
              )}
              {initialFormType === 'investor' && (
                <InvestorForm
                  formState={formState as any}
                  handleChange={handleChange}
                />
              )}
              {initialFormType === 'engineer' && (
                <EngineerForm
                  formState={formState as any}
                  handleChange={handleChange}
                />
              )}
              {initialFormType === 'expert' && (
                <ExpertForm
                  formState={formState as any}
                  handleChange={handleChange}
                />
              )}
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-brand-accent text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent focus:ring-offset-brand-card-bg"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ContactModal;