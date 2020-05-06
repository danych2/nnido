import * as d3 from 'd3';
import { createNode, updateNodePosition, setActiveElement, updateZoom } from '../actions/graphs';
import store from '../store';

let simulation;
let data;

export default function create_graph(data, zoom) {

  const width = 960,
    height = 600,
    svg = d3.select('#graph_container')
    .attr("width", width)
    .attr("height", height);

  svg.html("");
  const svg_g = svg.append("g");

  const zoom_behaviour = d3.zoom().on("zoom", function () {
         svg_g.attr("transform", d3.event.transform);
      }).on("end", function () {
         updateZoom(d3.event.transform)(store.dispatch);
      })

  svg.call(zoom_behaviour)
    .call(zoom_behaviour.transform, zoom?d3.zoomIdentity.translate(zoom.x, zoom.y).scale(zoom.k):d3.zoomIdentity)
    .on("dblclick.zoom", null)
    .on("click.zoom", null)
    .on("dblclick", dblclick_createNode);

  simulation = d3.forceSimulation().alphaDecay(0.1)
    .force("link", d3.forceLink().strength(0).id(function(d) { return d.id; })).stop()

  const link_list = svg.select("g").append("g")
    .attr("class", "links")
    .selectAll("g");

  const node_list = svg.select("g").append("g")
    .attr("class", "nodes").selectAll("g");

  node_list
    .data(data.nodes, function(d) {return d ? d.id : this.comp_id;})
    .join(
      enter => enter.append("g").each(create_node),
      update => update.call(function(selection) {
        selection.select("text").text(function(d) { return d.name; })
      })
    );

  simulation.nodes(data.nodes);

  simulation.force("link")
    .links(data.links);

  link_list
    .data(data.links, (d) => d?d.id:this.comp_id)
    .join(
      enter => enter.append("g").each(create_link)
    );
}

export function update_graph(new_data) {
  data = new_data?new_data:data;

	var svg_g = d3.select('#graph_container').select("g");


	var link_list = svg_g.select(".links")
		.selectAll("g")

	var node_list = svg_g.select(".nodes")
		.selectAll("g")

	node_list = node_list
		.data(data.nodes, function(d) {return d ? d.id : this.comp_id;})
		.join(
			enter => enter.append("g").each(create_node),
			update => update.call(function(selection) {
				selection.select("text").text((d) => d.name )
				selection.attr("transform", (d) => ("translate("+d.x+", "+d.y+")"))
			})
		)

  simulation.nodes(data.nodes).force("link")
    .links(data.links);

	link_list = link_list
		.data(data.links, (d) => d?d.id:this.comp_id)
		.join(
			enter => enter.append("g").each(create_link),
			update => update.each(update_link)
		)

}

function create_node() {
  const node = d3.select(this)
    .call(d3.drag()
      .clickDistance(10)
      .container(dragcontainer)
      .on("start", drag_start)
      .on("drag", dragged)
      .on("end", drag_end))
  	.attr('comp_id', (d) => d.id )
  	.attr("transform", (d) => ("translate("+d.x+", "+d.y+")"))
    .on("dblclick", edit_node_text);

  node.append("text")
	  .text(function(d) { return d.name; })
  const text_width = node.select('text').node().getBBox().width
  const text_height = node.select('text').node().getBBox().height

  node.select('text').attr("x",-text_width/2).attr("y",text_height/3)
  node.insert("circle", ':first-child').attr("r", Math.max(text_width, text_height));
}

function edit_node_text() {
  console.log("edit_node_text")
  console.log(this)
  const node = d3.select(this);

  const text_width = node.select('text').node().getBBox().width
  const text_height = node.select('text').node().getBBox().height

  node.append("foreignObject")
    .attr("x", -text_width/2)
    .attr("y", text_height/3)
    .attr("height", text_height)
    .attr("width", text_width)
    .append("xhtml:input")
    .attr("type", "text")
    .attr("value", "nombre")
  d3.event.stopImmediatePropagation()
}

function create_link() {
  const link = d3.select(this)
    .attr('comp_id', (d) => d.id );

	link.append("line").attr("class", "line_hoverarea")
	  .attr("x1", (d) => d.source.x )
		.attr("y1", (d) => d.source.y )
		.attr("x2", (d) => d.target.x )
		.attr("y2", (d) => d.target.y )
    .on("click", set_active_edge)
  link.append("line").attr("class", "line_visible")
		.attr("x1", (d) => d.source.x )
		.attr("y1", (d) => d.source.y )
		.attr("x2", (d) => d.target.x )
		.attr("y2", (d) => d.target.y )
    .style("stroke", function(d) {
      if (d.conf && d.conf.color) {return d.conf.color}
      else { return "#aaa" }
    })
}

function update_link() {
  var link = d3.select(this);

	link.select(".line_hoverarea")
		.attr("x1", (d) => d.source.x )
		.attr("y1", (d) => d.source.y )
		.attr("x2", (d) => d.target.x )
		.attr("y2", (d) => d.target.y )
  link.select(".line_visible")
		.attr("x1", (d) => d.source.x )
		.attr("y1", (d) => d.source.y )
		.attr("x2", (d) => d.target.x )
		.attr("y2", (d) => d.target.y )
    .style("stroke", function(d) {
      if (d.conf && d.conf.color) {return d.conf.color}
      else { return "#aaa" }
    })
}

function set_active_node(node) {
  setActiveElement({id: node.getAttribute("comp_id"), type: "node"})(store.dispatch);
}

function set_active_edge() {
  setActiveElement({id: this.parentElement.getAttribute("comp_id"), type: "link"})(store.dispatch);
}

function dragcontainer() {
  return this.parentNode.parentNode;
}

function drag_start(d) {
  d.startX = d3.event.x;
  d.startY = d3.event.y;
}

function dragged(d) {
  const dx = d3.event.dx, dy = d3.event.dy;
  if(Math.max(Math.abs(dx), Math.abs(dy)) > 1) {
    d.x = d3.event.x;
    d.y = d3.event.y;
    d3.select(this)
      .attr("transform", "translate("+d.x+", "+d.y+")")
    update_graph(null);
  }
}

function drag_end(d) {
  const distance = Math.max(Math.abs(d.x - d.startX), Math.abs(d.y - d.startY));
  if(distance > 1) {
    updateNodePosition({id: d.id, x: d3.event.x, y: d3.event.y})(store.dispatch)
  }
  set_active_node(this)
}

function dblclick_createNode() {
  const zoomTransform = d3.zoomTransform(this)

  createNode({data: {name: "nombre"}, position: {
    x: zoomTransform.invertX(d3.event.offsetX),
    y: zoomTransform.invertY(d3.event.offsetY),
  }})(store.dispatch);
}