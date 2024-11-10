import React from 'react';

const TopMenu = ({ selectedEntity, onSelectEntity }) => {

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Janus</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className={`nav-link ${selectedEntity === 'users' ? 'active' : ''}`}
                onClick={() => onSelectEntity('users')}
              >
                Users
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${selectedEntity === 'streams' ? 'active' : ''}`}
                onClick={() => onSelectEntity('streams')}
              >
                Video streams
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;