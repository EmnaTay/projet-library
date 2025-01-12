<<<<<<< HEAD
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { baseUrl, userContext } from './App';



export const Header = () => {
    const {user, setUser} = useContext(userContext)
    const history = useHistory()

    const logoutUser = async () => {
        const response = await fetch(`${baseUrl}/auth/logout/`)
        if (response.status === 200) {
            const data = await response.json()
            setUser(data)
            history.push('/')
        }
    }

    return (
        <div className='header'>
            <Link to='/'>Home</Link>
            <div className='header-auth'>
                {user.is_authenticated 
                ? 
                <>
                    {user.is_staff && <a href={`${baseUrl}/admin/books/book/`}>Administrator</a>}
                    <Link to='/contracts'>{user.is_staff ? 'Contracts' : 'My books'}</Link>
                    <a onClick={logoutUser}>Logout</a>
                </>
                :
                <>
                    
                    <Link to='/login'>Login</Link>
                    <Link to='/Register'>Register</Link>
                </>
            }
                <p className='username'>{user.username}</p>
            </div>
            
        </div>
    )
}
=======
import React, { useContext } from "react";
import logo from "static/pictures/logo.png";
import { Link, useHistory } from "react-router-dom";
import { baseUrl, userContext } from "./App";

export const Header = () => {
  const { user, setUser } = useContext(userContext);
  const history = useHistory();

  const logoutUser = async () => {
    const response = await fetch(`${baseUrl}/auth/logout/`);
    if (response.status === 200) {
      const data = await response.json();
      setUser(data);
      history.push("/");
    }
  };

  return (
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />
      <Link className="footer-text" to="/">
        Home
      </Link>
      <Link className="footer-text" to="/Chat">
        Help
      </Link>
      <div className="header-auth">
        {user.is_authenticated ? (
          <>
            {user.is_staff && (
              <a href={`${baseUrl}/admin/books/book/`}>Administrator</a>
            )}
            <Link to="/contracts">
              {user.is_staff ? "Contracts" : "My books"}
            </Link>
            <a onClick={logoutUser}>Logout</a>
          </>
        ) : (
          <>
            <Link className="footer-text" to="/login">
              Login
            </Link>
            <Link className="footer-text" to="/Register">
              Register
            </Link>
          </>
        )}
        <p className="username">{user.username}</p>
      </div>
    </div>
  );
};
>>>>>>> fadd66ce05bf65f1bcad3b9d4b325ef240a4cb0d
