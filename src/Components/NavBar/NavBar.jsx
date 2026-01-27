import { useContext } from 'react';
import { Link } from 'react-router';
import './NavBar.css'

import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // The nav bar gets the user from the context which is either
  // {username, sub} if logged in or null if not, and shows
  // set of the correct set of links
  return (
    <nav>
      <img src="/images/22.png" alt="Logo" className="nav-logo"  />      {user ? (
        <ul>
          <li id='welcome-msg'>Welcome, {user.username}</li>
          <li><Link to='/'>Dashboard</Link></li>
          <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
        </ul>
      ) : (
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/sign-in'>Sign In</Link></li>
          <li><Link to='/sign-up'>Sign Up</Link></li>
          <li><Link to='/cards'>FlashCards AI</Link></li>
          <li><Link to='/terms'>Dectionary</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
