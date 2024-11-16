import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import LinkCard from '../components/LinkCard';
import axios from 'axios';
import ShimmerCard from '../components/ShimmerCard';

const Dashboard = () => {

  const [errorMessage, setErrorMessage] = useState({ title: "", destination_url: "", custom_short_url: "" });
  const [formData, setFormData] = useState({
    title: "",
    destination_url: "",
    custom_short_url: "",
    source: "web"
  })

  const [isBackHalfAvailable, setIsBackHalfAvailable] = useState(false);
  const [isBackHalfLoading, setIsBackHalfLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isShortenLoading, setIsShortenLoading] = useState(false);

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 }
  });

  const [urlData, setUrlData] = useState([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitHandler();

  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shortenedUrl}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
  }

  const handleInputChange = (input: string, text: string) => {
    if (input === "title") {
      if (input.length > 100) {
        setErrorMessage((prevState: any) => ({ ...prevState, title: "Title must be less than 100 character!" }));
      } else {
        setErrorMessage((prevState: any) => ({ ...prevState, title: "" }));
      }
    }
    else if (input === "destination_url") {
      const regex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*/;
      if (text.length > 500) {
        setErrorMessage((prevState: any) => ({ ...prevState, destination_url: "Destination url must be less than 500 characters!" }));
      } else if (!regex.test(text) && text != "") {
        setErrorMessage((prevState: any) => ({ ...prevState, destination_url: "Please enter a valid url!" }))
      } else {
        setErrorMessage((prevState: any) => ({ ...prevState, destination_url: "" }));
      }
    } else if (input === "custom_short_url") {
      const regex = /^[a-zA-Z0-9_-]+$/;
      if (text === "") {
        setErrorMessage((prevState: any) => ({ ...prevState, custom_short_url: "" }))
      }
      else if (text.length < 7 || text.length > 100) {
        setErrorMessage((prevState: any) => ({ ...prevState, custom_short_url: "Input must be in between 7-100 characters long" }))
      } else if (!regex.test(text)) {
        setErrorMessage((prevState: any) => ({ ...prevState, custom_short_url: "Input must contain only letters, digits, underscores (_), and hyphens (-)" }))
      } else {
        setErrorMessage((prevState: any) => ({ ...prevState, custom_short_url: "" }))
      }
      setIsBackHalfAvailable(false);
    }
    setFormData((prevState: any) => ({ ...prevState, [input]: text }))
  }

  const [isLoading, setIsLoading] = useState(false);

  const loadUrls = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("https://u4r.in/v1/user/urls", {
        headers: {
          access_token: localStorage.getItem("token")
        }
      });
      if (data.status === 200) {
        setUrlData(data.data);
      }
      console.log(data);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }

  const checkBackHalfHandler = async (backhalf: string) => {
    try {
      const { data } = await axios.get(`https://u4r.in/check_availability/${backhalf}`);
      if (data.status === 200 && data?.data?.is_available) {
        setIsBackHalfAvailable(true);
      } else {
        setIsBackHalfAvailable(false);
        setErrorMessage((prevState: any) => ({ ...prevState, custom_short_url: "Back half link aready exist!" }))
      }

    } catch (error) {
      alert("Something Went Wrong!")
    }
    finally {
      setIsBackHalfLoading(false);
    }
  }

  const submitHandler = async () => {
    try {
      setIsShortenLoading(true);
      if (formData.title == "") {
        setErrorMessage((prevState: any) => ({ ...prevState, titleError: "Please enter title!" }));
      }
      else if (formData.destination_url === "") {
        setErrorMessage((prevState: any) => ({ ...prevState, message: "Please enter destination url!" }))
      } else {
        setErrorMessage((prevState: any) => ({ ...prevState, message: "" }))
        setErrorMessage((prevState: any) => ({ ...prevState, settingsError: "" }))
        const payload: any = formData;
        if (payload.custom_short_url === "") delete payload.custom_short_url;
        const head = {
          access_token: localStorage.getItem("token")
        }
        const { data } = await axios.post(`https://u4r.in/v1/user/generate`, payload, { headers: head });
        if (data.status === 200) {
          setShortenedUrl(data.data.new_url);
          loadUrls();
        } else {
          alert("Server Error!")
        }
      }
    } catch (error) {
      alert("Something went wrong!");
    } finally {

      setIsShortenLoading(false);
    }
  }

  useEffect(() => {
    loadUrls()
  }, [])

  useEffect(() => {
    if (errorMessage.custom_short_url === "" && formData?.custom_short_url?.length >= 7) {
      const delay = 300;
      const debounce = setTimeout(() => {
        setIsBackHalfLoading(true);
        checkBackHalfHandler(formData.custom_short_url)
      }, delay)
      return () => {
        clearTimeout(debounce)
      }
    }
  }, [formData.custom_short_url]);

  return (
    <animated.div style={fadeIn} className="container col-md-10 py-4">


      {shortenedUrl ? (
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
                  isCopied ? "Copied!" : "Copy"
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
      )
        :
        <div className="card mb-4 animate-slide-up">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-light">Title</label>
                <input
                  type="text"
                  className={`form-control ${errorMessage.title !== "" ? 'is-invalid' : ""}`}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
                {
                  errorMessage.title !== "" ?
                    <div className='error-container'>
                      <span className='text-danger small'>{errorMessage.title}</span>
                    </div> : ""
                }
              </div>

              <div className="mb-4">
                <label className="form-label text-light">Long URL</label>
                <input
                  type="url"
                  className={`form-control ${errorMessage.destination_url !== "" ? 'is-invalid' : ""}`}
                  onChange={(e) => handleInputChange('destination_url', e.target.value)}
                  required
                />
                {
                  errorMessage.destination_url !== "" ?
                    <div className='error-container'>
                      <span className='text-danger small'>{errorMessage.destination_url}</span>
                    </div> : ""
                }
              </div>

              <div className="mb-4">
                <label className="form-label text-light">Custom Backhalf (Optional)</label>
                <div className="input-group">
                  <span className="input-group-text ">u4r.in/</span>
                  <input
                    type="text"
                    className={`form-control ${errorMessage.custom_short_url !== "" ? 'is-invalid' : ""} ${isBackHalfAvailable ? 'is-valid' : ''}`}
                    onChange={(e) => handleInputChange('custom_short_url', e.target.value)}
                  />
                    {
                            isBackHalfLoading ?
                              <div className="spinner-border rounded-circle spinner-small spinner-backhalf text-white" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div> : ""
                          }
                </div>
                {
                  errorMessage.custom_short_url !== "" ?
                    <div className='error-container'>
                      <span className='text-danger small'>{errorMessage.custom_short_url}</span>
                    </div> : ""
                }
              </div>

              <div className="d-flex justify-content-end gap-2">

                <button type="submit" className="btn btn-primary">
                  {
                    isShortenLoading ?
                      <div className="spinner-border rounded-circle spinner-small" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div> : "Create Link"
                  }

                </button>
              </div>
            </form>
          </div>
        </div>}

      {
        isLoading ?
          <div className='row'>
            <div className='col-md-6 mb-4'>
              <ShimmerCard />
            </div>
            <div className='col-md-6'>
              <ShimmerCard />
            </div>
            <div className='col-md-6'>
              <ShimmerCard />
            </div>
            <div className='col-md-6'>
              <ShimmerCard />
            </div>
          </div> :
          <>
            {
              urlData.length ?
                <div className='row text-center py-3'>
                  <h1 className='woho-heading'>W<span className='oo-heading'>oo</span>h<span className='oo-heading'>oooo</span>!</h1>
                  <p>Here are your shortend URLs! Now start rick-rolling your friends!</p>
                </div> : ""
            }

            <div className="row">
              {urlData.map((link: any) => (
                <div className='col-md-6' key={link.id}>

                  <LinkCard {...link} />
                </div>
              ))}

            </div></>
      }

    </animated.div>
  );
};

export default Dashboard;