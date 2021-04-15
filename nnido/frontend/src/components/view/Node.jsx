import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

import {
  selectElements, selectionSwitch, updateNode,
} from '../../actions/graphs';
import {
  denormalizeCoords, dictFilter,
} from '../../func';
import config from '../../config';
import createNodeDragBehavior from '../common/MouseBehaviors';

const Node = ({ node_id }) => {
  const dispatch = useDispatch();
  const myRef = useRef(null);

  const node = useSelector((state) => state.graph.graph.data.nodes[node_id]);
  const nodeName = useSelector((state) => state.graph.graph.data.nodes[node_id].name, shallowEqual);
  const nodeType = useSelector((state) => (node.type ? state.graph.graph.model.node_types[node.type] : ''), shallowEqual);
  const position = (
    useSelector((state) => state.graph.graph.visualization.node_positions[node_id])
  );
  const linksIn = useSelector(
    (state) => dictFilter(state.graph.graph.data.links, (x) => x.target === node_id),
    shallowEqual,
  );
  const linksOut = useSelector(
    (state) => dictFilter(state.graph.graph.data.links, (x) => x.source === node_id),
    shallowEqual,
  );
  const defaultLinkType = useSelector((state) => state.graph.defaultLinkType);

  const [name, setName] = useState(nodeName);
  const [editingNode, setEditingNode] = useState(false);
  const [draggingNode, setDraggingNode] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);

  // References for variables that need to be accessed inside callbacks
  const editingNodeRef = useRef();
  editingNodeRef.current = editingNode;
  const draggingNodeRef = useRef();
  draggingNodeRef.current = draggingNode;
  const creatingLinkRef = useRef();
  creatingLinkRef.current = creatingLink;
  const positionRef = useRef();
  positionRef.current = position;
  const linksInRef = useRef();
  linksInRef.current = linksIn;
  const linksOutRef = useRef();
  linksOutRef.current = linksOut;
  const nodeRef = useRef();
  nodeRef.current = node;

  const selection = useSelector((state) => state.graph.selection);
  const isSelected = selection.ids.includes(node_id);

  useEffect(() => {
    const { x, y } = denormalizeCoords(position.x, position.y);

    const rectStyle = {
      stroke: config.DEFAULT_NODE_COLOR,
    };

    if (nodeType) {
      if (nodeType.color) {
        rectStyle.stroke = nodeType.color;
      }
    }

    const g = d3.select(myRef.current);

    const nodeDragBehavior = createNodeDragBehavior(
      node_id,
      dispatch,
      positionRef,
      myRef,
      creatingLinkRef,
      setCreatingLink,
      draggingNodeRef,
      setDraggingNode,
      defaultLinkType,
      selectElements,
      selection,
    );

    g.attr('transform', `translate(${x}, ${y})`)
      .call(nodeDragBehavior)
      .on('click', () => {
        d3.event.stopImmediatePropagation();
        if (d3.event.shiftKey) {
          dispatch(selectionSwitch({ id: node_id, type: 'node' }));
        } else {
          dispatch(selectElements({ ids: [node_id], type: 'node' }));
        }
      })
      .on('dblclick', (e) => {
        d3.event.stopImmediatePropagation();
        setName(nodeRef.current.name);
        setEditingNode(true);
      });

    const rect = d3.select(myRef.current).select('.nodeBody');
    Object.entries(rectStyle).forEach(([prop, val]) => rect.style(prop, val));
  }, [nodeType, defaultLinkType, selection]);

  useEffect(() => {
    if (editingNode) {
      d3.select(myRef.current).select('foreignObject').select('input').node()
        .focus();
    }
  }, [editingNode]);

  // update name of node (necessary to trigger render if name is changed from a menu)
  useEffect(() => {
    d3.select(myRef.current).select('text').node().textContent = nodeName;
  }, [nodeName]);

  // set node rect size after render (so that text area can be computed)
  useEffect(() => {
    const dim = d3.select(myRef.current).select('text').node().getBBox();
    d3.select(myRef.current).select('.nodeBody')
      .attr('x', -(dim.width / 2 + config.PADDING_TEXT_NODE))
      .attr('y', -(dim.height / 2 + config.PADDING_TEXT_NODE))
      .attr('width', dim.width + config.PADDING_TEXT_NODE * 2)
      .attr('height', dim.height + config.PADDING_TEXT_NODE * 2);
    if (isSelected) {
      const shadowWidth = config.NODE_SHADOW_MARGIN + dim.width;
      const shadowHeight = config.NODE_SHADOW_MARGIN + dim.height;
      d3.select(myRef.current).select('.nodeShadow')
        .attr('x', -(shadowWidth / 2 + config.PADDING_TEXT_NODE))
        .attr('y', -(shadowHeight / 2 + config.PADDING_TEXT_NODE))
        .attr('width', shadowWidth + config.PADDING_TEXT_NODE * 2)
        .attr('height', shadowHeight + config.PADDING_TEXT_NODE * 2);
    } else {
      d3.select(myRef.current).select('.nodeShadow')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', 0);
    }
    if (editingNode) {
      d3.select(myRef.current).select('foreignObject')
        .attr('width', dim.width)
        .attr('height', dim.height);
    }
  });

  const handleNameChange = (e) => { setName(e.target.value); };
  const finishNameChange = (e) => {
    setEditingNode(false);
    if (nodeRef.current.name !== name) {
      dispatch(updateNode({
        id: node_id,
        data: {
          name,
        },
      }));
    }
  };
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      d3.select(myRef.current).select('foreignObject').select('input').node()
        .blur();
    }
  };

  const fontSize = 12;
  let input = '';
  if (editingNode) {
    input = (
      <foreignObject
        style={{ transform: 'translate(-50%, -75%)', transformBox: 'fill-box' }}
      >
        <div style={{ height: 'inherit', display: 'flex', alignItems: 'center' }}>
          <input
            style={{
              fontSize, textAlign: 'center', backgroundColor: 'transparent',
            }}
            className="seamless"
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={finishNameChange}
            onKeyUp={handleKeyUp}
          />
        </div>
      </foreignObject>
    );
  }

  let alt_text = '';
  if (node.type) { alt_text = node.type; }

  return (
    <g ref={myRef} id={`node_${node_id}`}>
      <title>{alt_text}</title>
      <rect className="nodeShadow" rx="19" ry="19" />
      <rect className="nodeBody" rx="15" ry="15" />
      <text
        style={{ fontSize, transform: 'translateX(-50%)', transformBox: 'fill-box' }}
        visibility={editingNode ? 'hidden' : 'visible'}
      >
        {name}
      </text>
      {input}
    </g>
  );
};

Node.propTypes = {
  node_id: PropTypes.string.isRequired,
};

export default Node;
