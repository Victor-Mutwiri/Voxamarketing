import React from 'react';
import { CheckCircle, EyeOff, AlertTriangle, Ban } from 'lucide-react';
import Button from '../Button';
import { Business } from '../../types';

interface AccountStatusProps {
  business: Business | undefined;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ business }) => {
  const isSuspended = business?.accountStatus === 'suspended';
  const isBanned = business?.accountStatus === 'banned';
  const isActive = !isSuspended && !isBanned;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Status</h3>
      
      {isActive ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-1">
            <CheckCircle className="w-5 h-5" /> Active & Visible
          </div>
          <p className="text-xs text-green-600 dark:text-green-500">Your profile is currently visible to clients.</p>
        </div>
      ) : isSuspended ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 font-bold mb-1">
            <AlertTriangle className="w-5 h-5" /> Suspended
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-500">Reason: {business.statusReason}</p>
        </div>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-1">
            <Ban className="w-5 h-5" /> Banned
          </div>
          <p className="text-xs text-red-600 dark:text-red-500">Permanent violation of terms.</p>
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