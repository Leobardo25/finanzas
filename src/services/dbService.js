import { initFirebase } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
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
  if (!isConfigured || !db) {
    console.warn('[Firestore] No configurado — los datos se guardan solo en localStorage');
    return null;
  }

  try {
    const q = query(collection(db, COLLECTION_TRANSACTIONS), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log(`[Firestore] Sincronizados ${docs.length} movimientos desde la nube`);
        onDataChange(docs);
      },
      (err) => {
        console.error('[Firestore] Error en suscripción:', err.code, err.message);
        if (err.code === 'permission-denied') {
          console.error(
            '[Firestore] ⛔ PERMISO DENEGADO — Las reglas de seguridad de Firestore están bloqueando el acceso.\n' +
            'Ve a Firebase Console → Firestore → Rules y configura:\n' +
            'rules_version = "2";\n' +
            'service cloud.firestore {\n' +
            '  match /databases/{database}/documents {\n' +
            '    match /{document=**} {\n' +
            '      allow read, write: if true;\n' +
            '    }\n' +
            '  }\n' +
            '}'
          );
        }
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('[Firestore] Error creando suscripción:', err);
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
    console.log(`[Firestore] ✓ Guardado: ${tx.id} (${tx.type} ${tx.amount})`);
    return true;
  } catch (err) {
    console.error('[Firestore] ✗ Error guardando:', err.code, err.message);
    // Retornamos el error para que el contexto pueda mostrar un toast
    return { error: true, code: err.code, message: err.message };
  }
};

// Eliminar transacción de Firestore
export const deleteCloudTransaction = async (id) => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return false;

  try {
    const docRef = doc(db, COLLECTION_TRANSACTIONS, id);
    await deleteDoc(docRef);
    console.log(`[Firestore] ✓ Eliminado: ${id}`);
    return true;
  } catch (err) {
    console.error('[Firestore] ✗ Error eliminando:', err.code, err.message);
    return { error: true, code: err.code, message: err.message };
  }
};

// Guardar configuración general en Firestore
export const saveCloudSettings = async (settings) => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return false;

  try {
    const docRef = doc(db, COLLECTION_SETTINGS, 'config_main');
    await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
    console.log('[Firestore] ✓ Configuración guardada en la nube');
    return true;
  } catch (err) {
    console.error('[Firestore] ✗ Error guardando config:', err.code, err.message);
    return { error: true, code: err.code, message: err.message };
  }
};

// Obtener configuración general de Firestore
export const getCloudSettings = async () => {
  const { db, isConfigured } = initFirebase();
  if (!isConfigured || !db) return null;

  try {
    const docRef = doc(db, COLLECTION_SETTINGS, 'config_main');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      console.log('[Firestore] ✓ Configuración cargada de la nube');
      return snapshot.data();
    }
    return null;
  } catch (err) {
    console.error('[Firestore] ✗ Error leyendo config:', err.code, err.message);
    return null;
  }
};
