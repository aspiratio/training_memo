import { initializeApp } from "firebase/app"
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    return true
  } catch {
    throw Error("メールアドレスかパスワードが間違っています")
  }
}

export const monitorAuthState = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback)
}
