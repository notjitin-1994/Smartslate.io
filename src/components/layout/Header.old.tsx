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
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
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
        'bg-brand-indigo/80 backdrop-blur-lg border-b border-white/10',
        'shadow-lg hover:shadow-xl hover:bg-brand-indigo/90',
        isScrolled ? 'py-1' : 'py-2',
        isMenuOpen ? 'h-screen' : 'h-auto'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            'flex items-center justify-between',
            isScrolled ? 'h-14' : 'h-16',
            'transition-all duration-300'
          )}>items-center h-14">
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
