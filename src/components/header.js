import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import * as Sentry from '@sentry/browser';

const Header = ({ siteTitle }) => {
  const sendSentry = () => {
    Sentry.captureException(new Error('Something broke'));
  };
  return (
    <header className="header">
      <h1>
        <Link to="/">{siteTitle}</Link>
      </h1>
      <ul>
        <li>
          <Link to="/about" onClick={sendSentry}>
            About
          </Link>
        </li>
      </ul>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
