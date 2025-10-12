import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../../redux/slices/authSlice";

const GoogleAuthButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    try {
      await dispatch(googleAuth(credentialResponse.credential)).unwrap() .then((res) => {
        navigate("/");
     })
     .catch((err) => console.error(err));
     
    } catch (err) {
      console.error("Google login backend error:", err);
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
      text="continue_with"
    />
  );
};

export default GoogleAuthButton;
