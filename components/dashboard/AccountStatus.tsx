import React from 'react';
import { CheckCircle, EyeOff } from 'lucide-react';
import Button from '../Button';
import { Business } from '../../types';

interface AccountStatusProps {
  business: Business | undefined;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ business }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Status</h3>
      
      {business?.isVisible ? (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
            <CheckCircle className="w-5 h-5" /> Active & Visible
          </div>
          <p className="text-xs text-green-600">Your profile is currently visible to clients.</p>
        </div>
      ) : (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 font-bold mb-1">
            <EyeOff className="w-5 h-5" /> Hidden
          </div>
          <p className="text-xs text-gray-600">Your profile is hidden from the directory.</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">Membership Tier</span>
          <span className="text-sm font-bold text-voxa-gold">Premium Trial</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">Verification</span>
          <span className="text-sm font-bold text-green-600">Verified</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">Profile Completion</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">100%</span>
        </div>
      </div>

      <Button className="w-full mt-6" variant="outline">Manage Subscription</Button>
    </div>
  );
};

export default AccountStatus;