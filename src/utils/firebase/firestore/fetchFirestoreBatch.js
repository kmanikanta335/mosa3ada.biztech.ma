import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter
} from "firebase/firestore";
import firebase_app from "../../../../config";

export const db = getFirestore(firebase_app);

async function fetchFirestoreInitialBatch(collectionName) {
  let results = [];
  let lastKey = "";
  let lastCount = 0;
  let firstCount = 0;
  let firstKey = "";
  try {
    let q = query(
      collection(db, collectionName),
      orderBy('confirmation_count', 'desc'),
      orderBy('date', 'desc'),
      limit(9)
    )
    const querySnapshots = await getDocs(q);
    querySnapshots.forEach((doc) => {
      results.push({ id: doc.id, data: doc.data() });
      lastKey = doc.data().date;
      lastCount = doc.data().confirmation_count;
    });
    if (results.length > 0) {
      firstKey = results[0].data.date;
      firstCount = results[0].data.confirmation_count;
    }
  } catch (e) {
    console.error("Error retrieving documents:", e);
  }

  return { results, lastKey, firstKey, lastCount, firstCount };
}

async function fetchFirestoreNextBatch(collectionName, confirmation_count, date) {
  let results = [];
  let lastCount = 0;
  let lastKey = "";
  try {
    let q = query(
      collection(db, collectionName),
      orderBy('confirmation_count', 'desc'),
      orderBy('date', 'desc'),
      startAfter(confirmation_count, date),
      limit(9)
    )
    const querySnapshots = await getDocs(q);
    querySnapshots.forEach((doc) => {
      results.push({ id: doc.id, data: doc.data() });
      lastKey = doc.data().date;
      lastCount = doc.data().confirmation_count;
    });
  } catch (e) {
    console.error("Error retrieving documents:", e);
  }

  return { results, lastKey, lastCount };
}


export { fetchFirestoreInitialBatch, fetchFirestoreNextBatch };

