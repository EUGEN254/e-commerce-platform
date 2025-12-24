import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Import all providers
import { CartProvider } from "./context/CartContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { OfferProvider } from "./context/Offers.jsx";

// Setup axios interceptor to suppress 401 errors during auth check
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 401 errors only from auth/me endpoint (they're expected when not logged in)
    if (error.response?.status === 401 && error.config?.url?.includes('/api/auth/me')) {
      // Return response instead of rejecting to let the app handle it
      return error.response;
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* Order matters! User should be outside so products can use auth if needed */}
    <UserProvider>
      <ProductProvider>
        <OfferProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </OfferProvider>
      </ProductProvider>
    </UserProvider>
  </BrowserRouter>
);
