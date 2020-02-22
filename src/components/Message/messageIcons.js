export const messageIcons = (type) => {
  let href, title, src;
  href = title = src = '';
  switch(type) {
    case 'info':
      break;
    case 'warning':
      href = 'https://icon-library.net/icon/warning-icon-png-7.html';
      title = 'Warning Icon Png #321350';
      src = 'https://icon-library.net//images/warning-icon-png/warning-icon-png-7.jpg';
      break;
    case 'error':
      break;
    default:
      return null;
  }
  return { href, title, src };
}