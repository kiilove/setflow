import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  userUUID: null,
  setUserUUID: () => {},
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userUUID, setUserUUID] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[AuthContext] onAuthStateChanged:", user);
      setUser(user);
      if (user) {
        try {
          console.log("[AuthContext] UID→UUID 매핑 조회 시도:", user.uid);
          const uuidDoc = await getDoc(doc(db, "uid_map", user.uid));
          if (uuidDoc.exists()) {
            setUserUUID(uuidDoc.data().uuid);
            console.log(
              "[AuthContext] userUUID context 저장:",
              uuidDoc.data().uuid
            );
          } else {
            setUserUUID(null);
            console.log("[AuthContext] UID→UUID 매핑 문서 없음:", user.uid);
          }
        } catch (error) {
          console.error(
            "[AuthContext] UID→UUID 매핑 조회 에러:",
            error,
            error.code,
            error.message,
            error.stack
          );
        }
      } else {
        setUserUUID(null);
      }
      setLoading(false);
      console.log(
        "[AuthContext] loading false, user:",
        user,
        "userUUID:",
        userUUID
      );
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    setUser,
    userUUID,
    setUserUUID,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
