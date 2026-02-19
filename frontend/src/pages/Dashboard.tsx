import React from 'react';
import { useClinicalRecordsContext } from '../context/ClinicalRecordContext';
import { useHealth } from '../context/HealthContext';
import { Users, Activity, CheckCircle2, AlertCircle, XCircle, PieChart, BarChart3, Wifi, WifiOff, Building2 } from 'lucide-react';
import Loader from '../components/Loader';
import ServerOfflineCard from '../components/ServerOfflineCard';

function Dashboard() {
  const { stats, loading, error, refresh } = useClinicalRecordsContext();
  const { isOnline, serverStatus } = useHealth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Loader
          message="Analyzing Clinical Metrics"
          subMessage="Fetching real-time data from secure registries..."
        />
      </div>
    );
  }

  if (error || !stats) {
    return <ServerOfflineCard status={serverStatus !== 'online' ? serverStatus : 'offline'} message={error ?? undefined} onRetry={refresh} />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-emerald-950 mb-2 tracking-tight">Clinical Insights</h1>
          <p className="text-emerald-900/50 font-medium">Real-time system health and patient metrics</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center px-4 py-2 glass rounded-2xl text-emerald-700 font-bold text-sm">
          <span className={`w-2 h-2 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full mr-2 animate-pulse`}></span>
          {isOnline ? 'Live Visualizer' : 'Offline Mode'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Patients"
          value={stats.total}
          icon={Users}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          label="Active Cases"
          value={stats.byStatus.active}
          icon={Activity}
          color="text-teal-600"
          bgColor="bg-teal-50"
          trend="+5.2%"
        />
        <StatCard
          label="Discharged"
          value={stats.byStatus.discharged}
          icon={CheckCircle2}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          label="Departments"
          value={Object.keys(stats.byDepartment).length}
          icon={Building2}
          color="text-teal-600"
          bgColor="bg-teal-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[32px]">
          <div className="flex items-center mb-8">
            <PieChart className="text-emerald-600 mr-3 w-6 h-6" />
            <h3 className="text-xl font-bold text-emerald-950">Department Distribution</h3>
          </div>
          <div className="space-y-6">
            {Object.entries(stats.byDepartment).map(([dept, count]) => (
              <div key={dept} className="group">
                <div className="flex justify-between mb-2">
                  <span className="text-emerald-900 font-bold tracking-tight">{dept}</span>
                  <span className="text-emerald-600 font-bold">{count}</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 group-hover:saturate-150"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[32px]">
          <div className="flex items-center mb-8">
            <BarChart3 className="text-teal-600 mr-3 w-6 h-6" />
            <h3 className="text-xl font-bold text-emerald-950">Clinical Status</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Active', value: stats.byStatus.active, color: 'bg-emerald-500', icon: Activity },
              { label: 'Discharged', value: stats.byStatus.discharged, color: 'bg-teal-500', icon: CheckCircle2 },
              { label: 'Pending', value: stats.byStatus.pending, color: 'bg-green-400', icon: AlertCircle },
              { label: 'Cancelled', value: stats.byStatus.cancelled, color: 'bg-rose-400', icon: XCircle },
            ].map((item) => (
              <div key={item.label} className="flex items-center p-5 glass-dark rounded-2xl hover:bg-emerald-50/50 transition-all duration-300">
                <div className={`w-12 h-12 ${item.color.replace('bg-', 'text-')} bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-emerald-900/50 text-xs font-extra-bold uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-2xl font-black text-emerald-900 leading-none">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, color, bgColor, trend }: any) => (
  <div className="glass p-8 rounded-[32px] group hover:translate-y-[-5px] transition-all duration-500">
    <div className={`${bgColor} ${color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-emerald-900/50 text-sm font-bold uppercase tracking-widest mb-2">{label}</h4>
        <div className="text-4xl font-extrabold text-emerald-950 tracking-tight">{value}</div>
      </div>
      {trend && (
        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold border border-emerald-100">
          {trend}
        </span>
      )}
    </div>
  </div>
);

export default Dashboard;
