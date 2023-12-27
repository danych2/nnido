import React from 'react';
import { Link } from 'react-router-dom';

const Toolbar = (props) => {
  const importJSON = (e) => {
    const json = JSON.parse(Window.prompt('Paste your JSON here.'));
    console.log(json);
  };

  return (
    <div className="comp" style={{ flexShrink: '0' }}>
      <div>
        <Link to="/login">Iniciar sesión</Link>
      </div>
      <button type="button" onClick={importJSON}>Importar</button>
    </div>
  );
};

export default Toolbar;
