import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import ValuePropSection from '../components/landing/ValuePropSection';
import IndustriesSection from '../components/landing/IndustriesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import WaitlistSection from '../components/landing/WaitlistSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ValuePropSection />
      <IndustriesSection />
      <TestimonialsSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
};

export default LandingPage;