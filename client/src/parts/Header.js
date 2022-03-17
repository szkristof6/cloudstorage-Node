import { useContext } from 'react';
import Logo from '../static/Logo.png';
import { AuthContext } from '../services/authContext';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const auth = useContext(AuthContext);
  const { authState } = auth;

  return (
    <div className="header" onContextMenu={(e) => e.preventDefault()}>
      <div className="logo" title={`Martin Cloud`}>
        <figure className="image is-48x48">
          <img className="is-rounded" alt="Logo" src={Logo} />
        </figure>
        <div className="s-name">Martin Cloud</div>
      </div>
      <div className="kereses"></div>
      <div className="fiok">
        <div className="logout" title={`Kilépés`}>
          <Link to={'#'} onClick={auth.logout}>
            <FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon>
          </Link>
        </div>
        <div className="profile">
          {authState.userInfo.username && (
            <div className="p-icon" title={`Felhasználó név: ${authState.userInfo.username}`}>
              {authState.userInfo.username[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
