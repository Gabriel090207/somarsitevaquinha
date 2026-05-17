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

  phone: string;

  role: string;

  type: string;

  cpf?: string;

  cnpj?: string;
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
    useState<boolean>(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(

        auth,

        async (
          currentUser: User | null
        ) => {

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

                phone: data.phone,

                role: data.role,

                type: data.type,

                cpf: data.cpf,

                cnpj: data.cnpj,
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