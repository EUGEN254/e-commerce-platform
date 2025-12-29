// src/components/layout/Layout.jsx
import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FaHome, FaChevronRight } from "react-icons/fa";
import { useEffect } from "react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const getPageTitle = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    if (pathSegments.length === 0) return 'Dashboard Overview';
    return pathSegments.map(segment => 
      segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).join(' / ');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
  const content = document.getElementById("main-content");
  if (content) {
    content.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [location.pathname]);

  const renderBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
        <Link to="/" className="hover:text-blue-500 flex items-center">
          <FaHome className="mr-2" />
          Home
        </Link>
        {pathSegments.map((segment, index) => (
          <React.Fragment key={index}>
            <FaChevronRight className="text-xs" />
            <Link 
              to={`/${pathSegments.slice(0, index + 1).join('/')}`} 
              className="hover:text-blue-500 capitalize"
            >
              {segment.replace(/-/g, ' ')}
            </Link>
          </React.Fragment>
        ))}
      </nav>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Fixed height, scrolls independently */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex lg:flex-col
        `}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area - Takes remaining space, scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Fixed Header */}
        <header className="sticky top-0 z-20 bg-white shadow-sm">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </header>

        {/* Scrollable Content Area */}
        <main id="main-content" className="flex-1 overflow-y-auto main-scrollbar bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
              {renderBreadcrumbs()}
            </div>

            {/* Page Content */}
            <div className="bg-white shadow-xl text-sm rounded-2xl overflow-hidden">
              <div className="p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;