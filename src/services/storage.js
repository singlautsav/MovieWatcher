export const saveUserData = (data) => {
  localStorage.setItem('movieWatcherData', JSON.stringify(data));
};

export const loadUserData = () => {
  const data = localStorage.getItem('movieWatcherData');
  return data ? JSON.parse(data) : { profiles: [] };
};
