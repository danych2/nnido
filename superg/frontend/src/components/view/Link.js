import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setActiveElement } from '../../actions/graphs';
import { denormalize_coords } from '../../func';

import * as d3 from 'd3';

export class Link extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  static propTypes = {
    link: PropTypes.object.isRequired,
    position_source: PropTypes.object.isRequired,
    position_target: PropTypes.object.isRequired,
    type: PropTypes.object,
    link_id: PropTypes.string.isRequired,
    setActiveElement: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const source = denormalize_coords(this.props.position_source.x, this.props.position_source.y)
    const target = denormalize_coords(this.props.position_target.x, this.props.position_target.y)
    d3.select(this.myRef.current).selectAll('line')
      .attr('x1', source.x).attr('y1', source.y)
      .attr('x2', target.x).attr('y2', target.y)
      .on("click", (d) => {
        this.props.setActiveElement({id: this.props.link_id, type: "link"});
      })
    //TODO: show direction of links
    //if(this.props.type && this.props.type.directed)
  }

  render() {
    return (
      <g ref={this.myRef} id={"link_"+this.props.link_id} >
        <line className="line_hoverarea" />
        <line className="line_visible" />
      </g>
    )
  };
}

const mapStateToProps = (state, ownProps) => {
  const link = state.graph.graph.data.links.find(x => x.id === ownProps.link_id);
  return {
    link: link,
    position_source: state.graph.graph.visualization.node_positions[link.source],
    position_target: state.graph.graph.visualization.node_positions[link.target],
    type: state.graph.graph.model.link_types[link.type]
  }
};

export default connect(mapStateToProps, {setActiveElement})(Link);