<<<<<<< HEAD
import React, { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { baseUrl, userContext } from './App';

export {LoginPage, RegisterPage, getCsrf}


const LoginPage = () => {
    const [message, setMessage] = useState('')
    const {setUser} = useContext(userContext)
    const history = useHistory()
    const [disabled, setDisabled] = useState(false)
    
    const login = async e => {
        e.preventDefault()
        setMessage('')
        setDisabled(true)
        const response = await fetch(`${baseUrl}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value
            })
        })
        if (response.status === 200) {
            const data = await response.json()
            setUser(data)
            history.push('/')
        }
        else {
            setMessage('something went wrong, please try again')
            setDisabled(false)
        }
    }

    return (
        <div className='auth-page'>
            <h3>Login</h3>
            <form onSubmit={login}>
                <label>
                    Username:
                    <input type='text' name='username' placeholder='username' disabled={disabled} required/>
                </label>

                <label>
                    Password:
                    <input type='password' name='password' placeholder='password' disabled={disabled} required/>
                </label>

                <button type='submit' disabled={disabled}>Login</button>
            </form>
            <small>{message}</small>
        </div>
    )
}


const RegisterPage = () => {
    const [message, setMessage] = useState('')
    const {setUser} = useContext(userContext)
    const history = useHistory()
    const [disabled, setDisabled] = useState(false)
    const passwordInput = useRef(null)
    const [passwordConfirmed, setPasswordConfirmed] = useState(true)

    const register = async e => {
        e.preventDefault()
        setMessage('')
        setDisabled(true)
        const response = await fetch(`${baseUrl}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
                email: e.target.email.value
            })
        })       
        if (response.status === 201) {
            const data = await response.json()
            setUser(data)
            history.push('/')
        }
        else if (response.status === 403) {
            setMessage('something went wrong, if you are in private mode please enable cookies for csrf token')
        }
        setDisabled(false)
    }
    const confirmPassword = e => {
        setPasswordConfirmed(e.target.value === passwordInput.current.value)
    }

    return (
        <div className='auth-page'>
            <h3>Register</h3>
            <form onSubmit={register}>
                <label>
                    Username:
                    <input type='text' name='username' placeholder='username...' disabled={disabled} 
                    title='Enter an username consisting of 6-16 hexadecimal digits' pattern="[0-9a-zA-Z]{6,16}" required />
                </label>

                <label>
                    email:
                    <input type='email' name='email' placeholder='email...' disabled={disabled} 
                    title='Enter your email' required/>
                </label>

                <label>
                    Password:
                    <input ref={passwordInput} type='password' name='password'
                    pattern="[0-9a-zA-Z]{8,16}" title="Enter an ID consisting of 8-16 hexadecimal digits"
                    placeholder='password...' disabled={disabled} required/>
                </label>

                <label>
                    Confirm password:
                    <input onInput={confirmPassword} type='password' name='confirmpassword' 
                    placeholder='confirm password...' disabled={disabled} title='Confirm your password' required
                    className={passwordConfirmed ? '' : 'alert'} />
                </label>

                <button type='submit' disabled={!passwordConfirmed}>Register</button>
            </form>
            <small>{message}</small>
        </div>
    )
}


const getCsrf = () => {
    const name = 'csrftoken'
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
=======
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
>>>>>>> fadd66ce05bf65f1bcad3b9d4b325ef240a4cb0d
