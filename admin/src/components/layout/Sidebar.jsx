// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sidebarLinks } from '../../utils/sidebarLinks';
import { 
  FaChevronDown, 
  FaChevronRight, 
  FaSignOutAlt,
  FaUserCircle,
  FaCaretRight
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ closeSidebar }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const { logout,admin } = useAuth();
  const location = useLocation();

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    if (path === location.pathname) return true;
    return false;
  };

  const isSubmenuActive = (submenuItems) => {
    if (!submenuItems) return false;
    return submenuItems.some(item => isActive(item.path));
  };

  return (
    <div className="w-72 sidebar-scrollbar bg-gray-900 text-white h-screen flex flex-col shadow-xl">
      {/* Logo/Header - Fixed at top */}
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-white">AD</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Admin Panel</h1>
            <p className="text-xs text-gray-400 mt-0.5">v1.0.0</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-4 py-6 space-y-2">
        {sidebarLinks.map((item) => {
          const isItemActive = isActive(item.path) || isSubmenuActive(item.submenu);
          
          return (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  {/* Main menu item with submenu */}
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                      isItemActive 
                        ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-l-4 border-blue-400' 
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-md ${
                        isItemActive ? 'bg-blue-500/20' : 'bg-gray-800'
                      }`}>
                        <item.icon className={`text-base ${item.color}`} />
                      </div>
                      <span className="font-medium text-sm tracking-wide">{item.title}</span>
                    </div>
                    {expandedMenus[item.id] ? (
                      <FaChevronDown className="text-xs text-gray-400 transition-transform" />
                    ) : (
                      <FaChevronRight className="text-xs text-gray-400 transition-transform" />
                    )}
                  </button>
                  
                  {/* Submenu items - Animated dropdown */}
                  {expandedMenus[item.id] && (
                    <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-700 pl-4 py-1 animate-slideDown">
                          {item.submenu.map((subItem) => {
                        const isSubItemActive = isActive(subItem.path);
                        
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => closeSidebar && closeSidebar()}
                            className={`flex items-center space-x-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                              isSubItemActive 
                                ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-blue-300 shadow-inner' 
                                : 'hover:bg-gray-800/40 text-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                              {subItem.icon && (
                                <subItem.icon className={`text-sm ${
                                  isSubItemActive ? 'text-blue-300' : 'text-gray-400'
                                }`} />
                              )}
                              <span className="text-sm font-medium tracking-wide">{subItem.title}</span>
                            </div>
                            {isSubItemActive && (
                              <FaCaretRight className="ml-auto text-blue-400 animate-pulse" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                // Single menu item (no submenu)
                <Link
                  to={item.path}
                  onClick={() => closeSidebar && closeSidebar()}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-l-4 border-blue-400' 
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`p-2 rounded-md ${
                    isActive(item.path) ? 'bg-blue-500/20' : 'bg-gray-800'
                  }`}>
                    <item.icon className={`text-base ${item.color}`} />
                  </div>
                  <span className="font-medium text-sm tracking-wide">{item.title}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
      
      {/* User Profile/Logout - Fixed at bottom */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0 mt-auto">
        <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
          <FaUserCircle className="text-3xl text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium">{admin?.name}</p>
            <p className="text-xs text-gray-400">{admin?.email}</p>
          </div>
          <button 
          onClick={logout}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <FaSignOutAlt className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;