import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA0e0KeHL76ZQIzJaXvPjCiq59pm199P-g',
  authDomain: 'web-eng-project-d657d.firebaseapp.com',
  projectId: 'web-eng-project-d657d',
  storageBucket: 'web-eng-project-d657d.firebasestorage.app',
  messagingSenderId: '836248577249',
  appId: '1:836248577249:web:ad8838086fad5f522383a0',
  measurementId: 'G-EW8Q851N99'
}

export const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)

export let analytics = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}
