var currentNode = undefined;
var currentEdge = undefined;
var bfsInterval;

var algorithm = "";
var algorithmSpeed = 50;

var algorithmConfig = {
    algorithm: "",
    speed: 50,
    cssSpeed: "1s"
}
var mouseX = 0;
var mouseY = 0;

var bfsObj;

document.body.onmousemove = mouseMove;

function runAlgorithm() {
    if (algorithm == "bfs") {
        bfsObj = new BFS_class(graph, 0);
        bfsInterval = setInterval(() => { BFS(bfsObj) }, algorithmSpeed);
    } else {
        console.log("No Algorithm Selected!");
        $("#visualize").text("Select an Algorithm!");
    }
}
var preNodeMoveinProg = false;
function mouseMove(e) {
    let velX = mouseX;
    let velY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    velX -= mouseX;
    velY -= mouseY;

    
    if(toolbar.nodeMoveinProgress && !preNodeMoveinProg){
        currentNode.velx = velX;
        currentNode.vely = velY;
    }
    if (toolbar.nodeMoveinProgress) {
        currentNode.x = mouseX - NODE_RADIUS;
        currentNode.y = mouseY - NODE_RADIUS;

    }

    preNodeMoveinProg = toolbar.nodeMoveinProgress;

}

function canvasClicked() {
    if (toolbar.nodeCreateTool) {//Nodecreatetool must be active to make node
        nodeCreate(mouseX, mouseY);
    }
}

function nodeClicked(node) {
    /* Enable Moving NodeClicked */
    if (!toolbar.nodeCreateTool && !toolbar.edgeCreateTool) {
        toolbar.nodeMoveinProgress = !toolbar.nodeMoveinProgress;
        currentNode = node;
        /* Create Edge And Assign Second Node to Mouse Pointer */
    } else if (toolbar.edgeCreateTool && !toolbar.edgeCreateinProgress) {
        toolbar.edgeCreateinProgress = true;
        let edge = new Edge(mouseX, mouseY, node, undefined, svgElement);
        currentEdge = edge;
        edgesArray.push(edge);

        /* Assign Second Node of Current Edge to This node*/
    } else if (toolbar.edgeCreateinProgress) {
        toolbar.edgeCreateinProgress = false;

        // DELETE DUPLICATE EDGES
        let edgeWithSameTerminus = edgesArray.filter(edge => edge.node2 == node); //find edges with same node2
        let edgeWithSameOrigin = edgeWithSameTerminus.filter(edge => edge.node1 == currentEdge.node1);
        if (edgeWithSameOrigin[0]) {
            currentEdge.destroyHTMLElement();
            edgesArray.pop();
        } else {
            currentEdge.node2 = node;
            graph.addEdge(currentEdge.node1.vertex, currentEdge.node2.vertex);
        }


    }
}

function nodeCreate(x, y) {
    let body = document.getElementById("canvas");
    let node = new Node(x - NODE_RADIUS, y - NODE_RADIUS, body);
    node.nodeElement.onmousedown = function () { nodeClicked(node) }; //Cannot do this inside the constructor because can't pass "this" 

    nodesArray.push(node);
    graph.addVertex();
    node.nodeElement.classList += " node-placed";
    console.log("making node...");
}
function resetNodes() {
    $(".node").removeClass("node-searched node-discovered")
}
function clearNodesandEdges() {
    edgesArray.forEach(edge => edge.destroyHTMLElement());
    nodesArray.forEach(node => node.destroyHTMLElement());
    edgesArray = [];
    nodesArray = [];
}
