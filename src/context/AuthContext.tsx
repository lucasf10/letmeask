import { createContext, ReactNode, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user?: User,
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export const AuthContextProvider = (props: AuthContextProviderProps) => {
  const auth = getAuth();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL)
          throw new Error('Missing information from Google Account')
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe();
    }
  }, [auth])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL)
        throw new Error('Missing information from Google Account')

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      { props.children }
    </AuthContext.Provider>
  )
}