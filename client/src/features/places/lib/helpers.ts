export const toDateInputValue = (value?: string | null) => {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
};

export const toCoordInputValue = (value: number) => {
  return Number(value).toFixed(6);
};
