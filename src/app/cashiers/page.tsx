'use client';

import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import CashiersSection from '@/components/sections/CashiersSection';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CashiersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Read initial state from localStorage, default to expanded (false)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const dashboardRef = useRef<{ requestUpdate: () => void } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleDashboardRefresh = () => {
    if (dashboardRef.current) {
      dashboardRef.current.requestUpdate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 z-50">
        <Header 
          userName={user?.username} 
          userRole={user?.role} 
          onMenuToggle={handleMenuToggle}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="flex-shrink-0 z-40">
          <Sidebar 
            activeSection="cashiers" 
            onSectionChange={(section) => {
              if (section === 'cashiers') return; // Stay on current page
              // Navigate to other sections
              if (section === 'dashboard') router.push('/dashboard');
              else if (section === 'shop-owners') router.push('/shopowners');
              else if (section === 'shops') router.push('/shops');

              else if (section === 'users') router.push('/users');
              else if (section === 'game-result') router.push('/game-result');
              else if (section === 'reports') router.push('/reports');
              else if (section === 'slip-detail') router.push('/slip-detail');
            }}
            isMobileOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
          />
        </div>
        
        {/* Scrollable Content with Fixed Height */}
        <div className={`flex-1 overflow-hidden transition-all duration-300 bg-gray-50 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          <main className="h-full overflow-y-auto">
            <CashiersSection onDataChange={handleDashboardRefresh} />
          </main>
        </div>
      </div>
    </div>
  );
}
