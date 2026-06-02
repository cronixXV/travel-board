type TTheme = 'light' | 'dark';

export const getTileUrl = (theme: TTheme) => {
  if (theme === 'dark') {
    return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  }

  return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
};
