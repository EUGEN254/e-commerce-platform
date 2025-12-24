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

// Suppress axios default error handling for specific status codes
// This prevents console errors from appearing in production
axios.defaults.validateStatus = (status) => {
  // Accept all status codes (let the app handle them)
  return true;
};

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
