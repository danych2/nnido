/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getGraph } from '../../actions/graphs';

import GraphViewer from '../view/GraphViewer';
import ActiveElement from '../view/ActiveElement';
import SaveGraph from '../view/SaveGraph';
import Model from '../view/Model';

function Info() {
  return (
    <>
      Controles básicos
      <br />
      <br />
      Crear nuevo nodo y editar su nombre: doble click en la página.
      <br />
      Mover nodo: click en nodo y arrastrar
      <br />
      Mover página: click central en página y arrastrar
      <br />
      Zoom: rueda del ratón
      <br />
      Seleccionar nodo o enlace: click en nodo o enlace
      <br />
      Editar nombre de nodo: doble click en nodo
      <br />
      Seleccionar varios nodos a la vez: click y arrastrar en la página
      <br />
      Crear enlace entre nodos: Ctrl + click en nodo origen, arrastrar hasta nodo destino y soltar
      <br />
      <br />
      <br />
      Atributos
      <br />
      <br />
      Puedes asignar atributos tanto a nodos como a enlaces, los atributos tienen un nombre y un valor
      (por ejemplo, un atributo podría ser &apos;altura&apos; con un valor &apos;1.70&apos;),
      pero tampoco pasa nada si dejas el valor en blanco.
      Para añadir un atributo, selecciona un nodo o enlace, escribe el nombre del atributo debajo de donde pone &apos;Atributos&apos; en el menú del nodo seleccionado y haz click en &apos;Añadir atributo&apos;. Luego puedes asignarle un valor escribiéndolo a continuación del nombre.
      <br />
      <br />
      <br />
      Tipos de nodos y enlaces
      <br />
      <br />
      <br />

    </>
  );
}

export default Info;
