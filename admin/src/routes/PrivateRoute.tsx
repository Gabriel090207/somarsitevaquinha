import {
  Navigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../services/firebase";

type Props = {
  children: React.ReactNode;
};

export function PrivateRoute({
  children,
}: Props) {

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {

            setAuthorized(false);

            setLoading(false);

            return;
          }

          const userDoc =
            await getDoc(
              doc(
                db,
                "users",
                user.uid
              )
            );

          const userData =
            userDoc.data();

          if (
            userData?.role === "admin"
          ) {

            setAuthorized(true);

          } else {

            setAuthorized(false);
          }

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, []);

  if (loading) {

    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F7FB",
          fontWeight: 700,
        }}
      >
        Carregando...
      </main>
    );
  }

  if (!authorized) {

    return <Navigate to="/" />;
  }

  return children;
}