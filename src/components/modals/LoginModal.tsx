import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { parsePhoneNumberFromString, AsYouType, CountryCode } from 'libphonenumber-js';

// --- TYPE DEFINITIONS ---
type AuthMode = 'login' | 'signup';
type AuthMethod = 'email' | 'phone';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CountryInfo {
  flag: string;
  code: string;
  callingCode: string;
  isValid: boolean;
}

interface FormData {
  email: string;
  phone: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  inputValue: string;
}

// --- COMPONENT ---
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // --- STATE MANAGEMENT ---
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    inputValue: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryInfo, setCountryInfo] = useState<CountryInfo>({
    flag: '🌐',
    code: 'US',
    callingCode: '',
    isValid: false,
  });

  // --- REFS ---
  const inputRef = useRef<HTMLInputElement>(null);

  // --- HELPERS ---
  const getFlagEmoji = useCallback((countryCode: string) => {
    try {
      return countryCode
        .toUpperCase()
        .split('')
        .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .join('');
    } catch (e) {
      return '🌐'; // Fallback emoji
    }
  }, []);

  // --- EVENT HANDLERS ---
  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      phone: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      inputValue: '',
    });
    setError('');
  }, []);

  const handleAuthModeToggle = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    resetForm();
  }, [resetForm]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === 'inputValue') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(value);

        if (isEmail) {
          setAuthMethod('email');
          setFormData((prev) => ({ ...prev, email: value, phone: '' }));
        } else {
          setAuthMethod('phone');
          const phoneNumber = new AsYouType(countryInfo.code as CountryCode);
          const formatted = phoneNumber.input(value);
          const parsed = parsePhoneNumberFromString(formatted, countryInfo.code as CountryCode);

          setFormData((prev) => ({ ...prev, phone: formatted, email: '' }));

          if (parsed) {
            setCountryInfo({
              flag: getFlagEmoji(parsed.country || 'US'),
              code: parsed.country || 'US',
              callingCode: parsed.countryCallingCode || '',
              isValid: parsed.isValid(),
            });
          }
        }
      }
    },
    [countryInfo.code, getFlagEmoji]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      if (authMode === 'signup' && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (authMethod === 'email' && !formData.email) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      if (authMethod === 'phone' && (!formData.phone || !countryInfo.isValid)) {
        setError('Please enter a valid phone number');
        setIsLoading(false);
        return;
      }

      // Simulate API call
      console.log('Submitting:', {
        authMode,
        authMethod,
        ...formData,
      });

      setTimeout(() => {
        setIsLoading(false);
        onClose(); // Close modal on success
      }, 1000);
    },
    [authMode, authMethod, formData, countryInfo.isValid, onClose]
  );

  // --- RENDER LOGIC ---
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md bg-gray-900/95 rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="absolute top-0 right-0 pt-4 pr-4 z-20">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Close login"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="px-8 py-10 space-y-6 relative z-10">
            {/* Auth Mode Toggle */}
            <div className="relative w-full bg-gray-800/50 rounded-lg p-1 flex mb-6">
              <div
                className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-brand-accent rounded-md transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(${authMode === 'login' ? '0%' : '100%'})` }}
              />
              <button
                type="button"
                onClick={() => handleAuthModeToggle('login')}
                className="relative flex-1 py-2.5 font-medium text-center transition-colors z-10"
                style={{ color: 'hsl(var(--text-main))' }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleAuthModeToggle('signup')}
                className="relative flex-1 py-2.5 font-medium text-center transition-colors z-10"
                style={{ color: 'hsl(var(--text-main))' }}
              >
                Create Account
              </button>
            </div>

            {/* Welcome Text */}
            <div className="text-center">
              <h2 className="text-3xl font-bold font-quicksand">
                {authMode === 'login' ? (
                  <>
                    <span className="gradient-text">Welcome</span>{' '}
                    <span className="text-white">back</span>
                  </>
                ) : (
                  <span className="gradient-text">Get Started</span>
                )}
              </h2>
              <p className="mt-2 text-gray-300 font-quicksand">
                {authMode === 'login' 
                  ? 'Sign in to your account to continue'
                  : 'Create your account to get started'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {authMode === 'signup' && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-accent/50 focus:border-brand-accent/50 sm:text-sm bg-gray-800/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="inputValue" className="block text-sm font-medium text-gray-300">
                  Email Address or Phone Number
                </label>
                <div className={`mt-1 flex rounded-lg shadow-sm ${authMethod === 'phone' ? 'border border-gray-700' : ''}`}>
                  {authMethod === 'phone' && (
                    <span className="inline-flex items-center px-3 rounded-l-lg border-r border-gray-700 bg-gray-800/50 text-gray-300 sm:text-sm">
                      {countryInfo.flag}
                    </span>
                  )}
                  <input
                    ref={inputRef}
                    id="inputValue"
                    name="inputValue"
                    type={authMethod === 'email' ? 'email' : 'tel'}
                    autoComplete="email tel"
                    required
                    value={formData.inputValue}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-brand-accent/50 focus:border-brand-accent/50 sm:text-sm bg-gray-800/50 ${authMethod === 'phone' ? 'rounded-r-lg' : 'rounded-lg border border-gray-700'}`}
                    placeholder={authMethod === 'email' ? 'you@example.com' : '555-123-4567'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-accent/50 focus:border-brand-accent/50 sm:text-sm bg-gray-800/50"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-accent/50 focus:border-brand-accent/50 sm:text-sm bg-gray-800/50"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent/50 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  authMode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900/95 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => console.log('Login with Google')}
                  className="flex flex-col items-center justify-center py-3 px-2 border border-transparent rounded-lg shadow-sm bg-brand-accent text-sm font-medium text-white hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent/50 transition-colors"
                  title="Sign in with Google"
                >
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  <span className="text-xs mt-1">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => console.log('Login with Microsoft')}
                  className="flex flex-col items-center justify-center py-3 px-2 border border-transparent rounded-lg shadow-sm bg-brand-accent text-sm font-medium text-white hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent/50 transition-colors"
                  title="Sign in with Microsoft"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 23 23" aria-hidden="true">
                    <path d="M11.5 11.5H1V1h10.5v10.5zm0 10.5H1V13h10.5v9zM23 11.5H12.5V1H23v10.5zm0 10.5H12.5V13H23v9z" />
                  </svg>
                  <span className="text-xs mt-1">Microsoft</span>
                </button>

                <button
                  type="button"
                  onClick={() => console.log('Login with SSO')}
                  className="flex flex-col items-center justify-center py-3 px-2 border border-transparent rounded-lg shadow-sm bg-brand-accent text-sm font-medium text-white hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent/50 transition-colors"
                  title="Single Sign-On"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs mt-1">SSO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
