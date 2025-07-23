import React, { Suspense, lazy, useState } from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loader } from './components/common/Loader';
import ContactModal from './components/modals/ContactModal';
import { AuthProvider } from './contexts/AuthContext';
import type { FormType } from './lib/formUtils';

// Lazy load pages
const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const Index = lazy(() => import('./pages/Index'));
const CoursesPage = lazy(() => import('./components/pages/CoursesPage'));
const AILiteracyIntro = lazy(() => import('./components/courses/AILiteracyIntro'));
const SolutionsPage = lazy(() => import('./components/pages/SolutionsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SmartslateDifference = lazy(() => import('./components/pages/SmartslateDifference'));
const CollaboratePage = lazy(() => import('./components/pages/CollaboratePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFormType, setModalFormType] = useState<FormType>('standard');

  const handleContactClick = (formType: FormType) => {
    setModalFormType(formType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Listen for global events (e.g., from landing page buttons)
  React.useEffect(() => {
    const listener = (event: Event) => {
      const custom = event as CustomEvent<FormType>;
      if (custom.detail) {
        handleContactClick(custom.detail);
      }
    };
    window.addEventListener('open-contact', listener as EventListener);
    return () => window.removeEventListener('open-contact', listener as EventListener);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/ai-literacy" element={<AILiteracyIntro />} />
                    <Route path="/solutions" element={<SolutionsPage onContactClick={handleContactClick} />} />
                    <Route path="/smartslate-difference" element={<SmartslateDifference />} />
                    <Route path="/collaborate" element={<CollaboratePage onContactClick={handleContactClick} />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          <ContactModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            formType={modalFormType} 
          />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
