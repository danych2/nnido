import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  text, onClick,
}) => (
  <div
    className="buttonOutside"
    onClick={onClick}
  >
    <div className="buttonMiddle">
      <div className="buttonInside">
        {text}
      </div>
    </div>
    <div className="buttonCorner" />
  </div>
);

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
