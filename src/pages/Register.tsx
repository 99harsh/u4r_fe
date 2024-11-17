import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { UserPlus, User, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authFormData, setAuthFormData] = useState({
    full_name: "",
    email: "",
    password: ""
  })

  const [error, setError]:any = useState({
    full_name: '',
    email: '',
    password: ''
  })

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 800 }
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if(isLoading || error.full_name !== '' || error.email !== '' || error.password !== '') return;
      setIsLoading(true)
      const {data} = await axios.post("https://u4r.in/v1/user/register", authFormData);
      if(data.status === 409){
        setError((prevState:any) => ({...prevState, email: "Email already exist!"}))
      }else if(data.status === 200){
        login(data?.data.access_token);
         navigate('/login');
      }
    }catch(error){
      alert("Something Went Wrong!")
    }finally{
      setIsLoading(false);
    }
  };

  const handleInputChange = (input_name: string, text: string) => {
    if (input_name === "full_name") {
      const regex = /^[a-zA-Z ]+$/;
      if (text.length < 3) {
        setError((prevState: any) => ({ ...prevState, full_name: "Name must be at least 3 characters long." }))
      } else if (text.length > 50) {
        setError((prevState: any) => ({ ...prevState, full_name: "Name cannot exceed 50 characters." }))
      } else if (!regex.test(text)) {
        setError((prevState: any) => ({ ...prevState, full_name: "Numbers and special characters are not allowed." }))
      } else {
        setError((prevState: any) => ({ ...prevState, full_name: "" }));
      }
    } else if (input_name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        setError((prevState: any) => ({ ...prevState, email: "Please enter valid email address." }))
      } else if (text.length < 3) {
        setError((prevState: any) => ({ ...prevState, email: "Email must be at least 3 characters long." }))
      } else if (text.length > 100) {
        setError((prevState: any) => ({ ...prevState, email: "Email cannot exceed 100 characters." }))
      }
      else {
        setError((prevState: any) => ({ ...prevState, email: "" }))
      }
    } else if (input_name === "password") {
      if (text.length < 8) {
        setError((prevState: any) => ({ ...prevState, password: "Password must be at least 8 characters long." }))
      } else if (text.length > 20) {
        setError((prevState: any) => ({ ...prevState, password: "Password cannot exceed 50 characters." }))
      } else {
        setError((prevState: any) => ({ ...prevState, password: "" }));
      }
    }
    setAuthFormData((prevState: any) => ({ ...prevState, [input_name]: text }));
  }

  return (
    <animated.div style={fadeIn} className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <UserPlus size={40} className="text-secondary mb-2" />
                <h2 className="card-title text-light">Create Account</h2>
                <p className="text-secondary">Create your account today!</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      className={`form-control ${error.full_name !== '' && error.full_name !== '' ? 'is-invalid' : ''}`}
                      placeholder="Full Name"

                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      required
                    />
                  </div>
                  {
                    error.full_name != "" ?
                      <div className='error-container'>
                        <span className='text-danger small'>{error.full_name}</span>
                      </div> : ""
                  }
                </div>

                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className={`form-control ${error.email !== '' && error.email !== '' ? 'is-invalid' : ''}`}
                      placeholder="Email"

                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  {
                    error.email ?
                      <div className='error-container'>
                        <span className='text-danger small'>{error.email}</span>
                      </div> : ""
                  }
                </div>

                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      className={`form-control ${error.password !== '' && error.password !== '' ? 'is-invalid' : ''}`}
                      placeholder="Password"

                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>
                  {
                    error.password ?
                      <div className='error-container'>
                        <span className='text-danger small'>{error.password}</span>
                      </div> : ""
                  }
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3"
             >
                   {
                    isLoading ?
                      <div className="spinner-border rounded-circle spinner-small" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div> : "Register"
                  }
                </button>

                <p className="text-center mb-0">
                  <span className='text-secondary'>Already have an account?{' '}</span>
                  <Link to="/login" className="text-decoration-none oo-heading">
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Register;