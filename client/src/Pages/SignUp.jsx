import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../Components/Common/InputField";
import AuthCard from "../Components/Auth/AuthCard";
import GoogleAuthButton from "../Components/Auth/GoogleAuthButton";
import { signupUser } from "../redux/slices/authSlice";
import { X, Check } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showValidation, setShowValidation] = useState(false); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading,error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setShowValidation(value.length > 0); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    dispatch(signupUser(formData))
      .unwrap()
      .then(() => navigate("/signin"))
      .catch((err) => console.error(err));
  };


  const checks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  const ValidationItem = ({ label, isValid }) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-gray-400" />
      )}
      <span className={isValid ? "text-green-500" : "text-gray-500"}>
        {label}
      </span>
    </div>
  );

  return (
    <AuthCard
      title="Sign Up"
      subtitle="Create an account to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <InputField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
        />
        <InputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
        />

        {showValidation && (
          <div className="bg-gray-50 rounded-lg p-3 mt-2 mb-4 border border-gray-200 transition-all duration-300">
            <p className="text-sm text-gray-700 font-medium mb-2">
              Password must include:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ValidationItem label="At least 8 characters" isValid={checks.length} />
              <ValidationItem label="One uppercase letter" isValid={checks.uppercase} />
              <ValidationItem label="One lowercase letter" isValid={checks.lowercase} />
              <ValidationItem label="One number" isValid={checks.number} />
            </div>
          </div>
        )}

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white rounded-xl py-3 mt-3 transition ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <GoogleAuthButton />
    </AuthCard>
  );
};

export default SignUp;
