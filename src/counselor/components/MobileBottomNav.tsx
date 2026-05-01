// src/counselor/components/MobileBottomNav.tsx

import { useNavigate } from 'react-router-dom';
import { Home, Users, Phone, Calendar, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'leads' | 'calls' | 'schedule' | 'profile';
}

export function MobileBottomNav({ activeTab }: MobileBottomNavProps) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/counselor/dashboard' },
    { id: 'leads', label: 'Leads', icon: Users, path: '/counselor/leads' },
    { id: 'calls', label: 'Calls', icon: Phone, path: '/counselor/calls' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/counselor/schedule' },
    { id: 'profile', label: 'Profile', icon: User, path: '/counselor/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${
                isActive ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-purple-100' : ''}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-purple-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}