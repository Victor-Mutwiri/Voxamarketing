import React from 'react';
import { MessageSquare } from 'lucide-react';
import Button from '../Button';
import { Inquiry } from '../../types';

interface RecentInquiriesProps {
  inquiries: Inquiry[];
  unreadInquiries: number;
  onViewAll: () => void;
}

const RecentInquiries: React.FC<RecentInquiriesProps> = ({ inquiries, unreadInquiries, onViewAll }) => {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Inquiries</h3>
            {unreadInquiries > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{unreadInquiries} New</span>
            )}
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-voxa-gold">View All</Button>
      </div>
      
      <div className="space-y-4">
        {inquiries.length > 0 ? (
            inquiries.slice(0, 3).map((inquiry) => (
            <div 
                key={inquiry.id} 
                className={`flex gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border ${!inquiry.isRead ? 'bg-slate-50 dark:bg-slate-700/50 border-voxa-gold/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
                onClick={onViewAll}
            >
                <div className="w-10 h-10 rounded-full bg-voxa-navy/10 flex items-center justify-center text-voxa-navy font-bold flex-shrink-0">
                {inquiry.visitorName.charAt(0)}
                </div>
                <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white">{inquiry.visitorName}</span>
                    <span className="text-xs text-slate-400">{new Date(inquiry.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">{inquiry.message}</p>
                </div>
                {!inquiry.isRead && (
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                )}
            </div>
            ))
        ) : (
            <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>No inquiries yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RecentInquiries;