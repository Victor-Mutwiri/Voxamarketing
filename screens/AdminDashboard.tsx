






import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  List, 
  Check, 
  Trash2, 
  Copy, 
  Terminal,
  LogOut,
  Building2,
  Search,
  AlertTriangle,
  Ban,
  ArrowLeft,
  BarChart3,
  Mail,
  Eye,
  Activity,
  CheckCircle,
  XCircle,
  MousePointerClick,
  Phone
} from 'lucide-react';
import Button from '../components/Button';
import MetricsFilter from '../components/dashboard/MetricsFilter';
import { storage } from '../utils/storage';
import { WaitlistEntry, Business, Inquiry, AnalyticsEvent } from '../types';

const ADMIN_PASSCODE = 'VOXA-ADMIN-2024';

type AdminView = 'overview' | 'waitlist' | 'businesses' | 'business_detail';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  
  // App State
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Data
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  
  // Detail View Data
  const [businessInquiries, setBusinessInquiries] = useState<Inquiry[]>([]); 
  const [businessAnalytics, setBusinessAnalytics] = useState<AnalyticsEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Date Filtering State for Detail View
  const [dateRange, setDateRange] = useState<{ start: Date, end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });

  // Load Admin Session
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('voxa_admin_auth') === 'true';
    if (isAdmin) {
      setIsAuthenticated(true);
      refreshData();
    }
  }, []);

  const refreshData = () => {
    setWaitlist(storage.getWaitlist());
    setBusinesses(storage.getBusinesses());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem('voxa_admin_auth', 'true');
      refreshData();
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

  // Waitlist Actions
  const handleApproveWaitlist = (id: string) => {
    const code = storage.approveWaitlistEntry(id);
    if (code) refreshData();
  };

  const handleDeleteWaitlist = (id: string) => {
    if (window.confirm('Are you sure you want to remove this entry?')) {
      storage.deleteWaitlistEntry(id);
      refreshData();
    }
  };

  // Business Actions
  const openBusinessDetail = (biz: Business) => {
    setSelectedBusiness(biz);
    // Fetch detailed data
    const inquiries = storage.getInquiriesByBusiness(biz.id);
    setBusinessInquiries(inquiries);
    const analytics = storage.getAnalyticsEvents(biz.id);
    setBusinessAnalytics(analytics);

    setCurrentView('business_detail');
  };

  const updateStatus = (status: 'active' | 'suspended' | 'banned') => {
    if (!selectedBusiness) return;
    if (status !== 'active' && !window.confirm(`Are you sure you want to mark this business as ${status.toUpperCase()}?`)) return;

    const updated = storage.updateBusinessStatus(selectedBusiness.id, status);
    if (updated) {
        setSelectedBusiness(updated); // Update local details
        refreshData(); // Refresh list
    }
  };

  const handleFilterChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  // Filter Logic for Detail View
  const filteredMetrics = useMemo(() => {
    const startMs = dateRange.start.getTime();
    const endMs = dateRange.end.getTime();

    // Filter Inquiries
    const filteredInquiries = businessInquiries.filter(i => {
        const time = new Date(i.date).getTime();
        return time >= startMs && time <= endMs;
    });

    // Filter Analytics
    const filteredAnalytics = businessAnalytics.filter(e => {
        const time = new Date(e.timestamp).getTime();
        return time >= startMs && time <= endMs;
    });

    return {
        inquiries: filteredInquiries.length,
        views: filteredAnalytics.filter(e => e.type === 'view').length,
        reveals: filteredAnalytics.filter(e => e.type === 'contact_reveal').length,
        clicks: filteredAnalytics.filter(e => e.type === 'website_click').length,
    };
  }, [dateRange, businessInquiries, businessAnalytics]);


  // --- Auth Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-700 rounded-full text-red-500 animate-pulse">
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

  // --- Main Admin Dashboard ---

  const pendingWaitlistCount = waitlist.filter(w => w.status === 'pending').length;
  const suspendedCount = businesses.filter(b => b.accountStatus === 'suspended').length;
  
  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NavItem = ({ view, icon: Icon, label }: { view: AdminView, icon: any, label: string }) => (
    <button 
        onClick={() => { setCurrentView(view); setSearchTerm(''); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${currentView === view || (view === 'businesses' && currentView === 'business_detail') ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col border-r border-slate-800">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="text-red-500 w-6 h-6" />
                    <span className="font-mono font-bold text-lg tracking-wider">VOXA_ADMIN</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">SYS_VER: 2.0.4</p>
            </div>

            <nav className="flex-grow px-4 py-4">
                <NavItem view="overview" icon={LayoutDashboard} label="Overview" />
                <NavItem view="waitlist" icon={List} label="Waitlist Requests" />
                <NavItem view="businesses" icon={Building2} label="Manage Businesses" />
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Secure Exit</span>
                </button>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50 flex flex-col">
            
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
                <h2 className="text-xl font-bold text-slate-800 capitalize">
                    {currentView === 'business_detail' ? 'Business Details' : currentView.replace('_', ' ')}
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        STATUS: SECURE
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                        A
                    </div>
                </div>
            </header>

            <div className="p-8 flex-grow">
                
                {/* OVERVIEW VIEW */}
                {currentView === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div 
                                onClick={() => setCurrentView('waitlist')}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">Total</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900">{waitlist.length}</h3>
                                <p className="text-sm text-slate-500">Total Requests</p>
                            </div>

                            <div 
                                onClick={() => setCurrentView('waitlist')}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                                        <Terminal className="w-6 h-6" />
                                    </div>
                                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">Action Req</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900">{pendingWaitlistCount}</h3>
                                <p className="text-sm text-slate-500">Pending Approvals</p>
                            </div>

                            <div 
                                onClick={() => setCurrentView('businesses')}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full">Live</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900">{businesses.filter(b => b.accountStatus !== 'banned').length}</h3>
                                <p className="text-sm text-slate-500">Active Businesses</p>
                            </div>

                            <div 
                                onClick={() => { setCurrentView('businesses'); setSearchTerm('suspended'); }}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                                        <Ban className="w-6 h-6" />
                                    </div>
                                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">Alert</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900">{suspendedCount}</h3>
                                <p className="text-sm text-slate-500">Suspended Accounts</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">System Healthy</h3>
                            <p className="text-slate-500">All systems operational. No security flags detected.</p>
                        </div>
                    </div>
                )}

                {/* WAITLIST VIEW */}
                {currentView === 'waitlist' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Code</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {waitlist.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No requests found.</td></tr>
                                    ) : (
                                        waitlist.slice().reverse().map((entry) => (
                                            <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(entry.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-medium text-slate-900">{entry.email}</td>
                                                <td className="px-6 py-4 text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{entry.entityType}</span></td>
                                                <td className="px-6 py-4">
                                                    {entry.status === 'pending' && <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-bold">Pending</span>}
                                                    {entry.status === 'approved' && <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold">Approved</span>}
                                                    {entry.status === 'used' && <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">Active</span>}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-700">
                                                    {entry.code ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-slate-100 px-2 py-1 rounded">{entry.code}</span>
                                                            <button onClick={() => { navigator.clipboard.writeText(entry.code!); alert('Code Copied'); }} className="text-slate-400 hover:text-slate-600"><Copy className="w-4 h-4" /></button>
                                                        </div>
                                                    ) : '--'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {entry.status === 'pending' && (
                                                            <Button size="sm" onClick={() => handleApproveWaitlist(entry.id)} className="h-8 text-xs bg-green-600 hover:bg-green-700">
                                                                <Check className="w-3 h-3 mr-1" /> Approve
                                                            </Button>
                                                        )}
                                                        <button onClick={() => handleDeleteWaitlist(entry.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
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

                {/* BUSINESSES LIST VIEW */}
                {currentView === 'businesses' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="relative w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search businesses..." 
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-slate-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="text-sm text-slate-500 font-medium">
                                Showing {filteredBusinesses.length} results
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Business Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                        {/* New Analytics Columns */}
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-center">Views</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-center">Reveals</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-center">Clicks</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredBusinesses.map((biz) => (
                                        <tr key={biz.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => openBusinessDetail(biz)}>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <img src={biz.image} alt="" className="w-8 h-8 rounded object-cover" />
                                                    <div>
                                                        <div className="font-semibold">{biz.name}</div>
                                                        <div className="text-xs text-slate-500">{biz.industry}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {biz.accountStatus === 'suspended' ? (
                                                     <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        <AlertTriangle className="w-3 h-3" /> Suspended
                                                     </span>
                                                ) : biz.accountStatus === 'banned' ? (
                                                     <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        <Ban className="w-3 h-3" /> Banned
                                                     </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        <CheckCircle className="w-3 h-3" /> Active
                                                    </span>
                                                )}
                                            </td>
                                            {/* Metric Cells (Total Lifetime) */}
                                            <td className="px-6 py-4 text-center text-slate-600">{biz.metrics?.views || 0}</td>
                                            <td className="px-6 py-4 text-center text-slate-600">{biz.metrics?.contactReveals || 0}</td>
                                            <td className="px-6 py-4 text-center text-slate-600">{biz.metrics?.websiteClicks || 0}</td>
                                            
                                            <td className="px-6 py-4 text-right">
                                                <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-900">Manage</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* BUSINESS DETAIL & ACTIONS VIEW */}
                {currentView === 'business_detail' && selectedBusiness && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <Button variant="ghost" className="text-slate-500 mb-4" onClick={() => setCurrentView('businesses')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                        </Button>

                        <div className="flex flex-col md:flex-row gap-8">
                            
                            {/* Left Panel: Overview & Actions */}
                            <div className="md:w-1/3 space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                                    <img src={selectedBusiness.image} alt={selectedBusiness.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-slate-50" />
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedBusiness.name}</h2>
                                    <p className="text-slate-500 text-sm mb-4">{selectedBusiness.industry}</p>
                                    
                                    <div className="flex justify-center gap-2 mb-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedBusiness.accountStatus === 'active' || !selectedBusiness.accountStatus ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {selectedBusiness.accountStatus || 'Active'}
                                        </span>
                                        {selectedBusiness.isVerified && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Verified</span>}
                                    </div>

                                    <div className="border-t border-slate-100 pt-6 text-left">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Moderation Actions</p>
                                        <div className="space-y-3">
                                            {selectedBusiness.accountStatus === 'active' || !selectedBusiness.accountStatus ? (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus('suspended')}
                                                        className="w-full flex items-center justify-center gap-2 p-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors font-medium text-sm border border-yellow-200"
                                                    >
                                                        <AlertTriangle className="w-4 h-4" /> Suspend Account
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus('banned')}
                                                        className="w-full flex items-center justify-center gap-2 p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200"
                                                    >
                                                        <Ban className="w-4 h-4" /> Ban Permanently
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => updateStatus('active')}
                                                    className="w-full flex items-center justify-center gap-2 p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm border border-green-200"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Reactivate Account
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-4">Contact Info</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            {selectedBusiness.email}
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            {selectedBusiness.location}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Metrics */}
                            <div className="md:w-2/3 space-y-6">
                                <div className="flex justify-end">
                                    <MetricsFilter 
                                        joinedAt={selectedBusiness.joinedAt}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>

                                {/* Performance Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                                            <Eye className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">Views</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{filteredMetrics.views}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-green-600">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">Reveals</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{filteredMetrics.reveals}</p>
                                    </div>
                                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-orange-600">
                                            <MousePointerClick className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">Clicks</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{filteredMetrics.clicks}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-purple-600">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">Inquiries</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{filteredMetrics.inquiries}</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                                        <h3 className="font-bold text-slate-800">Recent Inquiries (Filtered)</h3>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {businessInquiries.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400 text-sm">No inquiries recorded.</div>
                                        ) : (
                                            // Show top 5 recent inquiries matching the filter, or all if none
                                            businessInquiries.filter(i => {
                                                const time = new Date(i.date).getTime();
                                                return time >= dateRange.start.getTime() && time <= dateRange.end.getTime();
                                            }).length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 text-sm">No inquiries in selected period.</div>
                                            ) : (
                                                businessInquiries.filter(i => {
                                                    const time = new Date(i.date).getTime();
                                                    return time >= dateRange.start.getTime() && time <= dateRange.end.getTime();
                                                }).slice(0, 5).map(inq => (
                                                    <div key={inq.id} className="p-4 flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-slate-900 text-sm">{inq.visitorName}</p>
                                                            <p className="text-xs text-slate-500 truncate w-64">{inq.message}</p>
                                                        </div>
                                                        <span className="text-xs text-slate-400">{new Date(inq.date).toLocaleDateString()}</span>
                                                    </div>
                                                ))
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </main>
    </div>
  );
};

export default AdminDashboard;