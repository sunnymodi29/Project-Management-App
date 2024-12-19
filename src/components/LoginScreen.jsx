import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Toastify from "./Toastify";
import { auth } from "../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        Toastify({ toastType: "success", message: "Logged In Successfully!" });
      } catch (error) {
        Toastify({ toastType: "error", message: "Invalid Credentials" });
      }
    } else {
      Toastify({ toastType: "error", message: "Please Provide Valid Details" });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-stone-700">
      <div className="w-full max-w-sm bg-white p-6 rounded-md shadow-2xl">
        <h2 className="text-2xl font-bold text-center uppercase">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <Input
            type="email"
            labelName="Email"
            isTextarea={false}
            placeholder="Enter Your Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            labelName="Password"
            isTextarea={false}
            placeholder="Enter Your Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            additionalClasses="w-full uppercase tracking-wider"
            type="save"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
