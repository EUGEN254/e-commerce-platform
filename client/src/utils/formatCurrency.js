export default function formatCurrency(amount, options = {}) {
  let opts = options;
  if (typeof options === "string") {
    opts = { currency: options };
  }
  const {
    locale = "en-KE",
    currency = "KES",
    minimumFractionDigits = 2,
  } = opts;
  const num = Number(amount);
  if (amount == null || isNaN(num)) return `${currency} 0.00`;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
  }).format(num);
}
