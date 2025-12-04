export interface NavItem {
  label: string;
  path: string;
}

export interface Industry {
  id: string;
  name: string;
  iconName: string; // Mapping to Lucide icons string name
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
}

export interface Statistic {
  label: string;
  value: string;
}