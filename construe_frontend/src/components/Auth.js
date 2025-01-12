import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { baseUrl, userContext } from "./App";

export { LoginPage, RegisterPage, getCsrf };

const LoginPage = () => {
  const [message, setMessage] = useState("");
  const { setUser } = useContext(userContext);
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setMessage("");
    setDisabled(true);

    const response = await fetch(`${baseUrl}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-CSRFToken": getCsrf(),
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      setUser(data);
      history.push("/");
    } else {
      setMessage("Invalid email or password. Please try again.");
      setDisabled(false);
    }
  };

  return (
    <div className="auth-page">
      <h3>Login</h3>
      <form onSubmit={login}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="email"
            disabled={disabled}
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            placeholder="password"
            disabled={disabled}
            required
          />
        </label>

        <button type="submit" disabled={disabled}>
          Login
        </button>
      </form>
      <small>{message}</small>
    </div>
  );
};

const RegisterPage = () => {
  const [message, setMessage] = useState("");
  const { setUser } = useContext(userContext);
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);
  const passwordInput = useRef(null);
  const [passwordConfirmed, setPasswordConfirmed] = useState(true);

  const register = async (e) => {
    e.preventDefault();
    setMessage("");
    setDisabled(true);

    const response = await fetch(`${baseUrl}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-CSRFToken": getCsrf(),
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
        full_name: e.target.full_name.value,
        major: e.target.major.value,
        year: e.target.year.value,
      }),
    });

    if (response.status === 201) {
      const blob = await response.blob(); // Download the QR code
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.png";
      document.body.appendChild(link);
      link.click();
      link.remove();

      const data = await response.json();
      setUser(data);
      history.push("/");
    } else if (response.status === 400) {
      const error = await response.json();
      setMessage(error.error || "Registration failed. Please try again.");
    } else {
      setMessage("Something went wrong. Please try again.");
    }

    setDisabled(false);
  };

  const confirmPassword = (e) => {
    setPasswordConfirmed(e.target.value === passwordInput.current.value);
  };

  return (
    <div className="auth-page">
      <h3>Register</h3>
      <form onSubmit={register}>
        <label>
          Full Name:
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            disabled={disabled}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="email"
            disabled={disabled}
            required
          />
        </label>

        <label>
          Major:
          <select name="major" disabled={disabled} required>
            <option value="" disabled selected>
              Select Major
            </option>
            <option value="Business">Business</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="BI">BI</option>
          </select>
        </label>

        <label>
          Year:
          <select name="year" disabled={disabled} required>
            <option value="" disabled selected>
              Select Year
            </option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="Master 1st">Master 1st</option>
            <option value="Master 1st">Master 1st</option>
          </select>
        </label>

        <label>
          Password:
          <input
            ref={passwordInput}
            type="password"
            name="password"
            pattern="[0-9a-zA-Z]{8,16}"
            title="Enter a password consisting of 8-16 characters"
            placeholder="password..."
            disabled={disabled}
            required
          />
        </label>

        <label>
          Confirm Password:
          <input
            onInput={confirmPassword}
            type="password"
            name="confirmpassword"
            placeholder="Confirm password..."
            disabled={disabled}
            required
            className={passwordConfirmed ? "" : "alert"}
          />
        </label>

        <button type="submit" disabled={!passwordConfirmed || disabled}>
          Register
        </button>
      </form>
      <small>{message}</small>
    </div>
  );
};

const getCsrf = () => {
  const name = "csrftoken";
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
