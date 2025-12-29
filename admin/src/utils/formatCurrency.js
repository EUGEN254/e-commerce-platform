export function formatCurrency(amount, options = {}) {
  const { locale = 'en-KE', currency = 'KES', minimumFractionDigits = 2 } = options;
  const num = Number(amount);
  if (amount == null || isNaN(num)) return `KES 0.00`;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(num);
}
