import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  ShoppingCart, 
  Activity, 
  Search, 
  CheckCircle2, 
  Truck,
  Zap,
  User as UserIcon,
  History,
  TrendingUp,
  XCircle,
  MapPin,
  BarChart3,
  Flame,
  Lock,
  UserCog,
  AlertTriangle,
  Trash2,
  DollarSign,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GlobalOrder, UserProfile, AdminRole, AuditLog } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { logAdminAction } from '../services/auditService';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

type AdminTab = 'orders' | 'users' | 'system';

export default function AdminDashboard() {
  const { user, userProfile, loading, isBypassAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<GlobalOrder[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // RBAC Helpers
  const isManager = useMemo(() => userProfile?.role === 'Manager' || isBypassAdmin, [userProfile, isBypassAdmin]);
  const isStaff = useMemo(() => userProfile?.role === 'Staff' || isManager, [userProfile, isManager]);

  // System Metrics Simulation
  const systemMetrics = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeUsers: Math.floor(Math.random() * 50) + 10,
        latency: Math.floor(Math.random() * 100) + 20,
        errors: Math.floor(Math.random() * 5),
      });
    }
    return data;
  }, []);

  // Wait Rule: Guard protected page
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFC72C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Security: Only admins can enter
  if (!((user && userProfile?.isAdmin) || isBypassAdmin)) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    // Fetch Orders Real-time
    const ordersQuery = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlobalOrder));
      setOrders(ordersData);
      setIsLoadingData(false);
    }, (error) => {
      console.error("Orders listener failed:", error);
      // We don't throw here to avoid crashing the whole dashboard if one listener fails
    });

    // Fetch Users Real-time
    const usersQuery = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
      setUsers(usersData);
    }, (error) => {
      console.error("Users listener failed:", error);
    });

    // Fetch Audit Logs
    const auditQuery = query(collection(db, 'admin_audit_log'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribeAudit = onSnapshot(auditQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
      setAuditLogs(logs);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeAudit();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: GlobalOrder['status']) => {
    if (!isStaff) {
      toast.error("INSUFFICIENT CLEARANCE LEVEL");
      return;
    }

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      await logAdminAction(
        user?.uid || 'bypass',
        user?.email || 'admin@sector7.hub',
        'UPDATE_ORDER_STATUS',
        orderId,
        `Status updated to ${newStatus}`
      );

      toast.success(`ORDER ${orderId} UPDATED TO ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("FAILED TO UPDATE ORDER STATUS");
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!isManager) {
      toast.error("MANAGER CLEARANCE REQUIRED");
      return;
    }

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'Cancelled' });
      
      await logAdminAction(
        user?.uid || 'bypass',
        user?.email || 'admin@sector7.hub',
        'CANCEL_ORDER',
        orderId,
        'Order marked as Cancelled'
      );

      toast.success(`ORDER ${orderId} CANCELLED`);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("FAILED TO CANCEL ORDER");
    }
  };

  const updateUserRole = async (userId: string, newRole: AdminRole) => {
    if (!isManager) {
      toast.error("MANAGER CLEARANCE REQUIRED");
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        role: newRole,
        isAdmin: newRole !== 'Citizen'
      });

      await logAdminAction(
        user?.uid || 'bypass',
        user?.email || 'admin@sector7.hub',
        'MODIFY_USER_DATA',
        userId,
        `Role updated to ${newRole}`
      );

      toast.success(`USER ${userId} ROLE UPDATED TO ${newRole}`);
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("FAILED TO UPDATE USER ROLE");
    }
  };

  // Sales Analytics
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || o.total || 0), 0);
    const totalOrders = orders.length;
    
    const itemCounts: Record<string, number> = {};
    orders.forEach(order => {
      const items = order.items || [];
      items.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
    });

    const mostSoldItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { totalRevenue, totalOrders, mostSoldItems };
  }, [orders]);

  const filteredOrders = orders.filter(order => 
    (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#FFC72C] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,199,44,0.3)]">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter italic">ADMIN</h1>
            <p className="text-[8px] font-mono text-white/40 tracking-widest uppercase">CORE ACCESS</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'orders', label: 'ORDERS MONITOR', icon: ShoppingCart },
            { id: 'users', label: 'USER DATABASE', icon: Users },
            { id: 'system', label: 'SYSTEM LOGS', icon: Activity },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === item.id 
                  ? "bg-[#FFC72C] text-black shadow-[0_0_15px_rgba(255,199,44,0.2)]" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="p-4 glass rounded-2xl space-y-2">
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">SERVER STATUS</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] font-black neon-gold">OPTIMAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="p-8 border-b border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
              {activeTab === 'orders' && 'ORDERS MONITOR'}
              {activeTab === 'users' && 'USER DATABASE'}
              {activeTab === 'system' && 'SYSTEM LOGS'}
            </h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              {activeTab === 'orders' && `${orders.length} ACTIVE TRANSMISSIONS`}
              {activeTab === 'users' && `${users.length} REGISTERED NEURAL LINKS`}
              {activeTab === 'system' && 'CORE SYSTEM DIAGNOSTICS'}
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="SEARCH DATASET..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass bg-white/5 border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-[#FFC72C]/50 transition-all w-64"
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Analytics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="glass p-6 rounded-3xl border-l-4 border-l-[#FFC72C]">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-[#FFC72C]" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">TOTAL REVENUE</p>
                    </div>
                    <p className="text-3xl font-black italic tracking-tighter">Rs. {analytics.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border-l-4 border-l-blue-400">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="w-4 h-4 text-blue-400" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">TOTAL ORDERS</p>
                    </div>
                    <p className="text-3xl font-black italic tracking-tighter">{analytics.totalOrders}</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border-l-4 border-l-yellow-400">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">PENDING</p>
                    </div>
                    <p className="text-3xl font-black italic tracking-tighter">{orders.filter(o => o.status === 'Pending').length}</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border-l-4 border-l-green-500">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">DELIVERED</p>
                    </div>
                    <p className="text-3xl font-black italic tracking-tighter">{orders.filter(o => o.status === 'Delivered').length}</p>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="glass rounded-3xl overflow-hidden border border-white/10">
                  {orders.length === 0 && !isLoadingData ? (
                    <div className="p-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                        <Zap className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-white/20 font-mono text-xs uppercase tracking-widest italic tracking-[0.2em]">No orders yet. System Optimal.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">ORDER ID</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">CUSTOMER</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">ITEMS</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">LOCATION</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">TOTAL</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">STATUS</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6">
                              <span className="font-mono text-xs neon-gold">{order.id}</span>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                  <UserIcon className="w-4 h-4 text-white/40" />
                                </div>
                                <span className="text-sm font-black italic">{order.customerName}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className="text-xs text-white/60">{order.items.join(', ')}</span>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-white/30" />
                                <span className="text-xs text-white/40 italic">{order.location || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className="text-sm font-black">Rs. {(order.totalPrice || order.total || 0).toLocaleString()}</span>
                            </td>
                            <td className="p-6">
                              <span className={cn(
                                "text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border",
                                order.status === 'Pending' ? "text-[#FFC72C] border-[#FFC72C]/30" :
                                order.status === 'Out for Delivery' ? "text-blue-400 border-blue-400/30" :
                                order.status === 'Cancelled' ? "text-red-500 border-red-500/30" :
                                "text-green-500 border-green-500/30"
                              )}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {order.status === 'Pending' && isStaff && (
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, 'Processing')}
                                    className="p-2 glass rounded-lg hover:border-blue-400/50 text-blue-400 transition-all"
                                    title="Start Processing"
                                  >
                                    <Zap className="w-4 h-4" />
                                  </button>
                                )}
                                {order.status === 'Processing' && isStaff && (
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                                    className="p-2 glass rounded-lg hover:border-blue-400/50 text-blue-400 transition-all"
                                    title="Mark as Out for Delivery"
                                  >
                                    <Truck className="w-4 h-4" />
                                  </button>
                                )}
                                {['Pending', 'Processing', 'Out for Delivery'].includes(order.status) && isStaff && (
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                    className="p-2 glass rounded-lg hover:border-green-500/50 text-green-500 transition-all"
                                    title="Mark as Delivered"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                )}
                                {order.status !== 'Cancelled' && isManager && (
                                  <button 
                                    onClick={() => cancelOrder(order.id)}
                                    className="p-2 glass rounded-lg hover:border-red-500/50 text-red-500 transition-all"
                                    title="Cancel Order"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {isManager && (
                                  <button 
                                    onClick={async () => {
                                      if (window.confirm('DELETE ORDER PERMANENTLY?')) {
                                        try {
                                          await deleteDoc(doc(db, 'orders', order.id));
                                          toast.success('ORDER DELETED');
                                        } catch (e) {
                                          toast.error('DELETE FAILED');
                                        }
                                      }
                                    }}
                                    className="p-2 glass rounded-lg hover:border-red-500/50 text-red-500 transition-all"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                {!isStaff && (
                                  <Lock className="w-4 h-4 text-white/10" />
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && ((user && userProfile?.isAdmin) || isBypassAdmin) && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredUsers.map((u) => (
                  <div key={u.uid} className="glass p-8 rounded-3xl border border-white/10 hover:border-[#FFC72C]/30 transition-all group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden glass border-2 border-white/10">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <UserIcon className="w-8 h-8 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-black italic tracking-tighter group-hover:neon-gold transition-colors">{u.displayName}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{u.email}</p>
                          <span className={cn(
                            "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                            u.role === 'Manager' ? "text-[#FFC72C] border-[#FFC72C]/30" :
                            u.role === 'Staff' ? "text-blue-400 border-blue-400/30" :
                            "text-white/20 border-white/10"
                          )}>
                            {u.role || 'Citizen'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {isManager && u.uid !== user?.uid && (
                        <div className="p-4 glass rounded-2xl bg-white/5 space-y-2">
                          <p className="text-[8px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <UserCog className="w-3 h-3" /> ASSIGN ROLE
                          </p>
                          <div className="flex gap-2">
                            {(['Citizen', 'Staff', 'Manager'] as AdminRole[]).map((role) => (
                              <button
                                key={role}
                                onClick={() => updateUserRole(u.uid, role)}
                                className={cn(
                                  "flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border",
                                  u.role === role 
                                    ? "bg-white/10 border-white/20 text-white" 
                                    : "border-transparent text-white/20 hover:text-white/60"
                                )}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between p-4 glass rounded-2xl bg-white/5">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#FFC72C]" />
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">TOTAL SAVINGS</span>
                        </div>
                        <span className="text-sm font-black italic">${(u.savings || 0).toFixed(2)}</span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">DIETARY PROTOCOLS</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(u.dietaryFlags || {}).map(([key, value]) => (
                            <span 
                              key={key}
                              className={cn(
                                "text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest border",
                                value ? "text-[#DA291C] border-[#DA291C]/30 bg-[#DA291C]/5" : "text-white/10 border-white/5"
                              )}
                            >
                              {key}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <History className="w-4 h-4 text-white/20" />
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{u.orderHistory?.length || 0} ORDERS</span>
                        </div>
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">JOINED: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Real-time Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Activity className="w-6 h-6 neon-gold" /> NEURAL TRAFFIC
                      </h3>
                      <span className="text-[10px] font-mono text-white/40">LIVE UPDATES</span>
                    </div>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={systemMetrics}>
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFC72C" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#FFC72C" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="time" hide />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#FFC72C', fontSize: '10px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="activeUsers" stroke="#FFC72C" fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">PEAK LOAD</p>
                        <p className="text-lg font-black italic tracking-tighter">48 LINKS</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">AVG LATENCY</p>
                        <p className="text-lg font-black italic tracking-tighter text-green-500">24ms</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">UPTIME</p>
                        <p className="text-lg font-black italic tracking-tighter neon-gold">99.9%</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-[#DA291C]" /> ERROR FREQUENCY
                      </h3>
                      <span className="text-[10px] font-mono text-white/40">LAST 20 MIN</span>
                    </div>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={systemMetrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="time" hide />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#DA291C', fontSize: '10px', fontWeight: 'bold' }}
                          />
                          <Line type="stepAfter" dataKey="errors" stroke="#DA291C" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">TOTAL ERRORS</p>
                        <p className="text-lg font-black italic tracking-tighter text-[#DA291C]">12</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">RESOLVED</p>
                        <p className="text-lg font-black italic tracking-tighter text-green-500">100%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">THREAT LEVEL</p>
                        <p className="text-lg font-black italic tracking-tighter text-green-500">LOW</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                      <Zap className="w-6 h-6 neon-gold" /> CORE METRICS
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'CPU LOAD', value: '12%', color: 'green' },
                        { label: 'NEURAL LATENCY', value: '4ms', color: 'green' },
                        { label: 'MEMORY USAGE', value: '2.4GB', color: 'gold' },
                        { label: 'ACTIVE LINKS', value: users.length.toString(), color: 'gold' },
                      ].map((m, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-white/40">{m.label}</span>
                            <span className={m.color === 'green' ? 'text-green-500' : 'neon-gold'}>{m.value}</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: m.value.includes('%') ? m.value : '60%' }}
                              className={cn(
                                "h-full rounded-full",
                                m.color === 'green' ? 'bg-green-500' : 'bg-[#FFC72C]'
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                      <History className="w-6 h-6 neon-red" /> ADMINISTRATIVE AUDIT LOG
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {auditLogs.length === 0 ? (
                        <p className="text-center text-white/20 font-mono text-[10px] py-8">NO AUDIT RECORDS FOUND</p>
                      ) : (
                        auditLogs.map((log) => (
                          <div key={log.id} className="flex flex-col p-4 glass rounded-2xl bg-white/5 border-l-2 border-l-[#DA291C] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                                log.actionType === 'CANCEL_ORDER' ? "text-red-500 border-red-500/30" :
                                log.actionType === 'UPDATE_ORDER_STATUS' ? "text-blue-400 border-blue-400/30" :
                                "text-green-500 border-green-500/30"
                              )}>
                                {log.actionType}
                              </span>
                              <span className="text-[8px] font-mono text-white/40">
                                {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'RECENT'}
                              </span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest">{log.details}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                              <span className="text-[8px] font-mono text-white/40 tracking-tighter">ADMIN: {log.adminEmail}</span>
                              <span className="text-[8px] font-mono text-white/40 tracking-tighter">TARGET: {log.targetId}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
