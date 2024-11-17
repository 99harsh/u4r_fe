import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="col-md-6 navbar-brand d-flex align-items-center" to="/">
          <h2 className='m-0 logo'>U4R.in</h2>
        </Link>

        <div className="justify-content-end">
          <ul className="navbar-nav row navbar-custom">
            {isAuthenticated ? (
              <>
                {
                  location.pathname === '/analytics' ?
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li> : ""
                }

                {/* <li className="nav-item">
                  <Link className="nav-link" to="/analytics">Analytics</Link>
                </li> */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary ms-2" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;