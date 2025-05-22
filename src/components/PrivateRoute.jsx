import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Loader from "./Loader";
import Homepage from "../pages/Homepage";
import { getUser } from "../api/Services";
import Login from "../pages/Login";

function PrivateRoute() {
  const { currentUser, logout, sendVerification } = useAuth();
  const { pathname } = useLocation();

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getUserProfile = async () => {
    getUser(currentUser.uid)
      .then((value) => {
        if (value.data() != null) {
          const userProfile = value.data();

          setUser(userProfile);
          setLoading(false);
          if (!userProfile.userType) {
            logout();
          }
        }
      })
      .catch((err) => {
        console.log(err);
        logout();
      });
  };

  if (currentUser != null) {
    if (user?.id == null || user?.id != currentUser.uid) {
      getUserProfile();
    }

    return (
      <>
        {pathname === "/" ? (
          isLoading ? (
            <Loader message="Loading, please wait..." />
          ) : (
            <Homepage />
          )
        ) : (
          <Navigate to="/" />
        )}
      </>
    );
  }

  return <Login />;
}

export default PrivateRoute;
