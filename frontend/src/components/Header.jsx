
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider';
import { useContext } from 'react';
import Button from './Button';

const Header = () => {
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        console.log('Logged Out Successfully');
        navigate('/login');
    }
  return (
    <>
      <nav className="navbar container pt-3 pb-3 align-items-start">
        <Link className="navbar-brand text-light" to="/">
          Stock Prediction Portal
        </Link>

        <div>
          {isLoggedIn ? (
              <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Button text="Login" class="btn-outline-info" url="/login" />
              &nbsp;
              <Button text="Register" class="btn-info" url="/register" />
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header