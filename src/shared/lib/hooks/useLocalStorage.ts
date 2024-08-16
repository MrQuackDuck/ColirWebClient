export const useLocalStorage = () => {
  function setToLocalStorage(key: string, data) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  
  function getFromLocalStorage<T>(key): T {
    return JSON.parse(localStorage.getItem(key)!) as T;
  }

  function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
  }

  return { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage };
}