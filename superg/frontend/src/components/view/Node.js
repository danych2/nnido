import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateNodePosition, setActiveElement, updateNode, createLink } from '../../actions/graphs';
import { normalize_coords, denormalize_coords } from '../../func';

import * as d3 from 'd3';

export class Node extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      editing_node: false,
      dragging_node: false,
      creating_link: false,
      name: this.props.node.name,
      char_width: 10,
      char_height: 16,
    }
  }

  static propTypes = {
    node: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    node_id: PropTypes.string.isRequired,
    setActiveElement: PropTypes.func.isRequired,
    updateNodePosition: PropTypes.func.isRequired,
    updateNode: PropTypes.func.isRequired,
    links_in: PropTypes.array.isRequired,
    links_out: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const {x, y} = denormalize_coords(this.props.position.x, this.props.position.y)

    const node = d3.select(this.myRef.current)
      .attr("transform", "translate("+x+", "+y+")")
      .call(d3.drag()
        .on("start", (d) => {
          if(d3.event.sourceEvent.shiftKey) {
            const {x, y} = denormalize_coords(this.props.position.x, this.props.position.y)
            d3.select(this.myRef.current.parentNode).insert('line', ':first-child')
              .attr('class','creating_link')
              .attr('x1', x).attr('y1', y)
              .attr('x2', x).attr('y2', y)
            this.setState({creating_link: true})
          }
        })
        .on("drag", (d) => {
          if (this.state.creating_link) {
            d3.select(this.myRef.current.parentNode).select('line')
              .attr('x2', d3.event.x).attr('y2', d3.event.y);
          }else if(Math.max(Math.abs(d3.event.dx), Math.abs(d3.event.dy)) > 1) {
            this.props.links_in.map(link => {
              d3.select("#link_"+link.id).selectAll('line')
                .attr("x2", d3.event.x)
                .attr("y2", d3.event.y)});
            this.props.links_out.map(link => {
              d3.select("#link_"+link.id).selectAll('line')
                .attr("x1", d3.event.x)
                .attr("y1", d3.event.y)});
            d3.select(this.myRef.current)
              .attr("transform", "translate("+d3.event.x+", "+d3.event.y+")");
            if(!this.state.dragging_node)
              this.setState({dragging_node: true});
          }
        })
        .on("end", (d) => {
          if(this.state.dragging_node) {
            this.setState({dragging_node: false});
            const {x, y} = normalize_coords(d3.event.x, d3.event.y);
            this.props.updateNodePosition({id: this.props.node_id, x: x, y: y})
          }
          if(this.state.creating_link) {
            const rect = document.elementsFromPoint(d3.event.sourceEvent.x, d3.event.sourceEvent.y).find(x=>x.nodeName==='rect')
            if(rect !== undefined) {
              this.props.createLink({source: this.props.node_id, target: rect.parentNode.id.slice(5)});
            }
            d3.select(this.myRef.current.parentNode).select('line').remove()
            this.setState({creating_link: false})
          } else {
            //only set element as active if a new link was not created
            this.props.setActiveElement({id: this.props.node_id, type: "node"});
          }
        }))
      .on("dblclick", (e) => {
      d3.event.stopImmediatePropagation();
        this.setState({editing_node: true});
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.editing_node) {
      d3.select(this.myRef.current).select('foreignObject').select('input').node().focus();
    }
  }

  handleNameChange = e => {
    this.setState({ name: e.target.value })
  }

  finishNameChange = e => {
    this.setState({ editing_node: false })
    this.props.updateNode({
      id: this.props.node_id,
      name: this.state.name,
    });
  }

  handleKeyUp = e => {
    if (e.keyCode === 13)
      d3.select(this.myRef.current).select('foreignObject').select('input').node().blur();
  }

  render() {
    const text_width = this.state.char_width*this.state.name.length
    const text_height = this.state.char_height

    let text;
    if(this.state.editing_node) {
      text = <foreignObject width={0.9*text_width} height={text_height} x={-0.9*text_width/2} y={-text_height/2}>
              <input className="seamless" type="text" value={this.state.name} onChange={this.handleNameChange} onBlur={this.finishNameChange} onKeyUp={this.handleKeyUp} />
            </foreignObject>
    } else
      text = <text x={-0.9*text_width/2} y={text_height/3}>{this.props.node.name}</text>
    let alt_text = "";
    if(this.props.node.type)
      alt_text = this.props.node.type;
    return (
      <g ref={this.myRef} id={"node_"+this.props.node_id}>
        <title>{alt_text}</title>
        <rect x={-text_width/2} y='-25' width={Math.max(text_width,10)} height='50' rx='15' ry='15' />
        {text}
      </g>
    )
  }

  drag_start(d) {
    console.log("drag_start")
  }

  dragged(d) {
    d3.select(this)
      .attr("transform", "translate("+d3.event.x+", "+d3.event.y+")")
    console.log("dragging")
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.graph.graph.data.nodes.find(x => x.id === ownProps.node_id),
    position: state.graph.graph.visualization.node_positions[ownProps.node_id],
    links_out: state.graph.graph.data.links.filter(x => x.source === ownProps.node_id),
    links_in: state.graph.graph.data.links.filter(x => x.target === ownProps.node_id),
  }
};

export default connect(mapStateToProps, {setActiveElement, updateNodePosition, updateNode, createLink})(Node);