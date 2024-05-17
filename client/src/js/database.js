import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });


// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {

  const db = await openDB('jate', 1)

  const store = db.transaction('jate', 'readwrite').objectStore('jate')

  await store.add({ content });

  console.log('Content added to the database');
}

// Function to get all content from the database
export const getDb = async () => {

  const db = await ('jate', 1)

  const tx = db.transaction('jate', 'readonly');

  const store = tx.objectStore('jate');

  const allContent = await store.getAll();

  await tx.done;

  return allContent;
}


initdb();
