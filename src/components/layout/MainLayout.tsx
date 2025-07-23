import React, { useState, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { Footer } from './Footer';
import { ScrollToTopButton } from './ScrollToTopButton';
import { ErrorBoundary } from '../common/ErrorBoundary';
const ContactModal = React.lazy(() => import('../modals/ContactModal'));

export type FormType = 'standard' | 'instructor' | 'introduction' | 'investor';

const MainLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFormType, setModalFormType] = useState<FormType>('standard');
  const location = useLocation();
  const navigate = useNavigate();




  const handleContact = (formType: FormType | string = 'standard') => {
    setModalFormType(formType as FormType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  return (
    <ErrorBoundary>
      <div className="text-text-primary overflow-x-hidden">
        <Header onContactClick={handleContact} />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer onContactClick={handleContact} />
        <ScrollToTopButton />
        
        {isModalOpen && (
          <Suspense fallback={null}>
            <ContactModal isOpen={isModalOpen} onClose={closeModal} formType={modalFormType} />
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
