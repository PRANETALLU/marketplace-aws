import { useState } from "react";
import { signIn } from '@aws-amplify/auth';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await signIn(formData.username, formData.password);
      console.log("Access Token:", user.signInUserSession.accessToken.jwtToken);
      setMessage("Login successful!");
      //navigate("/ho"); // Redirect to the dashboard page
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Login</h2>
      <input name="username" type="text" placeholder="Username" className="border p-2 w-full" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" className="border p-2 w-full mt-2" onChange={handleChange} />
      <button onClick={handleLogin} className="bg-purple-500 text-white p-2 w-full mt-2">Login</button>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}
