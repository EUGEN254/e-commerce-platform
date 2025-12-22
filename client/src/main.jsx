import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Import all providers
import { CartProvider } from "./context/CartContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { OfferProvider } from "./context/Offers.jsx";

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
