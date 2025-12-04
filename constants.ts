import { NavItem, Industry, Statistic, Testimonial } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/explore' },
  { label: 'For Businesses', path: '/business/onboarding' },
];

export const INDUSTRIES: Industry[] = [
  {
    id: 'legal',
    name: 'Legal Services',
    iconName: 'Scale',
    description: 'Top-tier advocates, arbitrators, and legal consultancies.',
  },
  {
    id: 'medical',
    name: 'Medicine & Health',
    iconName: 'Stethoscope',
    description: 'Specialists, premium clinics, and healthcare consultants.',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    iconName: 'HardHat',
    description: 'Civil, structural, and electrical engineering firms.',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    iconName: 'Factory',
    description: 'ISO-certified manufacturers and industrial suppliers.',
  },
  {
    id: 'architecture',
    name: 'Architecture',
    iconName: 'Compass',
    description: 'Award-winning architects and design studios.',
  },
  {
    id: 'finance',
    name: 'Finance & Audit',
    iconName: 'Briefcase',
    description: 'Certified accountants, auditors, and investment advisors.',
  }
];

export const INDUSTRY_SPECIALTIES: Record<string, string[]> = {
  'Legal Services': ['Corporate Law', 'Family Law', 'Criminal Defense', 'Intellectual Property', 'Real Estate', 'Commercial Litigation', 'Arbitration'],
  'Medicine & Health': ['Cardiology', 'Pediatrics', 'Dentistry', 'Orthopedics', 'Dermatology', 'Psychiatry', 'General Surgery'],
  'Engineering': ['Civil Engineering', 'Structural Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Geotechnical', 'Water Resources'],
  'Manufacturing': ['Textiles & Apparel', 'Food Processing', 'Plastics & Polymers', 'Metal Fabrication', 'Chemical Manufacturing', 'Electronics Assembly'],
  'Architecture': ['Residential Design', 'Commercial Architecture', 'Landscape Architecture', 'Interior Design', 'Urban Planning', 'Sustainable Design'],
  'Finance & Audit': ['Tax Consultancy', 'Forensic Audit', 'Investment Advisory', 'Risk Management', 'Bookkeeping', 'Corporate Finance']
};

export const STATISTICS: Statistic[] = [
  { label: 'Verified Experts', value: '500+' },
  { label: 'Industries', value: '25+' },
  { label: 'Client Satisfaction', value: '98%' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Wanjiku Kamau',
    role: 'CEO',
    company: 'Nairobi Ventures',
    content: 'Voxa Marketing connected us with a manufacturing partner that transformed our supply chain. The quality of professionals here is unmatched.',
    avatarUrl: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: '2',
    name: 'David Omondi',
    role: 'Managing Partner',
    company: 'Omondi & Associates',
    content: 'Being listed on Voxa has elevated our brand prestige. We receive inquiries from exactly the type of high-value clients we want to serve.',
    avatarUrl: 'https://picsum.photos/100/100?random=2'
  }
];