export const saveUserData = (data) => {
  try {
    localStorage.setItem('movieWatcherData', JSON.stringify(data));
  } catch (e) {
    console.error("Local storage is disabled");
  }
};

export const loadUserData = () => {
  try {
    const data = localStorage.getItem('movieWatcherData');
    return data ? JSON.parse(data) : { profiles: [] };
  } catch (e) {
    return { profiles: [] };
  }
};
