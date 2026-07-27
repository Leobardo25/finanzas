import { initFirebase } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

const COLLECTION_TRANSACTIONS = 'finanzas_transactions';
const COLLECTION_SETTINGS = 'finanzas_settings';

// Escuchar cambios en la nube en tiempo real
export const subscribeToCloudTransactions = (onDataChange, onError) => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return null;

  try {
    const q = query(collection(db, COLLECTION_TRANSACTIONS), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        onDataChange(docs);
      },
      (err) => {
        console.error('Error en suscripción Firestore:', err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Error suscribiendo a Firestore:', err);
    return null;
  }
};

// Obtener una vez todas las transacciones de la nube
export const getCloudTransactions = async () => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return null;

  try {
    const q = query(collection(db, COLLECTION_TRANSACTIONS), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error obteniendo transacciones de Firestore:', err);
    return null;
  }
};

// Guardar o actualizar una transacción en Firestore
export const saveCloudTransaction = async (tx) => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return false;

  try {
    const docRef = doc(db, COLLECTION_TRANSACTIONS, tx.id);
    await setDoc(docRef, { ...tx, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error guardando transacción en Firestore:', err);
    return false;
  }
};

// Eliminar transacción de Firestore
export const deleteCloudTransaction = async (id) => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return false;

  try {
    const docRef = doc(db, COLLECTION_TRANSACTIONS, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error eliminando de Firestore:', err);
    return false;
  }
};

// Guardar configuración general (Capital, Moneda, Límite de Gasto) en Firestore
export const saveCloudSettings = async (settings) => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return false;

  try {
    const docRef = doc(db, COLLECTION_SETTINGS, 'config_main');
    await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error guardando configuración en Firestore:', err);
    return false;
  }
};

// Obtener configuración general de Firestore
export const getCloudSettings = async () => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return null;

  try {
    const docRef = doc(db, COLLECTION_SETTINGS, 'config_main');
    const snapshot = await getDocs(collection(db, COLLECTION_SETTINGS));
    const mainDoc = snapshot.docs.find((d) => d.id === 'config_main');
    return mainDoc ? mainDoc.data() : null;
  } catch (err) {
    console.error('Error obteniendo configuración de Firestore:', err);
    return null;
  }
};
