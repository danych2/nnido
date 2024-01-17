// Adapted from
// https://medium.com/hackernoon/the-ultimate-guide-for-creating-a-simple-modal-component-in-vanilla-javascript-react-angular-8733e2859b42

import React from 'react';
import PropTypes from 'prop-types';

import './Modal.css';

const Modal = ({
  children, customClass, show, closeCallback,
}) => (
  <div className={`modal ${customClass}`} style={{ display: show ? 'block' : 'none' }}>
    <div className="overlay" onClick={closeCallback} />
    <div className="modal_content">
      {children}
      <button title="Close" className="close_modal" onClick={closeCallback} type="button">
        X
      </button>
    </div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.element,
  customClass: PropTypes.string,
  show: PropTypes.bool,
  closeCallback: PropTypes.func,
};

Modal.defaultProps = {
  children: <div>Empty Modal</div>,
  customClass: '',
  show: false,
  closeCallback: () => (false),
};

export default Modal;
