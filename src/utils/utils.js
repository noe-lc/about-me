export const validateFn = (fn) => {
  if(!fn || typeof fn !== 'function') {
    return null;
  }
  return fn;
};