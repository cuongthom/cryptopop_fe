export const AddressMini = (address: string) => {
  if(!address) return ''
  if (address.length < 6) {
    return address
  }
  const start = address.slice(0, 4)
  const end = address.slice(-4)
  return `${start}...${end}`
}

export const minimizeAddress = (address: string) => {
  if(!address) return ''
  if (address.length < 6) {
    return address
  }
  const start = address.slice(0, 6)
  const end = address.slice(-4)
  return `${start}...${end}`
}
export const getLocalStorageObject = (key: string) => {
  const objString = window.localStorage.getItem(key);
  if (!objString) {
    return null;
  }
  return JSON.parse(objString);
};


export const removeItemFromLocalStorage = (key: string) => {
  const inLocalStorage = localStorage.getItem(key);
  if (!inLocalStorage) {
    return;
  }
  localStorage.removeItem(key);
};

export const addItemToLocalStorage = (key: string, item: any) => {
  //Stringify items object then add to localStorage
  const existItem = localStorage.getItem(key);
  if (existItem) {
    removeItemFromLocalStorage(key);
  }
  if (typeof item !== 'object') {
    localStorage.setItem(key, item);
    return;
  }
  localStorage.setItem(key, JSON.stringify(item));
};
