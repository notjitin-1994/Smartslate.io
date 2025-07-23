import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { signInWithEmail, signInWithGoogle, AuthResult } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Close modal when clicking outside, pressing Escape, or when unmounting
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose(event as unknown as React.MouseEvent);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose(event as unknown as React.MouseEvent);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(-1);
  };

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    if (activeTab === 'email') {
      if (!email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!password) {
        errors.password = 'Password is required';
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [activeTab, email, password]);

  useEffect(() => {
    if (error) {
      // Move focus to error message for screen readers
      const errorElement = document.getElementById('error-message');
      errorElement?.focus();
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      let result: AuthResult;
      
      if (activeTab === 'email') {
        result = await signInWithEmail(email, password);
        
        if (result.success) {
          navigate('/', { replace: true });
          return;
        }
      } else {
        setError('Phone authentication coming soon');
        return;
      }
      
      setError(result.error || 'Authentication failed');
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Google sign-in failed');
      }
    } catch (error) {
      setError('An error occurred during Google sign-in');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit(e as any);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (formErrors.email) {
      validateForm();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      validateForm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with super light blur */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px]"
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative w-full max-w-md bg-gray-900/95 rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleClose}
            className="p-2 -m-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Close login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="px-8 pb-8 pt-2 space-y-6">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
          <div className="px-8 py-8 sm:px-10">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23" fill="currentColor">
                  <path d="M1 1h21v21H1V1zm17.5 17.5h-14v-14h14v14z" />
                  <path d="M11.5 5.5v13h-1v-13h1z" />
                  <path d="M8 8.5h7v1H8v-1zM8 11.5h7v1H8v-1zM8 14.5h7v1H8v-1z" />
                </svg>
                Microsoft
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800/50 text-gray-300">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="border-b border-gray-600">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('email')}
                    className={cn(
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                      activeTab === 'email'
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    )}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setActiveTab('phone')}
                    className={cn(
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                      activeTab === 'phone'
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    )}
                  >
                    Phone
                  </button>
                </nav>
              </div>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {activeTab === 'email' ? (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    Phone number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-indigo-400 hover:text-indigo-300 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-600'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white pr-10`}
                    placeholder="••••••••"
                    aria-invalid={!!formErrors.password}
                    aria-describedby={formErrors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
                    tabIndex={-1} // Prevent tab focus on the icon
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-500">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {error && (
                <div 
                  id="error-message"
                  className="mt-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg"
                  role="alert"
                  aria-live="assertive"
                  tabIndex={-1}
                >
                  <p className="text-sm text-red-400 text-center">{error}</p>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
                
                <div className="mt-4 text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none focus:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </form>
          </div>

          <div className="px-8 py-4 bg-gray-800/30 border-t border-gray-700/50">
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
