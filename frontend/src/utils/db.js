// IndexedDB configuration for Dreamer PWA

const DB_NAME = 'DreamerDB';
const DB_VERSION = 1;

let db = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Workouts store
      if (!db.objectStoreNames.contains('workouts')) {
        const workoutStore = db.createObjectStore('workouts', { keyPath: 'id' });
        workoutStore.createIndex('date', 'date', { unique: false });
      }

      // Routines store
      if (!db.objectStoreNames.contains('routines')) {
        const routineStore = db.createObjectStore('routines', { keyPath: 'id' });
        routineStore.createIndex('folderId', 'folderId', { unique: false });
      }

      // Exercises store
      if (!db.objectStoreNames.contains('exercises')) {
        db.createObjectStore('exercises', { keyPath: 'id' });
      }

      // Folders store
      if (!db.objectStoreNames.contains('folders')) {
        db.createObjectStore('folders', { keyPath: 'id' });
      }

      // Measurements store
      if (!db.objectStoreNames.contains('measurements')) {
        const measurementStore = db.createObjectStore('measurements', { keyPath: 'id' });
        measurementStore.createIndex('date', 'date', { unique: false });
      }

      // User profile store
      if (!db.objectStoreNames.contains('userProfile')) {
        db.createObjectStore('userProfile', { keyPath: 'id' });
      }
    };
  });
};

// Generic CRUD operations
export const addItem = (storeName, item) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getItem = (storeName, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllItems = (storeName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateItem = (storeName, item) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteItem = (storeName, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Export all data for backup
export const exportAllData = async () => {
  const data = {
    workouts: await getAllItems('workouts'),
    routines: await getAllItems('routines'),
    exercises: await getAllItems('exercises'),
    folders: await getAllItems('folders'),
    measurements: await getAllItems('measurements'),
    userProfile: await getAllItems('userProfile'),
  };
  return data;
};

// Import data from backup
export const importAllData = async (data) => {
  const stores = ['workouts', 'routines', 'exercises', 'folders', 'measurements', 'userProfile'];
  
  for (const storeName of stores) {
    if (data[storeName]) {
      for (const item of data[storeName]) {
        await updateItem(storeName, item);
      }
    }
  }
};

// Clear all data
export const clearAllData = async () => {
  const stores = ['workouts', 'routines', 'exercises', 'folders', 'measurements', 'userProfile'];
  
  for (const storeName of stores) {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    await store.clear();
  }
};