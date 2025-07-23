import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginModal from '@/components/modals/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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
  const { user, loading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

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

  // Navigation link classes
  const navLinkClasses = ({ isActive, gradient = false }: { isActive: boolean; gradient?: boolean }): string => {
    return cn(
      'inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-indigo/50 rounded-lg',
      isActive 
        ? 'text-white bg-white/10 backdrop-blur-sm' 
        : gradient 
          ? 'gradient-text hover:opacity-90' 
          : 'text-gray-200 hover:text-white hover:bg-white/5',
      'hover:no-underline transition-all duration-200 hover:scale-[1.02] hover:shadow-sm'
    );
  };

  // Mobile navigation link classes
  const mobileNavLinkClasses = ({ isActive, gradient = false }: { isActive: boolean; gradient?: boolean }): string => {
    return cn(
      'block px-4 py-2.5 text-sm font-medium transition-colors',
      isActive 
        ? 'text-white bg-brand-indigo/30' 
        : gradient 
          ? 'gradient-text' 
          : 'text-gray-200 hover:bg-brand-indigo/20 hover:text-white',
      'duration-200 rounded-lg mx-2'
    );
  };

  // Render navigation item based on type
  const renderNavItem = (item: NavLinkType) => {
    if (item.type === 'dropdown') {
      return (
        <div key={item.label} className="relative group" ref={productsMenuRef}>
          <div className="flex items-center">
            <NavLink
              to={item.path || '#'}
              className={cn(
                'products-menu-trigger inline-flex items-center px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md',
                isProductsOpen ? 'text-white' : 'text-gray-300 hover:text-white'
              )}
              onMouseEnter={() => setIsProductsOpen(true)}
              aria-label={item.label}
            >
              {item.label}
            </NavLink>
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
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
                className={`ml-1 h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
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
            className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ${isProductsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <div className="py-1">
              {item.items.map((dropdownItem) => (
                <NavLink
                  key={dropdownItem.label}
                  to={dropdownItem.disabled ? '#' : dropdownItem.path}
                  className={({ isActive }) => cn(
                    'block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-inset rounded-md transition-colors',
                    dropdownItem.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                    isActive && 'bg-gray-700'
                  )}
                  onClick={(e) => {
                    if (dropdownItem.disabled) {
                      e.preventDefault();
                    } else {
                      setIsProductsOpen(false);
                      setIsMenuOpen(false);
                    }
                  }}
                  aria-disabled={dropdownItem.disabled}
                  aria-label={dropdownItem.disabled ? `${dropdownItem.label} - Coming Soon` : dropdownItem.label}
                  title={dropdownItem.tooltip}
                >
                  <div className="flex items-center justify-between">
                    <span>{dropdownItem.label}</span>
                    {dropdownItem.disabled && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-700/50 text-gray-400">
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
      >
        {item.label}
      </NavLink>
    );
  };

  // Toggle mobile menu with animation
  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      // Small delay to ensure the menu is rendered before starting animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      closeMenu();
    }
  };

  // Close menu with animation
  const closeMenu = () => {
    setIsAnimating(false);
    // Wait for exit animation to complete before hiding menu
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsProductsOpen(false);
    }, 300);
  };

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && 
          !menuRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('.hamburger-button')) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = '';
    };
  }, [isMenuOpen]);

  // Render mobile menu
  const renderMobileMenu = () => {
    if (!isMenuOpen && !isAnimating) return null;

    return (
      <div 
        ref={menuRef}
        className={cn(
          'fixed inset-0 bg-brand-indigo/80 backdrop-blur-lg z-40 transition-all duration-300',
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
          'transform transition-transform duration-300',
          isMenuOpen ? 'scale-100' : 'scale-95'
        )}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
        
        {/* Menu content */}
        <div 
          ref={menuContentRef}
          className={cn(
            'fixed inset-y-0 right-0 max-w-xs w-full bg-brand-indigo/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-all duration-300 ease-in-out z-50',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="h-full flex flex-col py-4 pb-8 overflow-y-auto">
            {navLinks.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center">
                      <NavLink
                        to={item.path || '#'}
                        className="flex-1 px-4 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors duration-200 touch-manipulation min-h-[48px] active:bg-gray-700/50"
                        onClick={() => {
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                          className={isMenuOpen ? 'opacity-0' : 'opacity-100 transition-opacity duration-200'}
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                          className={isMenuOpen ? 'opacity-100' : 'opacity-0 absolute'} 
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="relative w-6 h-5">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                        className={isMenuOpen ? 'opacity-0' : 'opacity-100 transition-opacity duration-200'}
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                        className={isMenuOpen ? 'opacity-100' : 'opacity-0 absolute'} 
                      />
                    </svg>
                  </div>Link
                          key={dropdownItem.label}
                          to={dropdownItem.disabled ? '#' : dropdownItem.path}
                          className={({ isActive }) => cn(
                            'block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md',
                            dropdownItem.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
{{ ... }}
                {item.label}
              </NavLink>
            );
          })}
          
          <header className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-brand-indigo/90 backdrop-blur-md shadow-lg' 
          : 'bg-brand-indigo/80 backdrop-blur-sm',
        'border-b border-white/10',
        'transform transition-all duration-300',
        'mx-auto px-4 sm:px-6 lg:px-8 py-2',
        'hover:shadow-xl hover:bg-brand-indigo/95 hover:backdrop-blur-lg'
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-14">
                <Link to="/" className="flex items-center group">
                  <span className="text-white text-xl font-bold tracking-tight group-hover:opacity-90 transition-all duration-200 group-hover:drop-shadow-glow">
                    Smartslate
                  </span>
                </Link>
{{ ... }}
            ) : (
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  closeMenu();
                }}
                className="w-full text-center px-6 py-4 text-base font-semibold text-[#2d1b69] bg-[hsl(var(--brand-accent))] rounded-lg transition-all duration-300 hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5 touch-manipulation min-h-[48px] active:scale-95 active:bg-[hsl(var(--brand-accent-dark))]"
                aria-label="Login or sign up for an account"
              >
                Login / Sign Up
              </button>
            )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {renderMobileMenu()}
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Header;
