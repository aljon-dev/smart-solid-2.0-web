import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isSignUp, setSignup] = useState(false);

  function signup(email, password) {
    setSignup(true);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function deleteAcc(user) {
    return deleteUser(user);
  }

  async function resetPassword(email) {
    return new Promise((resolve, reject) => {
      sendPasswordResetEmail(auth, email)
        .then((_) => {
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  async function sendVerification(user) {
    setSignup(false);
    return new Promise((resolve, reject) => {
      sendEmailVerification(user)
        .then((_) => {
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  // function resetPassword(email) {
  //     return auth.sendPasswordResetEmail(email)
  // }

  // function updateEmail(email) {
  //     return currentUser.updateEmail(email)
  // }

  // function updatePassword(password) {
  //     return currentUser.updatePassword(password)
  // }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (isSignUp) return;
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    signup,
    deleteAcc,
    resetPassword,
    sendVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
