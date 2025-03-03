import { useState } from "react";
import { confirmSignUp } from '@aws-amplify/auth';
import { useNavigate } from "react-router-dom";

export default function ConfirmSignup() {
  const [formData, setFormData] = useState({ username: "", code: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp(formData.username, formData.code);
      setMessage("Account confirmed! You can now log in.");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Confirm Signup</h2>
      <input name="username" type="text" placeholder="Username" className="border p-2 w-full" onChange={handleChange} />
      <input name="code" type="text" placeholder="Confirmation Code" className="border p-2 w-full mt-2" onChange={handleChange} />
      <button onClick={handleConfirm} className="bg-green-500 text-white p-2 w-full mt-2">Confirm</button>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}
