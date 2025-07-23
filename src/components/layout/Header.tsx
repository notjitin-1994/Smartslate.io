import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginModal from '@/components/modals/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Types
interface BaseNavItem {
  label: string;
  gradient?: boolean;
}

interface RegularNavItem extends BaseNavItem {
  path: string;
  type?: never;
  items?: never;
}

interface DropdownItem {
  path: string;
  label: string;
  disabled?: boolean;
  tooltip?: string;
}

interface DropdownNavItem extends BaseNavItem {
  type: 'dropdown';
  path?: string;
  items: DropdownItem[];
}

type NavLinkType = RegularNavItem | DropdownNavItem;

interface HeaderProps {
  onContactClick: (formType?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  // State management
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  
  // Refs
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks: NavLinkType[] = [
    { 
      type: 'dropdown',
      label: 'Solutions',
      path: '/solutions',
      items: [
        { path: '/solutions/ignite-series', label: 'Ignite Series' },
        { path: '#', label: 'Strategic Skill Architecture' },
        { path: '#', label: 'Solara', disabled: true, tooltip: 'Coming Soon' }
      ]
    },
    { path: '/smartslate-difference', label: 'Why Smartslate', gradient: true },
    { path: '/collaborate', label: 'Partner With Us' }
  ] as const;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsMenuRef.current && 
          !productsMenuRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('.products-menu-trigger')) {
        setIsProductsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation link classes with glassmorphic effect
  const navLinkClasses = ({ isActive, gradient = false }: { isActive: boolean; gradient?: boolean }): string => {
    return cn(
      'inline-flex items-center px-4 py-2 text-sm font-medium transition-all',
      'focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-indigo/50',
      'rounded-lg backdrop-blur-sm',
      isActive 
        ? 'text-white bg-white/10 shadow-inner' 
        : gradient 
          ? 'gradient-text hover:opacity-90' 
          : 'text-gray-200 hover:text-white hover:bg-white/5',
      'hover:no-underline transition-all duration-200 hover:scale-[1.02] hover:shadow-sm',
      'border border-white/5 hover:border-white/10'
    );
  };

  // Mobile navigation link classes with glassmorphic effect
  const mobileNavLinkClasses = ({ isActive, gradient = false }: { isActive: boolean; gradient?: boolean }): string => {
    return cn(
      'block px-4 py-2.5 text-sm font-medium transition-all',
      'mx-2 rounded-lg border border-transparent',
      isActive 
        ? 'text-white bg-white/10 backdrop-blur-sm border-white/10' 
        : gradient 
          ? 'gradient-text hover:opacity-90' 
          : 'text-gray-200 hover:text-white hover:bg-white/5 hover:border-white/5',
      'duration-200 hover:shadow-sm'
    );
  };

  // Toggle mobile menu with animation
  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  // Close menu with animation
  const closeMenu = () => {
    if (menuContentRef.current) {
      menuContentRef.current.classList.add('animate-slideOut');
      setTimeout(() => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }, 200);
    }
  };

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Render navigation item based on type
  const renderNavItem = (item: NavLinkType) => {
    if (item.type === 'dropdown') {
      return (
        <div key={item.label} className="relative group" ref={productsMenuRef}>
          <div className="flex items-center">
            <NavLink
              to={item.path || '#'}
              className={cn(
                'products-menu-trigger inline-flex items-center px-4 py-2 text-sm font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-indigo/50',
                'rounded-lg backdrop-blur-sm',
                isProductsOpen 
                  ? 'text-white bg-white/10 shadow-inner' 
                  : 'text-gray-200 hover:text-white hover:bg-white/5',
                'hover:no-underline transition-all duration-200 hover:scale-[1.02] hover:shadow-sm',
                'border border-white/5 hover:border-white/10'
              )}
              onMouseEnter={() => setIsProductsOpen(true)}
              aria-label={item.label}
            >
              {item.label}
            </NavLink>
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none ml-1 p-1 rounded-md hover:bg-white/10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsProductsOpen(!isProductsOpen);
              }}
              onMouseEnter={() => setIsProductsOpen(true)}
              aria-expanded={isProductsOpen}
              aria-haspopup="true"
              aria-label={`Toggle ${item.label} menu`}
            >
              <svg
                className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Dropdown Menu */}
          <div
            className={`absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-gray-800/95 backdrop-blur-lg ring-1 ring-white/10 focus:outline-none transition-all duration-200 ${isProductsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <div className="py-1">
              {item.items.map((dropdownItem) => (
                <NavLink
                  key={dropdownItem.path}
                  to={dropdownItem.disabled ? '#' : dropdownItem.path}
                  className={({ isActive }) => cn(
                    'block px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-inset rounded-md mx-2 my-1 transition-colors',
                    dropdownItem.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                    isActive && 'bg-white/10 text-white'
                  )}
                  onClick={(e) => {
                    if (dropdownItem.disabled) {
                      e.preventDefault();
                    } else {
                      setIsProductsOpen(false);
                      closeMenu();
                    }
                  }}
                  title={dropdownItem.disabled ? dropdownItem.tooltip : ''}
                >
                  <div className="flex items-center">
                    <span>{dropdownItem.label}</span>
                    {dropdownItem.disabled && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Regular navigation link
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => navLinkClasses({ isActive, gradient: item.gradient })}
        onClick={closeMenu}
      >
        {item.label}
      </NavLink>
    );
  };

  // Render mobile menu
  const renderMobileMenu = () => (
    <div
      className={cn(
        'fixed inset-0 z-40 overflow-y-auto md:hidden',
        'bg-brand-indigo/95 backdrop-blur-md transition-opacity duration-300',
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        'flex flex-col pt-16 pb-8'
      )}
      ref={menuContentRef}
    >
      <div className="px-4 space-y-2">
        {navLinks.map((item) => {
          if (item.type === 'dropdown') {
            return (
              <div key={item.label} className="space-y-1">
                <button
                  type="button"
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg',
                    'text-white hover:bg-white/10 transition-colors duration-200',
                    isProductsOpen ? 'bg-white/10' : ''
                  )}
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                >
                  <span>{item.label}</span>
                  <svg
                    className={`ml-2 h-5 w-5 transform transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={cn(
                    'pl-4 space-y-1 overflow-hidden transition-all duration-200',
                    isProductsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  {item.items.map((dropdownItem) => (
                    <NavLink
                      key={dropdownItem.path}
                      to={dropdownItem.disabled ? '#' : dropdownItem.path}
                      className={({ isActive }) => cn(
                        'block px-4 py-2.5 text-sm rounded-lg',
                        'text-gray-200 hover:bg-white/10',
                        isActive ? 'bg-white/10 text-white' : '',
                        dropdownItem.disabled ? 'opacity-50 cursor-not-allowed' : ''
                      )}
                      onClick={(e) => {
                        if (dropdownItem.disabled) {
                          e.preventDefault();
                        } else {
                          closeMenu();
                        }
                      }}
                      title={dropdownItem.disabled ? dropdownItem.tooltip : ''}
                    >
                      <div className="flex items-center justify-between">
                        <span>{dropdownItem.label}</span>
                        {dropdownItem.disabled && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => mobileNavLinkClasses({ isActive, gradient: item.gradient })}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          );
        })}

        <Button
          onClick={() => {
            closeMenu();
            onContactClick();
          }}
          variant="outline"
          className="w-full mt-4 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-200"
        >
          Contact Us
        </Button>

        {user ? (
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                  <AvatarFallback className="bg-brand-accent/20 text-brand-accent">
                    {getInitials(user.displayName || user.email)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {user.displayName || user.email?.split('@')[0]}
                </div>
                <div className="text-sm font-medium text-gray-300">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <NavLink
                to="/dashboard"
                className="block px-4 py-2 text-base font-medium text-gray-200 hover:bg-white/10 hover:text-white rounded-lg mx-2"
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-base font-medium text-gray-200 hover:bg-white/10 hover:text-white rounded-lg mx-2"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 mt-4 border-t border-white/10">
            <Button
              onClick={() => {
                closeMenu();
                setIsLoginModalOpen(true);
              }}
              variant="outline"
              className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white transition-all duration-200"
            >
              Sign in
            </Button>
            <p className="mt-2 text-center text-sm text-gray-300">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  closeMenu();
                  onContactClick('signup');
                }}
                className="font-medium text-white hover:underline focus:outline-none"
              >
                Get started
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[60] px-4 py-2 bg-brand-indigo text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-indigo/50"
      >
        Skip to main content
      </a>

      {/* Main Header */}
      <header 
        ref={menuRef}
        className={cn(
          'fixed w-full z-50 transition-all duration-300',
          'bg-brand-indigo/80 backdrop-blur-lg border-b border-white/10',
          'shadow-lg hover:shadow-xl hover:bg-brand-indigo/90',
          isScrolled ? 'py-1' : 'py-2',
          isMenuOpen ? 'h-screen' : 'h-auto'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            'flex items-center justify-between',
            isScrolled ? 'h-14' : 'h-16',
            'transition-all duration-300'
          )}>
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <img 
                  src="/images/Final-Dark-BG.png" 
                  alt="Smartslate Logo" 
                  className="h-10 w-auto group-hover:opacity-90 transition-all duration-200 group-hover:drop-shadow-glow"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((item) => renderNavItem(item))}
              
              {user ? (
                <div className="relative ml-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <button
                        type="button"
                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-indigo/50 focus:ring-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <span className="sr-only">Open user menu</span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback className="bg-brand-accent/20 text-brand-accent text-xs">
                            {getInitials(user.displayName || user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:ml-4 md:flex md:items-center">
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white border-transparent hover:border-transparent transition-all duration-200"
                  >
                    Sign In / Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-indigo/50 transition-all duration-200"
                aria-expanded="false"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Icon when menu is open */}
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && renderMobileMenu()}
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          onContactClick('signup');
        }}
      />
    </>
  );
};

export default Header;
