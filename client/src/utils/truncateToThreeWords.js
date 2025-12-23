const truncateToThreeWords = (text) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= 3) return text;
  return words.slice(0, 3).join(' ') + '...';
};

export default truncateToThreeWords;