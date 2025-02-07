import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";
import loaderImage from "@/components/loader/loader.png";
import supabase from "@/utils/supabase";

export const Route = createLazyFileRoute("/login")({
  component: RouteComponent,
});

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function RouteComponent() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    setEmailError(emailPattern.test(value) ? "" : "Invalid email format");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    // setPasswordError(
    //   passwordPattern.test(value)
    //     ? ""
    //     : "Password must be at least 8 characters long and contain both letters and numbers"
    // );
  };

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Sign-in error:", error.message); // Log to console for better debugging
        alert(error.message); // Display error message instead of alerting error object
      } else {
        alert("Login successful");
      }
    } catch (e) {
      console.error("Unexpected error:", e);
      alert("An unexpected error occurred. Please try again later.");
    }
    setLoading(false);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailError && !passwordError) {
      signInWithEmail();
    } else {
      alert("Please correct the errors before submitting");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <form
        onSubmit={() => signInWithEmail()}
        className="w-full max-w-md bg-white p-8 rounded shadow "
      >
        <div className="flex flex-row items-center justify-center pb-2">
          <img src={loaderImage} className="w-28 h-28 " />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
          />
          {emailError && (
            <span className="text-red-500 text-sm">{emailError}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500 mb-5"
          />
          {passwordError && (
            <span className="text-red-500 text-sm">{passwordError}</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default RouteComponent;
