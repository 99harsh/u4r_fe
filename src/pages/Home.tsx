import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import "./Home.scss";
import axios from 'axios';

const Home = () => {

  const [formData, setFormData] = useState({
    title: null,
    destination_url: "",
    custom_short_url: "",
    source: "web"
  })
  const [longUrlError, setLongUrlError] = useState('');
  const [isBackHalfLoading, setIsBackHalfLoading] = useState(false);
  const [isShortenLoading, setIsShortenLoading] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [backHalfError, setBackHalfError] = useState('');
  const [isBackHalfAvailable, setIsBackHalfAvailable] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 }
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shortenedUrl}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (backHalfError === "" && longUrlError === "" && !isBackHalfLoading && formData.destination_url.length >= 7) {
        setIsShortenLoading(true);;
        const payload: any = { ...formData };
        if (payload.custom_short_url === "") delete payload.custom_short_url;
        const { data } = await axios.post(`https://u4r.in/v1/guest/generate`, payload);
        if (data.status === 200) {
          setShortenedUrl(data.data.new_url);
        } else {
          alert("Server Error!");
        }

      }
    } catch (error) {

    } finally {
      setIsBackHalfAvailable(false);
      setIsShortenLoading(false)
    }

  };


  const handleLongURL = (value: string) => {
    try {
      const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*/;
      if (value.length > 500) {
        setLongUrlError('Destination url must be less than 500 characters!')
      } else if (!regex.test(value)) {
        setLongUrlError('Please enter a valid url!');
      } else {
        setLongUrlError('');
      }
      setFormData((prevState: any) => ({ ...prevState, destination_url: value }))
    } catch (error) {
      alert("Something Went Wrong!");
    }
  }

  const handleCheckBackhalfUrl = async (value: string) => {
    try {
      setIsBackHalfAvailable(false);
      const regex = /^[a-zA-Z0-9_-]+$/;
      if (value === "") {
        setBackHalfError('')
      } else if (value.length < 7 || value.length > 100) {
        setBackHalfError('Input must be in between 7-100 characters long')
      } else if (!regex.test(value)) {
        setBackHalfError('Input must contain only letters, digits, underscores (_), and hyphens (-)')
      } else {
        setBackHalfError('')
      }
      setFormData((prevState: any) => ({ ...prevState, custom_short_url: value }))
    } catch (error) {
      alert("Something Went Wrong!");
    }
  }

  const checkBackHalfHandler = async (backhalf: string) => {
    try {
      const { data } = await axios.get(`https://u4r.in/check_availability/${backhalf}`);
      if (data.status === 200 && data?.data?.is_available) {
        setIsBackHalfAvailable(true);
      } else {
        setIsBackHalfAvailable(false);
        setBackHalfError('Back half link aready exist!');
      }

    } catch (error) {
      alert("Something Went Wrong!")
    }
    finally {
      setIsBackHalfLoading(false);
    }
  }

  useEffect(() => {
    if (backHalfError === "" && formData.custom_short_url.length >= 7) {
      const delay = 300;

      const debounce = setTimeout(() => {
        setIsBackHalfLoading(true);
        checkBackHalfHandler(formData.custom_short_url);
      }, delay)

      return () => {
        clearTimeout(debounce)
      }
    }
  }, [formData.custom_short_url]);

  return (
    <animated.div style={fadeIn}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="display-4 mb-1 heading-text">Shorten Your Loooong Links</h1>
            <p className="lead mb-5 subheading-text">
              U4R.in is an efficient and easy-to-use URL shortening service that streamlines your online experience.
            </p>

            {
              !shortenedUrl ?
                <div className="url-input-container mb-4">
                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <input
                        type="url"
                        className={`form-control form-control-lg customized-link ${longUrlError != '' ? 'is-invalid' : ''}`}
                        placeholder="Enter your long URL here"
                        onChange={(e) => handleLongURL(e.target.value)}
                      />
                      <button className="btn btn-primary btn-lg d-flex align-items-center" type="submit">
                        {
                          isShortenLoading ?
                            <div className="spinner-border rounded-circle spinner-small" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div> : "Shorten Now"
                        }


                      </button>
                    </div>
                    <div className='text-start'>
                      {
                        longUrlError != '' ?
                          (
                            <span className='text-danger'>{longUrlError}</span>
                          ) : ""
                      }
                    </div>
                    <div className="form-check form-switch mt-3  d-flex justify-content-center">
                      <input
                        className="form-check-input pr-2"
                        type="checkbox"
                        id="customUrlToggle"
                        checked={isCustom}
                        onChange={() => setIsCustom(!isCustom)}
                      />
                      <label className="form-check-label mx-2" htmlFor="customUrlToggle">
                        Customize Link
                      </label>
                    </div>

                    {isCustom && (
                      <div className="mb-3 mt-3 animate-fade-in">
                        <div className="input-group">
                          <span className="input-group-text">u4r.in/</span>
                          <input
                            type="text"
                            className={`form-control ${backHalfError != '' && !isBackHalfAvailable ? 'is-invalid' : ''} ${isBackHalfAvailable ? 'is-valid' : ''}`}
                            placeholder="custom-url"
                            onChange={(e) => {
                              handleCheckBackhalfUrl(e.target.value)
                            }}
                          />
                          {
                            isBackHalfLoading ?
                              <div className="spinner-border rounded-circle spinner-small spinner-backhalf" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div> : ""
                          }
                        </div>
                        <div className='text-start'>
                          {
                            backHalfError != '' ?
                              (
                                <span className='text-danger'>{backHalfError}</span>
                              ) : ""
                          }
                        </div>
                      </div>
                    )}
                  </form>
                </div> : ""
            }


            {shortenedUrl && (
              <div className='row justify-content-center'>
                <div className="alert alert-success mt-3 animate-slide-up">
                  <h5>Your shortened URL is ready!</h5>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={`${shortenedUrl}`}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleCopy()}
                    >
                      {
                        isCopied ? 'Copied!' : 'Copy'
                      }
                    </button>
                  </div>
                  <div className='mt-3'>
                    <button className="btn btn-outline-success"
                      onClick={() => {
                        setShortenedUrl('')
                      }}>Shorten Another!</button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-5">
              <p className="text-secondary">
                Upgrade Your <span className='link-game'>Link Game</span> and Experience Endless Features!{' '}
                <Link to="/register" className="text-primary text-decoration-none">
                  Register Now
                </Link>{' '}
                to enjoy Unlimited Usage.
              </p>
            </div>
          </div>
        </div>


        {/* Clients Section */}
        <div className="py-0">
          <div className="text-center mb-4">
            <h2 className="h3">
              <Users className="me-2 d-inline" />
              Our Clients
            </h2>
            <p className="text-secondary">
              Join the growing list of companies that trust U4R.in for their link management needs
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card client-card-container border-0">
                <div className="card-body p-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <a
                      href="https://www.datacode.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <div className="client-card text-center p-4">
                        <img
                          src="https://www.datacode.in/static/media/logo.4eb691cc.svg"
                          alt="Datacode"
                          className="img-fluid mb-3"
                          style={{ maxHeight: '50px' }}
                        />
                        <p className="text-secondary mb-0">
                          Empowering developers with comprehensive learning resources
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Home;