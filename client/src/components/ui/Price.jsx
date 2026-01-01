import React from "react";
import formatCurrency from "../../utils/formatCurrency";
import { useCart } from "../../context/CartContext";

const Price = ({ amount, originalAmount, symbol, className = "" }) => {
  const { currSymbol } = useCart() || {};
  const useSymbol = symbol || currSymbol || "KES";

  return (
    <span className={className}>
      <span className="font-medium">{formatCurrency(amount, { symbol: useSymbol })}</span>
      {originalAmount !== undefined && originalAmount !== null && (
        <span className="ml-2 text-sm text-gray-500 line-through">
          {formatCurrency(originalAmount, { symbol: useSymbol })}
        </span>
      )}
    </span>
  );
};

export default Price;
