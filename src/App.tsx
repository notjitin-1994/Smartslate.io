import React, { Suspense, lazy, useState } from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loader } from './components/common/Loader';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';

// Lazy load pages
const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const Index = lazy(() => import('./pages/Index'));
const CoursesPage = lazy(() => import('./components/pages/CoursesPage'));
const AILiteracyIntro = lazy(() => import('./components/courses/AILiteracyIntro'));
const SolutionsPage = lazy(() => import('./components/pages/SolutionsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SmartslateDifference = lazy(() => import('./components/pages/SmartslateDifference'));
const CollaboratePage = lazy(() => import('./components/pages/CollaboratePage'));
const UserSettings = lazy(() => import('./pages/UserSettings'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalProvider>
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
                      <Route path="/solutions" element={<SolutionsPage />} />
                      <Route path="/smartslate-difference" element={<SmartslateDifference />} />
                      <Route path="/collaborate" element={<CollaboratePage />} />
                      <Route path="/settings" element={<UserSettings />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </TooltipProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
