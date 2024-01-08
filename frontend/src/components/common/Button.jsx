import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  text, onClick, styleClass,
}) => (
  <div
    className={styleClass}
    onClick={onClick}
  >
    {text}
  </div>
);

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  styleClass: PropTypes.string,
};

Button.defaultProps = {
  styleClass: 'button',
};

export default Button;
