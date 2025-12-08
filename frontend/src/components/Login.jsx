import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import Button from "./Button";
import axiosInstance from "../axiosInstance";


const Login = () => {
        const [userName,setUserName]=useState('');
        const [password,setPassword]=useState('');
        const [loading,setLoading]=useState(false);
        const[error,setError]=useState('');
        const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
        const navigate = useNavigate();

        const handleLogin = async(e) =>{
            e.preventDefault();
            setLoading(true);
            const loginData = {username:userName,password:password};
            try {
                const response = await axiosInstance.post(
                  "/token/",
                  loginData
                );
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);
                setIsLoggedIn(true);
                navigate("/dashboard");
            } catch (error) {
                console.error('invalid Credentials');
                setError('Invalid Credentials');
            }finally{
                setLoading(false);
            }
        };

  return (
    <>
      <div className=" container">
        <div className="row justify-content-center">
          <div className="col-md-6 bg-light-dark p-5 rounded ">
            <h3 className="text-light text-center mb-4">
              {" "}
              Login To Our Portal
            </h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control mb-5"
                  placeholder="SetPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
                {error && <div className="text-danger mb-3">{error}</div>}
              {loading ? (
                <Button
                  className="btn btn-info d-block mx-auto"
                  type="submit"
                  disabled
                >
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Logging in...
                </Button>
              ) : (
                <button className="btn btn-info d-block mx-auto" type="submit">
                  {" "}
                 Login
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
