export default class CreateGraph {
    
    const create_graph(nodeRef, data) {
        var width = 960,
            height = 600,
            svg = d3.select(nodeRef)
            .attr("width", width)
            .attr("height", height);
        
        /*svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(d3.zoom()
                .scaleExtent([1 / 8, 8])
                .filter(function(d) {
                return !d3.event.button && d3.event.type != "doubleclick";
                })
                .on("zoom", this.zoomed))
                //.on("dblclick", this.node_dbclick)
                .on("dblclick.zoom", null);*/
        svg.append("g"); 
        
        this.simulation = d3.forceSimulation().alphaDecay(0.1)
            .force("link", d3.forceLink().strength(0.04).id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            //.force("center", d3.forceCenter(width / 2, height / 2).strength(0.04))
            .force("x", d3.forceX().strength(0.01).x(width / 2))
            .force("y", d3.forceY().strength(0.01).y(height / 2))
            
        this.link_list = svg.select("g").append("g")
            .attr("class", "links")
            .selectAll("line")

        this.node_list = svg.select("g").append("g")
            .attr("class", "nodes").selectAll("g")
              
        this.update_data()

        //this.simulation.on("tick", this.ticked);
    }

    const update_graph(data) {
    }

    node_dbclick() {
        var event = d3.event;
        event.preventDefault;
        var point = d3.mouse(this);
        
        max_node_id += 1
        data.nodes.push({id: max_node_id, name: "", x: point[0], y: point[1]})
        
        this.update_data();
    }

update_data() {
    this.node_list = this.node_list
        .data(data.nodes, function(d) {return d ? d.id : this.comp_id;})
        .join(
            enter => enter.append("g").each(create_node),
            update => update.call(function(selection) { selection.select("text").text(function(d) { return d.name; })})
        )
                    
    this.simulation.nodes(data.nodes);
            
    this.link_list = this.link_list
        .data(data.links, function(d) {return d ? d.id : this.comp_id;})
        .join(
            enter => enter.append("g").each(this.create_edge)
            )
    this.simulation.force("link")
      .links(data.links);
}

update_positions() {
    this.link_list.select("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    this.node_list
        .attr("transform", function(d) { return "translate("+d.x+", "+d.y+")";});
}

create_edge() {
    var edge = d3.select(this)
        .attr('comp_id', function(d) { return d.id; });
         
    edge.append("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });;
}

ticked() {
    this.link_list.select("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    this.node_list
        .attr("transform", function(d) { return "translate("+d.x+", "+d.y+")";});
}


zoomed() {
  d3.select(this.nodeRef).select("g").attr("transform", d3.event.transform);
  this.update = true;
}
}


function create_node() {
    var node = d3.select(this)
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        //.on("click", change_active_node)
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

function dragstarted(d) {
    console.log('dragstart');
    //if (this.simulation_status) {
    if (false) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
}

function dragged(d) {
    console.log('dragged');
    //if (this.simulation_status) {
    if (false) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    } else {
        d.x = d3.event.x;
        d.y = d3.event.y;
    }
}

function dragended(d) {
    console.log('dragend');
    //if (this.simulation_status) {
    if (false) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}