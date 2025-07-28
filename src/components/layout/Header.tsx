import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginModal from '@/components/modals/LoginModal';
import logo from '@/assets/images/Final-Dark-BG.png';
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

// Type definitions for navigation items
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
  path?: string; // Optional: for a main dropdown link
}

type NavLinkType = RegularNavItem | DropdownNavItem;

const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Navigation links data
  const navLinks: NavLinkType[] = React.useMemo(() => {
    const baseLinks: NavLinkType[] = [
      {
        label: 'Solutions',
        path: '/solutions',
        items: [
          { path: '/solutions/ignite-series', label: 'Ignite Series' },
          { path: '/solutions/smart-skills-architecture', label: 'Smart Skills Architecture' },
          { path: '/solutions/solara', label: 'Solara' },
        ],
      },
      { path: '/smartslate-difference', label: 'Why Smartslate', gradient: true },
      { path: '/collaborate', label: 'Partner With Us' },
    ];

    if (user?.email === 'jitin@smartslate.io') {
      return [...baseLinks, { path: '/admin', label: 'Admin Dashboard' }];
    }

    return baseLinks;
  }, [user]);

  // Utility functions
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Effects for scroll and click outside
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Menu open/close logic
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    setIsSolutionsOpen(false);
  };

  // --- Component Rendering ---

  const renderNavItem = (item: NavLinkType, isMobile = false) => {
    const baseClasses = 'transition-colors duration-200';
    const desktopClasses = 'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-brand-indigo/50';
    const mobileClasses = 'block w-full text-left px-4 py-2.5 text-base font-medium rounded-md';

    const navLinkClasses = ({ isActive, gradient = false }: { isActive: boolean; gradient?: boolean }): string => cn(
      baseClasses,
      isMobile ? mobileClasses : desktopClasses,
      isActive
        ? 'text-white bg-white/10'
        : gradient
        ? 'gradient-text hover:opacity-90'
        : 'text-gray-300 hover:bg-white/5 hover:text-white'
    );

    if ('items' in item) { // Dropdown menu
      const dropdownItem = item as DropdownNavItem;
      const isSolutionsActive = location.pathname.startsWith('/solutions');

      const triggerClasses = navLinkClasses({
        isActive: isSolutionsActive,
        gradient: dropdownItem.gradient,
      });

      const triggerContent = (
        <>
          {item.label}
          <svg className="ml-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </>
      );

      if (isMobile) {
        return (
          <div>
            <button
              onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
              className={cn(triggerClasses, 'w-full flex justify-between items-center')}
            >
              {item.label}
              <svg
                className={cn('ml-1 h-5 w-5 transition-transform', { 'rotate-180': isSolutionsOpen })}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isSolutionsOpen && (
              <div className="pl-4 mt-2 space-y-2">
                {dropdownItem.items.map(subItem => (
                  <NavLink
                    key={subItem.path}
                    to={subItem.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      cn(
                        'block w-full text-left px-4 py-2.5 text-base font-medium rounded-md',
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      )
                    }
                  >
                    {subItem.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={triggerClasses}>
              {triggerContent}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-white/10 backdrop-blur-xl border-white/20 text-white z-[999999]">
            {dropdownItem.items.map(subItem => (
              <DropdownMenuItem key={subItem.path} asChild>
                <NavLink
                  to={subItem.path}
                  className={({ isActive }) => cn(
                    'block w-full text-left px-2 py-2 rounded-md text-sm transition-colors',
                    isActive ? 'bg-indigo-500/50 text-white' : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {subItem.label}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Regular nav link
    return (
      <NavLink key={item.path} to={item.path} onClick={isMobile ? closeMenu : undefined} className={({ isActive }) => navLinkClasses({ isActive, gradient: item.gradient })}>
        {item.label}
      </NavLink>
    );
  };

  const renderMobileMenu = () => (
    <div
      className={cn(
        'fixed inset-0 z-[60] bg-black/50 backdrop-blur-lg transition-opacity duration-500 md:hidden',
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div
        ref={menuRef}
        className={cn(
          'absolute top-0 right-0 bottom-0 w-full max-w-xs bg-brand-indigo/95 shadow-2xl transition-transform duration-500 ease-in-out flex flex-col border-l border-white/10',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex justify-between items-center p-5 border-b border-white/10 h-20">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={closeMenu}
            className="p-2 -mr-2"
          >
            <span className="sr-only">Close menu</span>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-5 space-y-2 overflow-y-auto flex-grow">
          <nav className="flex flex-col space-y-2">
            {navLinks.map(item => <div key={item.label}>{renderNavItem(item, true)}</div>)}
          </nav>
        </div>
        <div className="p-5 mt-auto border-t border-white/10">
          {loading ? (
            <div className="h-12 w-full bg-gray-700 rounded-md animate-pulse" />
          ) : user ? (
            <div className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white truncate">{user.displayName}</p>
                  <p className="text-sm text-gray-300 truncate">{user.email}</p>
                </div>
              </div>
              <Button onClick={() => { closeMenu(); navigate('/profile'); }} variant="outline" className="w-full bg-transparent text-white border-white/50 hover:bg-white/10">
                My Profile
              </Button>
              <Link to="/settings" className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md" onClick={closeMenu}>Settings</Link>
              {user.email === 'jitin@smartslate.io' && (
                <Link to="/admin" className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md" onClick={closeMenu}>Admin Dashboard</Link>
              )}
              <Button onClick={() => { closeMenu(); setIsSignOutModalOpen(true); }} variant="destructive" className="w-full bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30">
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => { closeMenu(); setIsLoginModalOpen(true); }}
              className="w-full bg-[#a8dadc] text-indigo-600 font-semibold hover:bg-[#a8dadc]/90"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderDesktopAuth = () => {
    if (loading) {
      return <div className="h-10 w-28 bg-gray-700 rounded-md animate-pulse" />;
    }
    return user ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="bg-primary">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="font-semibold truncate">{user.displayName}</p>
            <p className="text-xs text-gray-500 font-normal truncate">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>My Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsSignOutModalOpen(true)} className="text-red-500 focus:text-red-500">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Button onClick={() => setIsLoginModalOpen(true)} className="bg-[#a8dadc] hover:bg-[#a8dadc]/90 text-indigo-600 font-semibold">
        Sign In
      </Button>
    );
  };

  return (
    <>
      <header id="main-header" className="fixed top-0 left-0 w-full z-50 h-32 pointer-events-none">
        <div
          className={cn(
            'absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl transition-all duration-500 ease-in-out',
            isScrolled ? 'top-2' : 'top-0'
          )}
        >
          <div
            className={cn(
              'mx-auto transition-all duration-500 ease-in-out pointer-events-auto',
              'bg-transparent',
              isScrolled
                ? 'w-[92%] backdrop-blur-lg shadow-2xl shadow-primary/20 rounded-2xl'
                : 'w-full rounded-none'
            )}
          >
            <div className="w-full mx-auto px-4 sm:px-6">
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between h-16">
                <Link to="/" className="flex-shrink-0">
                  <img className="h-7 w-auto" src={logo} alt="Smartslate" />
                </Link>
                <nav className="flex items-center space-x-1">
                  {navLinks.map(item => <div key={item.label}>{renderNavItem(item)}</div>)}
                </nav>
                <div className="flex items-center space-x-4">
                  {renderDesktopAuth()}
                </div>
              </div>

              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between h-16">
                <Link to="/" className="flex-shrink-0">
                  <img className="h-7 w-auto" src={logo} alt="Smartslate" />
                </Link>
                <button
                  onClick={toggleMenu}
                  className={cn(
                    'z-50 p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary',
                    'bg-transparent'
                  )}
                  aria-expanded={isMenuOpen}
                  style={{ width: '44px', height: '44px' }}
                >
                  <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                  <div className="w-6 h-6 relative">
                    <div className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out',
                      isMenuOpen ? 'rotate-45' : '-translate-y-2'
                    )}></div>
                    <div className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-white rounded-full transition-opacity duration-300',
                      isMenuOpen ? 'opacity-0' : 'opacity-100'
                    )}></div>
                    <div className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out',
                      isMenuOpen ? '-rotate-45' : 'translate-y-2'
                    )}></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {renderMobileMenu()}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

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
