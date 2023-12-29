var simulation;

function create_graph(data) {
        //d3.select('.graph > *').remove()
        var width = 960,
            height = 600,
            svg = d3.select('.graph')
            .attr("width", width)
            .attr("height", height)
/*.call(d3.zoom().on("zoom", function () {
			   svg.attr("transform", d3.event.transform)
			}));*/


        svg.html("");
        svg.append("g");

        simulation = d3.forceSimulation().alphaDecay(0.1)
            .force("link", d3.forceLink().strength(0).id(function(d) { return d.id; })).stop()
        /*    .force("charge", d3.forceManyBody())
            //.force("center", d3.forceCenter(width / 2, height / 2).strength(0.04))
            .force("x", d3.forceX().strength(0.01).x(width / 2))
            .force("y", d3.forceY().strength(0.01).y(height / 2))*/

        var link_list = svg.select("g").append("g")
            .attr("class", "links")
            .selectAll("g")

        var node_list = svg.select("g").append("g")
            .attr("class", "nodes").selectAll("g")

        node_list = node_list
            .data(data.nodes, function(d) {return d ? d.id : this.comp_id;})
            .join(
                enter => enter.append("g").each(create_node),
                update => update.call(function(selection) {
					selection.select("text").text(function(d) { return d.name; })
				})
            )

        simulation.nodes(data.nodes);

        simulation.force("link")
          .links(data.links);

        link_list = link_list
            .data(data.links, function(d) {return d ? d.id : this.comp_id;})
            .join(
                enter => enter.append("g").each(create_edge)
                )

    }

function update_graph() {
	var svg = d3.select('.graph');


	var link_list = svg.select("g").select(".links")
		.selectAll("g")

	var node_list = svg.select("g").select(".nodes")
		.selectAll("g")

	node_list = node_list
		.data(data.nodes, function(d) {return d ? d.id : this.comp_id;})
		.join(
			enter => enter.append("g").each(create_node),
			update => update.call(function(selection) {
				selection.select("text").text(function(d) { return d.name; })
				selection.attr("transform", function(d) { return "translate("+d.x+", "+d.y+")";})
			})
		)

	link_list = link_list
		.data(data.links, function(d) {return d ? d.id : this.comp_id;})
		.join(
			enter => enter.append("g").each(create_edge),
			update => update.each(update_edge)
		)
}

function ticked() {
    /*this.link_list.select("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });*/

    /*this.node_list
        .attr("transform", function(d) { return "translate("+d.x+", "+d.y+")";});*/
}

function create_edge() {
    var edge = d3.select(this)
        .attr('comp_id', function(d) { return d.id; });

	edge.append("line").attr("class", "line_hoverarea")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; })
			.on("click", change_active_edge)
    edge.append("line").attr("class", "line_visible")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; })
      .style("stroke", function(d) {
            if (d.conf && d.conf.color) {return d.conf.color}
            else { return "#aaa" }
        })
}

function update_edge() {
    var edge = d3.select(this);

	edge.select(".line_hoverarea")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; })
    edge.select(".line_visible")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; })
      .style("stroke", function(d) {
            if (d.conf && d.conf.color) {return d.conf.color}
            else { return "#aaa" }
        })
}

function zoomed() {
  svg.select("g").attr("transform", d3.event.transform);
}

function update_data() {
    //placeholder
}

function create_node() {
    var node = d3.select(this)
		.call(d3.drag()
			.clickDistance(100)
			.container(dragcontainer)
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended))
		.on("click", change_active_node)
		.attr('comp_id', function(d) { return d.id; })
		.attr("transform", function(d) { return "translate("+d.x+", "+d.y+")";});

    /*node.append("circle").attr("r", 2.5);
    node.append("text").attr("x",5).attr("y",-5)
      .text(function(d) { return d.name; });*/

    node.append("text")
		.text(function(d) { return d.name; });
    let text_width = node.select('text').node().getBBox().width
    let text_height = node.select('text').node().getBBox().height

    node.select('text').attr("x",-text_width/2).attr("y",text_height/3)
    node.insert("circle", ':first-child').attr("r", Math.max(text_width, text_height));
}
