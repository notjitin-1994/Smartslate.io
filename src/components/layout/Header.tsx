import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginModal from '@/components/modals/LoginModal';

type NavItem = {
  path: string;
  label: string;
  gradient?: boolean;
};

type DropdownItem = {
  path: string;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

type NavLinkType = NavItem | {
  type: 'dropdown';
  label: string;
  items: DropdownItem[];
};

interface HeaderProps {
  onContactClick: (formType?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

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
      label: 'Products',
      items: [
        { path: '/courses', label: 'Pre-Built Courses' },
        { path: '/solutions', label: 'Explore Solutions' },
        { path: '#', label: 'Solara', disabled: true, tooltip: 'Coming Soon' }
      ]
    },
    { path: '/smartslate-difference', label: 'The Smartslate Difference', gradient: true },
    { path: '/collaborate', label: 'Collaborate & Partner' }
  ];

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
      'inline-flex items-center px-3 py-2 text-sm font-medium transition-colors',
      isActive 
        ? 'text-white' 
        : gradient 
          ? 'gradient-text hover:opacity-90' 
          : 'text-gray-300 hover:text-white',
      'hover:no-underline'
    );
  };

  // Mobile navigation link classes
  const mobileNavLinkClasses = ({ isActive, gradient = false }: { isActive: boolean; gradient?: boolean }): string => {
    return cn(
      'block px-3 py-2 text-base font-medium',
      isActive 
        ? 'bg-gray-900 text-white' 
        : gradient 
          ? 'gradient-text' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    );
  };

  // Render navigation item based on type
  const renderNavItem = (item: NavLinkType) => {
    if ('type' in item && item.type === 'dropdown') {
      return (
        <div key={item.label} className="relative" ref={productsMenuRef}>
          <button
            type="button"
            className={cn(
              'products-menu-trigger inline-flex items-center px-3 py-2 text-sm font-medium',
              isProductsOpen ? 'text-white' : 'text-gray-300 hover:text-white'
            )}
            onClick={() => setIsProductsOpen(!isProductsOpen)}
            onMouseEnter={() => setIsProductsOpen(true)}
            aria-expanded={isProductsOpen}
            aria-haspopup="true"
          >
            {item.label}
            <svg
              className={`ml-1 h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

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
                    'block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700',
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
    
    // Regular navigation link - TypeScript type guard to ensure item has path property
    if ('path' in item) {
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => navLinkClasses({ isActive, gradient: item.gradient })}
        >
          {item.label}
        </NavLink>
      );
    }
    
    return null; // Fallback for invalid items
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
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ visibility: isMenuOpen || isAnimating ? 'visible' : 'hidden' }}
        aria-modal="true"
        role="dialog"
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
          className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-black/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full overflow-y-auto py-6 px-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((item) => {
              if ('type' in item && item.type === 'dropdown') {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsProductsOpen(!isProductsOpen);
                      }}
                      className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors duration-200"
                      aria-expanded={isProductsOpen}
                      aria-controls="mobile-products-menu"
                    >
                      {item.label}
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div 
                      id="mobile-products-menu"
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isProductsOpen ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="pl-4 space-y-1">
                        {item.items.map((dropdownItem) => (
                          <NavLink
                            key={dropdownItem.label}
                            to={dropdownItem.disabled ? '#' : dropdownItem.path}
                            className={({ isActive }) => cn(
                              'block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md',
                              dropdownItem.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                              isActive && 'bg-gray-800'
                            )}
                            onClick={() => {
                              if (!dropdownItem.disabled) {
                                setIsMenuOpen(false);
                                setIsProductsOpen(false);
                              }
                            }}
                            aria-disabled={dropdownItem.disabled}
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
              
              if ('path' in item) {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      'block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors duration-200',
                      isActive && 'bg-gray-800',
                      item.gradient && 'gradient-text'
                    )}
                    onClick={() => {
                      closeMenu();
                      // Small delay to ensure menu is closed before navigation
                      setTimeout(() => {
                        window.scrollTo(0, 0);
                      }, 100);
                    }}
                  >
                    {item.label}
                  </NavLink>
                );
              }
              
              return null;
            })}
            
            <div className="pt-4 pb-2 mt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  closeMenu();
                }}
                className="w-full text-center px-6 py-3 text-base font-semibold text-[#2d1b69] bg-[hsl(var(--brand-accent))] rounded-lg transition-all duration-300 hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-700/50 shadow-2xl">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="py-2">
              <img 
                src="/images/Final-Dark-BG.png"
                alt="smartslate.io logo"
                className="h-8 w-auto"
                width="160"
                height="32"
                loading="lazy"
                decoding="async"
              />
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                {navLinks.map((item) => renderNavItem(item))}
              </nav>
              
              {/* Login Button */}
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={cn(
                  'px-6 py-2.5 bg-[hsl(var(--brand-accent))] text-[#2d1b69] font-semibold rounded-lg transition-all duration-300 flex items-center space-x-2 hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-accent'
                )}
              >
                Login
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="hamburger-button inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-5 flex flex-col justify-between">
                  <span className={`block h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                  <span className={`block h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
                </div>
              </button>
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