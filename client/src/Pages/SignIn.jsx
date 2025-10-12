import React, { useState ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import InputField from "../Components/Common/InputField";
import AuthCard from "../Components/Auth/AuthCard";
import GoogleAuthButton from "../Components/Auth/GoogleAuthButton";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error ,user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).unwrap()
    .then((res) => {
     navigate("/");
  })
  .catch((err) => console.error(err));
  };
  
  return (
    <AuthCard
      title="Sign In"
      subtitle="Enter your credentials to access your account"
      footer={
        <>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <InputField name="username" label="Username" value={formData.username} onChange={handleChange} />
        <InputField name="password" type="Password" label="Password" value={formData.password} onChange={handleChange} />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 mt-3 rounded-xl">
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <GoogleAuthButton />
    </AuthCard>
  );
};

export default SignIn;
