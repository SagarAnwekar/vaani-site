import {initializeApp} from 'firebase/app';
import {getAuth,browserSessionPersistence,setPersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
const app=initializeApp({apiKey:'AIzaSyBj4ypcS0H08VL95rKkim6-6pkh8ZXMPT0',authDomain:'vaani-bi.firebaseapp.com',projectId:'vaani-bi',storageBucket:'vaani-bi.firebasestorage.app',messagingSenderId:'739525477900',appId:'1:739525477900:web:a82de821f5476c3dc99029'});
export const auth=getAuth(app),db=getFirestore(app);
export const ready=setPersistence(auth,browserSessionPersistence);
