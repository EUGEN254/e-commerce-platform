// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/users/UsersList";
import UserCreate from "./pages/users/UserCreate";
import UserEdit from "./pages/users/UserEdit";
import ProductsList from "./pages/products/ProductList";
import ProductCreate from "./pages/products/ProductCreate";
import ProductEdit from "./pages/products/ProductEdit";
import CategoriesList from "./pages/categories/CategoriesList";
import CategoryCreate from "./pages/categories/CategoryCreate";
import CategoryEdit from "./pages/categories/CategoryEdit";
import AuthLogin from "./pages/AuthLogin";
import OrdersList from "./pages/orders/OrderList";
import OrderDetails from "./pages/orders/OrderDetails";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProductDetails from "./pages/products/ProductDetails";
import Inventory from "./pages/products/Inventory";
import CategoryDetails from "./pages/categories/CategoryDetails";
import { useAuth } from "./context/AuthContext";
import Notification from "./pages/notifications/Notification";
import Messages from "./pages/messages/Messages";

// Placeholder components for other pages
const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
    <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
      <p className="text-gray-600 mb-4">This page is under construction</p>
      <p className="text-gray-500">Content for {title} will be added soon!</p>
    </div>
  </div>
);

function App() {
  const { admin, loading } = useAuth();

  return (
    <div className="h-screen">
      <Toaster />
      <Routes>
        {/* Public route - redirect to dashboard if logged in */}
        <Route
          path="/login"
          element={
            admin && !loading ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLogin />
            )
          }
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* User Management */}
            <Route path="users" element={<UsersList />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="users/:id/edit" element={<UserEdit />} />

            {/* Product Management */}
            <Route path="products" element={<ProductsList />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="products/inventory" element={<Inventory />} />

            {/* Categories */}
            <Route path="categories" element={<CategoriesList />} />
            <Route path="categories/create" element={<CategoryCreate />} />
            <Route path="categories/:id" element={<CategoryDetails />} />
            <Route path="categories/:id/edit" element={<CategoryEdit />} />

            {/* notification management */}
            <Route path="notifications" element={<Notification />} />

            {/* messages management */}
            <Route path="messages" element={<Messages />} />
            {/* Orders */}
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:id" element={<OrderDetails />} />

            {/* Others */}
            <Route
              path="analytics"
              element={<PlaceholderPage title="Analytics" />}
            />
            <Route
              path="reports"
              element={<PlaceholderPage title="Reports" />}
            />
            <Route
              path="settings"
              element={<PlaceholderPage title="Settings" />}
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="p-6 text-center h-full flex items-center justify-center">
                  <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                </div>
              }
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
