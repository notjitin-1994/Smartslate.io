import React from 'react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import logo from '@/assets/images/Final-Dark-BG.png';

interface FooterProps {
  onContactClick: (formType?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onContactClick }) => (
  <footer className="bg-brand-bg py-6 border-t border-gray-700/50">
    <div className="container mx-auto px-6 text-text-secondary flex flex-col items-center text-center">
      <a href="#landing" className="inline-block mb-4">
        <img
          src={logo}
          alt="smartslate.io logo"
          className="h-6 w-auto"
          width="160"
          height="32"
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="text-sm mb-4">
        <span>&copy; {new Date().getFullYear()} smartslate.io. All Rights Reserved.</span>
        <span className="mx-2 hidden sm:inline">|</span>
        <br className="sm:hidden" />
        <span>Revolutionizing the way the world learns.</span>
      </div>
      <div className="flex items-center space-x-6">
        <a href="https://www.instagram.com/smartslate.io/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-secondary hover:text-white transition-colors duration-300">
          <Instagram className="w-6 h-6" />
        </a>
        <a href="https://www.linkedin.com/company/smartslate-io/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-text-secondary hover:text-white transition-colors duration-300">
          <Linkedin className="w-6 h-6" />
        </a>
        <a href="mailto:jitin@smartslate.io" aria-label="Email us" className="text-text-secondary hover:text-white transition-colors duration-300">
          <Mail className="w-6 h-6" />
        </a>
      </div>
    </div>
  </footer>
);