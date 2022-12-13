/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
import { themes } from '../data/themes';

export const toggler = document.getElementById('theme_toggle');

function changeCssCustomProperties(theme) {
  for (const [key, value] of Object.entries(theme)) {
    const propertyName = `--${key}`;
    document.documentElement.style.setProperty(propertyName, value);
  }
}
export function themeToggle() {
  if (toggler.classList.contains('light')) {
    setDarkTheme();
  } else {
    setLightTheme();
  }
}
function setDarkTheme() {
  toggler.classList.remove('light');
  toggler.classList.add('dark');
  changeCssCustomProperties(themes.dark);
}
function setLightTheme() {
  toggler.classList.add('light');
  toggler.classList.remove('dark');
  changeCssCustomProperties(themes.light);
}
