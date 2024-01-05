import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  text, onClick,
}) => (
  <div
    className="button"
    onClick={onClick}
  >
    {text}
  </div>
);

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
