import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { login, logout } from '../../slices/authSlice';
import Button from './Button';
import './Header.css';
import logo from '../../images/logo_nnido_trans.png';
import Modal from './Modal';

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });
  const [showModal, setShowModal] = useState(false);
  const { username, password } = signInData;

  const dispatch = useDispatch();
  const onChange = (e) => setSignInData({ ...signInData, [e.target.name]: e.target.value });
  const location = useLocation();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const headerLeft = (
    <div id="header-left">
      { location.pathname !== '/' && (
        <Button
          text="Inicio"
          onClick={() => { window.location.href = '/'; }}
        />
      )}
      <span style={{ width: '10px' }}> </span>
      <Button
        text="?"
        onClick={() => { window.location.href = '/info'; }}
      />
    </div>
  );

  const headerRight = (
    <div id="header-right">
      { isAuthenticated ? (
        <Button
          text="Cerrar sesión"
          onClick={() => dispatch(logout())}
        />
      ) : (
        <>
          <Button text="Iniciar sesión" onClick={toggleModal} />
          <Modal
            show={showModal}
            closeCallback={toggleModal}
            customClass="custom_modal_class"
          >
            <>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label><small>Nombre de usuario:</small></label>
                    </td>
                    <td>
                      <input type="text" name="username" onChange={onChange} value={username} autoComplete="username" required />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label><small>Contraseña:</small></label>
                    </td>
                    <td>
                      <input type="password" name="password" onChange={onChange} value={password} autoComplete="current-password" required />
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Button text="Iniciar sesión" onClick={() => { setShowModal(false); dispatch(login({ username, password })); }} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          </Modal>
        </>
      )}
    </div>
  );

  return (
    <div id="header">
      { headerLeft }
      <div id="header-center">
        <img src={logo} />
      </div>
      { headerRight }
    </div>
  );
};

export default Header;
