export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatRating = (rating: number) => {
  return Number.isInteger(rating) ? `${rating}.0` : rating.toFixed(1);
};
