import React, { useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const Register = () => {
    const [userName,setUserName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [errors,setErrors]=useState({});
    const[successMessage,setSuccessMessage]=useState(false);
    const [loading,setLoading]=useState(false);
    const handleRegistration = async(e) =>{
        e.preventDefault();
        setLoading(true);
        
        //  send data to backend API
        const userData = {username:userName,email:email,password:password};
         try {
           const response= await axios.post("http://127.0.0.1:8000/api/v1/register/", userData);
           console.log(response.data);
           console.log("Registration Successful");
           setErrors({});
           setSuccessMessage(true);
         } catch (error) {
            setErrors(error.response.data);
            console.error("Registration Failed", error.response.data);
         }finally{
            setLoading(false);
         }
    }
  return (
    <>
      <div className=" container">
        <div className="row justify-content-center">
          <div className="col-md-6 bg-light-dark p-5 rounded ">
            <h3 className="text-light text-center mb-4">
              {" "}
              Create Your Account
            </h3>
            <form onSubmit={handleRegistration}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <small>
                  {errors.username && (
                    <div className="text-danger">{errors.username} </div>
                  )}
                </small>
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Enter Email Addres"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <small>
                  {errors.email && (
                    <div className="text-danger">{errors.email} </div>
                  )}
                </small>
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control mb-5"
                  placeholder="SetPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <small>
                  {errors.password && (
                    <div className="text-danger">{errors.password} </div>
                  )}
                </small>
              </div>
              {successMessage && (
                <div className="alert alert-success">
                  {" "}
                  Registration Successful
                </div>
              )}
              {loading ? (
                <button className="btn btn-info d-block mx-auto" type="submit" disabled>
                    <FontAwesomeIcon icon={faSpinner} spin />
                  Please Wait...
                </button>
              ) : (
                <button className="btn btn-info d-block mx-auto" type="submit">
                  {" "}
                  Register
                </button>
              )}
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register