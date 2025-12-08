
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  ShieldCheck, 
  Users, 
  List, 
  Check, 
  Trash2, 
  Copy, 
  Terminal,
  LogOut,
  Building2,
  RefreshCw
} from 'lucide-react';
import Button from '../components/Button';
import { storage } from '../utils/storage';
import { WaitlistEntry, Business } from '../types';

const ADMIN_PASSCODE = 'VOXA-ADMIN-2024';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  
  // Data
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeTab, setActiveTab] = useState<'waitlist' | 'businesses'>('waitlist');

  // Load Admin Session
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('voxa_admin_auth') === 'true';
    if (isAdmin) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    setWaitlist(storage.getWaitlist());
    setBusinesses(storage.getBusinesses());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem('voxa_admin_auth', 'true');
      loadData();
    } else {
      setError('Access Denied: Invalid Passcode');
      setPasscode('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('voxa_admin_auth');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleApprove = (id: string) => {
    const code = storage.approveWaitlistEntry(id);
    if (code) {
      // Refresh list
      setWaitlist(storage.getWaitlist());
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this entry?')) {
      storage.deleteWaitlistEntry(id);
      setWaitlist(storage.getWaitlist());
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-700 rounded-full text-red-500">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-mono text-center text-white mb-2">Restricted Area</h1>
          <p className="text-slate-400 text-center text-sm mb-8 font-mono">
            Authorization Level 5 Required.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 font-mono text-center tracking-widest"
                placeholder="ENTER PASSCODE"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center font-mono">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors font-mono"
            >
              AUTHENTICATE
            </button>
          </form>
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/')} className="text-slate-500 text-xs hover:text-white font-mono">
              ABORT SEQUENCE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard View
  const pendingCount = waitlist.filter(w => w.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-500 w-6 h-6" />
            <span className="font-mono font-bold tracking-wider">VOXA<span className="text-slate-500">_ADMIN</span></span>
        </div>
        <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-xs font-mono text-slate-400">
                <span>STATUS: ONLINE</span>
                <span>SECURE_CONNECTION: TRUE</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" /> Exit
            </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total Requests</p>
                    <h3 className="text-3xl font-bold text-slate-800">{waitlist.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <List className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Pending Action</p>
                    <h3 className="text-3xl font-bold text-orange-600">{pendingCount}</h3>
                </div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                    <Terminal className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Live Businesses</p>
                    <h3 className="text-3xl font-bold text-green-600">{businesses.length}</h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <Building2 className="w-6 h-6" />
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-6">
            <button 
                onClick={() => setActiveTab('waitlist')}
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'waitlist' ? 'border-voxa-navy text-voxa-navy' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
                Waitlist Management
            </button>
            <button 
                 onClick={() => setActiveTab('businesses')}
                 className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'businesses' ? 'border-voxa-navy text-voxa-navy' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
                Registered Businesses
            </button>
        </div>

        {/* Waitlist Table */}
        {activeTab === 'waitlist' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Access Code</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {waitlist.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No requests found.</td>
                                </tr>
                            ) : (
                                waitlist.slice().reverse().map((entry) => (
                                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {new Date(entry.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {entry.email}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs">{entry.entityType}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {entry.status === 'pending' && <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-bold">Pending</span>}
                                            {entry.status === 'approved' && <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold">Approved</span>}
                                            {entry.status === 'used' && <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">Active</span>}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-700">
                                            {entry.code ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-slate-100 px-2 py-1 rounded">{entry.code}</span>
                                                    <button onClick={() => copyToClipboard(entry.code!)} className="text-slate-400 hover:text-slate-600">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">--</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {entry.status === 'pending' && (
                                                    <Button size="sm" onClick={() => handleApprove(entry.id)} className="h-8 text-xs bg-green-600 hover:bg-green-700">
                                                        <Check className="w-3 h-3 mr-1" /> Approve
                                                    </Button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(entry.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Businesses List */}
        {activeTab === 'businesses' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Industry</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Location</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Contact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {businesses.map((biz) => (
                            <tr key={biz.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-slate-500">#{biz.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                    <img src={biz.image} alt="" className="w-8 h-8 rounded object-cover" />
                                    {biz.name}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{biz.industry}</td>
                                <td className="px-6 py-4 text-slate-600">{biz.location}</td>
                                <td className="px-6 py-4 text-slate-600 text-xs">
                                    <div>{biz.email}</div>
                                    <div>{biz.phone}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
