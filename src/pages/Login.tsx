import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {

  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();
  const { login } = useAuth();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 800 }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoading || isPasswordError || isEmailError) return;

      setIsLoading(true);
      const { data } = await axios.post('https://u4r.in/v1/user/login', authForm);
      console.log(data);
      if (data.status === 200) {
        login(data.data.access_token);
        navigate('/dashboard');
      } else if (data.status === 401) {
        setError('Invalid Email/Password!');
      }
    } catch (error: any) {
      setError("Something Went Wrong!")
    } finally {
      setIsLoading(false);
    }


  };

  const inputFieldHandler = (value: string, input_name: string) => {
    setError("");
    if (input_name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setIsEmailError(true);
      } else {
        setIsEmailError(false);
      }
    } else if (input_name === 'password') {
      if (value.length < 4) {
        setIsPasswordError(true);
      } else {
        setIsPasswordError(false);
      }
    }

    setAuthForm((prevState: any) => ({ ...prevState, [input_name]: value }))
  }

  return (
    <animated.div style={fadeIn} className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <LogIn size={40} className="text-secondary mb-2" />
                <h2 className="card-title text-light">Welcome Back</h2>
                <p className="text-secondary">Sign in to your account</p>
              </div>
              {error ? <div className="alert alert-danger p-2" role="alert">
                <span>{error}</span>
              </div> : ""}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      onChange={(e) => inputFieldHandler(e.target.value, 'email')}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={(e) => inputFieldHandler(e.target.value, 'password')}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3"
                  disabled={isEmailError || isPasswordError}>
                  {
                    isLoading ?
                      <div className="spinner-border rounded-circle spinner-small" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div> : "Sign In"
                  }
                </button>

                <p className="text-center mb-0">
                  <span className='text-secondary'>Don't have an account?{' '}</span>
                  <Link to="/register" className="text-decoration-none oo-heading">
                    Register Now
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

export default Login;