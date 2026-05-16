import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import type {
  User,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../services/firebase";

export type UserData = {

  uid: string;

  name: string;

  email: string;

  role: string;

  type: string;
};

type AuthContextData = {

  user: User | null;

  userData: UserData | null;

  loading: boolean;
};

type AuthProviderProps = {

  children: ReactNode;
};

const AuthContext =
  createContext(
    {} as AuthContextData
  );

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [user, setUser] =
    useState<User | null>(null);

  const [
    userData,
    setUserData,
  ] = useState<UserData | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(

        auth,

        async (currentUser) => {

          setUser(currentUser);

          if (currentUser) {

            const userRef =
              doc(
                db,
                "users",
                currentUser.uid
              );

            const userSnap =
              await getDoc(userRef);

            if (
              userSnap.exists()
            ) {

              const data =
  userSnap.data();

setUserData({
  uid: data.uid,
  name: data.name,
  email: data.email,
  role: data.role,
  type: data.type,
});
            }

          } else {

            setUserData(null);
          }

          setLoading(false);
        }
      );

    return () =>
      unsubscribe();

  }, []);

  return (

    <AuthContext.Provider
      value={{

        user,

        userData,

        loading,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export function useAuth() {

  return useContext(
    AuthContext
  );
}