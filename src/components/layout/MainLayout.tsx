import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Footer } from './Footer';
import { ScrollToTopButton } from './ScrollToTopButton';
import { ErrorBoundary } from '../common/ErrorBoundary';

const MainLayout: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="text-text-primary overflow-x-hidden">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </ErrorBoundary>
  );
};
export default MainLayout;
