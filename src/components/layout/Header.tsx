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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BaseNavItem {
  label: string;
  gradient?: boolean;
}

interface RegularNavItem extends BaseNavItem {
  path: string;
}

interface DropdownItem {
  path: string;
  label: string;
  disabled?: boolean;
  tooltip?: string;
}

interface DropdownNavItem extends BaseNavItem {
  items: DropdownItem[];
  path?: string; // Optional path for the main dropdown link
}

type NavLinkType = RegularNavItem | DropdownNavItem;

interface HeaderProps {
  onContactClick: (formType?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  const { user, loading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLinkType[] = [
    {
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

  const closeMenu = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsProductsOpen(false);
    }, 300);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }
  };

  const navLinkClasses = ({ isActive, gradient = false }: { isActive: boolean; gradient?: boolean }): string => cn(
    'inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-indigo/50 rounded-lg',
    isActive ? 'text-white bg-white/10 backdrop-blur-sm' : gradient ? 'gradient-text hover:opacity-90' : 'text-gray-200 hover:text-white hover:bg-white/5',
    'hover:no-underline transition-all duration-200 hover:scale-[1.02] hover:shadow-sm'
  );

  const mobileNavLinkClasses = ({ isActive, gradient = false }: { isActive: boolean; gradient?: boolean }): string => cn(
    'block px-4 py-2.5 text-base font-medium transition-colors',
    isActive ? 'text-white bg-brand-indigo/30' : gradient ? 'gradient-text' : 'text-gray-200 hover:bg-brand-indigo/20 hover:text-white',
    'duration-200 rounded-lg mx-2'
  );

  const renderNavItem = (item: NavLinkType, isMobile = false) => {
    const linkProps = { 
      onClick: isMobile ? closeMenu : undefined 
    };

    if ('items' in item) { // This is a DropdownNavItem
      return (
        <div key={item.label} className="relative group">
          <NavLink to={item.path || '#'} className={({ isActive }) => navLinkClasses({ isActive })} {...linkProps}>
            {item.label}
          </NavLink>
          {/* Desktop dropdown content would go here, simplified for now */}
        </div>
      );
    } else { // This is a RegularNavItem
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => isMobile ? mobileNavLinkClasses({ isActive, gradient: item.gradient }) : navLinkClasses({ isActive, gradient: item.gradient })}
          {...linkProps}
        >
          {item.label}
        </NavLink>
      );
    }
  };

  const renderMobileMenu = () => (
    <div 
      ref={menuRef}
      className={cn(
        'fixed inset-0 bg-brand-indigo/80 backdrop-blur-lg z-40',
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        'transition-opacity duration-300'
      )}
      onClick={closeMenu}
    >
      <div 
        className={cn(
          'fixed inset-y-0 right-0 max-w-xs w-full bg-brand-indigo/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50',
          'transform transition-transform duration-300 ease-in-out',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col py-6 pb-8 overflow-y-auto space-y-4">
          <nav className="flex flex-col space-y-2 px-2">
            {navLinks.map(item => renderNavItem(item, true))}
          </nav>
          <div className="px-4 pt-4 mt-auto border-t border-white/10">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{user.displayName}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => { closeMenu(); navigate('/dashboard'); }} className="w-full justify-start text-gray-200">Dashboard</Button>
                <Button variant="ghost" onClick={() => setIsSignOutModalOpen(true)} className="w-full justify-start text-red-400 hover:text-red-400">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => { closeMenu(); setIsLoginModalOpen(true); }} className="w-full gradient-button">
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className={cn(
        'fixed w-full z-30 transition-all duration-300',
        isScrolled ? 'bg-brand-indigo/90 backdrop-blur-md shadow-lg' : 'bg-transparent',
        'border-b',
        isScrolled ? 'border-white/10' : 'border-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center group">
              <img src="/images/Final-Dark-BG.png" alt="Smartslate" className="h-8 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map(item => renderNavItem(item))}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                          <AvatarImage src={user.photoURL || undefined} />
                          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <p className="font-semibold">{user.displayName}</p>
                        <p className="text-xs text-gray-500 font-normal">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setIsSignOutModalOpen(true)} className="text-red-500 focus:text-red-500">
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    onClick={() => setIsLoginModalOpen(true)} 
                    className="relative overflow-hidden group px-6 py-2.5 rounded-lg bg-[#a8dadc] hover:bg-[#a8dadc]/90 text-indigo-600 font-medium border border-[#a8dadc] hover:border-[#a8dadc] transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center font-semibold">
                      <span>Sign In / Sign Up</span>
                      <svg 
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </Button>
                )}
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="hamburger-button inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="relative w-6 h-5">
                    <div className={cn('absolute h-0.5 w-full bg-white transition-all duration-300', isMenuOpen ? 'rotate-45 top-1/2' : 'top-0')} />
                    <div className={cn('absolute h-0.5 w-full bg-white transition-all duration-300', isMenuOpen ? 'opacity-0' : 'opacity-100 top-1/2')} />
                    <div className={cn('absolute h-0.5 w-full bg-white transition-all duration-300', isMenuOpen ? '-rotate-45 top-1/2' : 'top-full')} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {renderMobileMenu()}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <AlertDialog open={isSignOutModalOpen} onOpenChange={setIsSignOutModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the homepage and will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;
