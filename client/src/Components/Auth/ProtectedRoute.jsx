import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { fetchCurrentUser } from "../../redux/slices/authSlice";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && token) {
      dispatch(fetchCurrentUser());
    }
  }, [user, token, dispatch]);

  if (token && !user) return <div>Loading...</div>;
  else if (!token) return <Navigate to="/signin" replace />;

  return <Outlet />;
};



export default ProtectedRoute;
