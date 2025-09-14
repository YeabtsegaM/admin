'use client';

import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
    category: 'main'
  },
  {
    id: 'shop-owners',
    label: 'Shop Owners',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    category: 'manage'
  },
  {
    id: 'shops',
    label: 'Shops',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    category: 'manage'
  },
  {
    id: 'cashiers',
    label: 'Cashiers',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    category: 'manage'
  },
  {
    id: 'slip-detail',
    label: 'Slip Detail',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    category: 'other'
  },
  {
    id: 'game-result',
    label: 'Game Result',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    category: 'other'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    category: 'other'
  },
  {
    id: 'users',
    label: 'Users',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    category: 'system'
  },
];

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  isMobileOpen = false, 
  onClose,
  isCollapsed = false,
  onToggleCollapse 
}: SidebarProps) {
  const router = useRouter();

  // Persist sidebar state in localStorage
  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
      // Store the new state in localStorage
      const newState = !isCollapsed;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
  };

  const renderNavSection = (category: string, title: string) => {
    const items = navItems.filter(item => item.category === category);
    
    return (
      <div className="mb-6">
        {!isCollapsed && (
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4 transition-all duration-300 hover:text-gray-700">
            {title}
          </h3>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              // Update the active section
              onSectionChange(item.id);
              
              // Close mobile menu when item is clicked
              if (isMobileOpen && onClose) {
                onClose();
              }
            }}
            className={`w-full text-left rounded-lg transition-all duration-300 ease-in-out mb-2 transform hover:scale-105 ${
              isCollapsed ? 'px-2 py-3' : 'px-4 py-2'
            } ${
              activeSection === item.id
                ? isCollapsed 
                  ? 'bg-green-50 text-green-700 border-2 border-green-500 shadow-md' 
                  : 'bg-green-50 text-green-700 border-l-4 border-green-500 shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <div className={`flex items-center transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className={`transition-all duration-200 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${
                activeSection === item.id ? 'scale-110' : 'scale-100'
              }`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className={`ml-3 transition-all duration-200 ${
                  activeSection === item.id ? 'font-semibold' : 'font-normal'
                }`}>
                  {item.label}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-40
        bg-white shadow-sm
        transform transition-all duration-300 ease-in-out
        lg:translate-x-0
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Toggle Button */}
        {onToggleCollapse && (
          <div className={`flex border-b border-gray-200 ${
            isCollapsed ? 'justify-center p-2' : 'justify-end p-2'
          }`}>
            <button
              onClick={handleToggleCollapse}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <svg 
                className="w-4 h-4 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>
          </div>
        )}
        
        <nav className={`h-full overflow-y-auto lg:overflow-y-visible ${
          isCollapsed ? 'p-2' : 'p-4'
        }`}>
          {renderNavSection('main', 'Main')}
          
          {/* Divider line between sections */}
          <div className={`border-t border-gray-200 my-4 transition-all duration-300 hover:border-gray-300 ${
            isCollapsed ? 'mx-1' : 'mx-4'
          }`}></div>
          
          {renderNavSection('manage', 'Manage')}
          
          {/* Divider line between sections */}
          <div className={`border-t border-gray-200 my-4 transition-all duration-300 hover:border-gray-300 ${
            isCollapsed ? 'mx-1' : 'mx-4'
          }`}></div>
          
          {renderNavSection('other', 'Other')}
          
          {/* Divider line between sections */}
          <div className={`border-t border-gray-200 my-4 transition-all duration-300 hover:border-gray-300 ${
            isCollapsed ? 'mx-1' : 'mx-4'
          }`}></div>
          
          {renderNavSection('system', 'System')}
        </nav>
      </aside>
    </>
  );
} 