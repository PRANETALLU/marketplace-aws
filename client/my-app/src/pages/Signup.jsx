import { useState } from "react";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import { userPool } from "../cognitoConfig";

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    userPool.signUp(
      formData.username,
      formData.password,
      [{ Name: "email", Value: formData.email }],
      null,
      (err, result) => {
        if (err) {
          setMessage(err.message || "An error occurred.");
          setLoading(false);
          return;
        }

        setMessage("Signup successful! Check your email for the confirmation code.");
        setTimeout(() => navigate("/confirm-signup"), 1500);
        setLoading(false);
      }
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="border p-2 w-full"
          onChange={handleChange}
          value={formData.username}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 w-full mt-2"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full mt-2"
          onChange={handleChange}
          value={formData.password}
        />
        <button
          type="submit"
          className={`p-2 w-full mt-2 text-white ${loading ? "bg-gray-400" : "bg-blue-500"}`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      {message && <p className={`mt-2 ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
    </div>
  );
}
