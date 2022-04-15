class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.items.length > 0) {
      return this.items.shift();
    }
  }

  front() {
    return this.items[0];
  }

  empty() {
    return this.items.length == 0;
  }

  size() {
    return this.items.length;
  }
}

class PriorityQueue {
  constructor() {
    this.element = [];
    this.priority = [];
  }

  insert(x, y) {
    this.priority.push(x);
    this.element.push(y);
  }

  pop() {
    var ans = 0;
    for (var i = 0; i < this.priority.length; i++) {
      if (this.priority[i] < this.priority[ans]) {
        ans = i;
      }
    }
    this.priority.splice(ans, 1);
    this.element.splice(ans, 1);
  }

  top() {
    var ans = 0;
    for (var i = 0; i < this.priority.length; i++) {
      if (this.priority[i] < this.priority[ans]) {
        ans = i;
      }
    }
    return this.element[ans];
  }

  find(v) {
    for (var i = 0; i < this.priority.length; i++) {
      if (this.element[i] == v) {
        return true;
      }
    }
    return false;
  }

  empty() {
    if (this.priority.length == 0) {
      return true;
    } else {
      return false;
    }
  }
}

var pq = new PriorityQueue();
var INF = 99999;

class Graph {
  constructor() {
    this.num_vertices = 0;
    this.num_edges = 0;
    this.graph = [];
    this.visited = [];
    this.dist = [];
    this.cost = [];
    this.x = [];
    this.y = [];
  }

  create_vertices() {
    this.num_vertices = 9;
    this.graph = new Array(this.num_vertices);
    this.visited = new Array(this.num_vertices);
    this.dist = new Array(this.num_vertices);
    this.cost = new Array(this.num_vertices);
    this.x = new Array(this.num_vertices);
    this.y = new Array(this.num_vertices);
    for (var i = 0; i < this.num_vertices; i++) {
      this.graph[i] = new Array(this.num_vertices);
      this.cost[i] = new Array(this.num_vertices);
      this.visited[i] = false;
      this.dist[i] = INF;
      this.x[i] = 0;
      this.y[i] = 0;
      for (var j = 0; j < this.num_vertices; j++) {
        this.graph[i][j] = 0;
        this.cost[i][j] = INF;
      }
    }
  }

  add_edge(u, v, c) {
    this.graph[u][v] = 1;
    this.graph[v][u] = 1;
    this.cost[u][v] = c;
    this.cost[v][u] = c;
  }

  create_edges() {
    this.num_edges = 12;
    this.add_edge(0, 1, 4);
    this.add_edge(0, 7, 8);
    this.add_edge(1, 7, 11);
    this.add_edge(1, 2, 8);
    this.add_edge(7, 6, 1);
    this.add_edge(7, 8, 7);
    this.add_edge(2, 8, 2);
    this.add_edge(8, 6, 6);
    this.add_edge(6, 5, 2);
    this.add_edge(3, 5, 14);
    this.add_edge(3, 4, 9);
    this.add_edge(5, 4, 10);
  }

  generate_graph() {
    this.create_vertices();
    this.create_edges();
  }

  dijkstra() {
    if (!pq.empty()) {
      var v = pq.top();
      pq.pop();
      if (this.visited[v]) {
        return;
      }
      this.visited[v] = true;
      for (var u = 0; u < this.num_vertices; u++) {
        if (this.dist[u] > this.dist[v] + this.cost[v][u]) {
          this.dist[u] = this.dist[v] + this.cost[v][u];
          pq.insert(this.dist[u], u);
        }
      }
    } else {
      for (var u = 0; u < this.num_vertices; u++) {
        //console.log(`${u} ${this.dist[u]}`);
      }
    }
  }

  draw() {
    noStroke();
    textAlign(CENTER);
    textSize(15);
    fill(color(255, 255, 0));
    rect(800, 10, 20, 20);
    fill(color(0, 0, 0));
    text(`Visited vertex`, 875, 25);
    fill(color(0, 150, 255));
    rect(800, 50, 20, 20);
    fill(color(0, 0, 0));
    text(`Vertex in priority queue`, 908, 65);
    fill(color(255, 255, 255));
    rect(800, 90, 20, 20);
    fill(color(0, 0, 0));
    text(`Not visited vertex`, 890, 105);

    var q = new Queue();
    var vis = new Array(this.num_vertices);
    for (var u = 0; u < this.num_vertices; u++) {
      vis[u] = false;
    }
    q.enqueue([0, -1, -1]);
    var currx = 100;
    var curry = 170;
    var flag = true;

    while (!q.empty()) {
      var parent = q.front()[1];
      var i = q.front()[0];
      var parent_cost = q.front()[2];
      q.dequeue();

      if (vis[i] == false) {
        vis[i] = true;
        this.x[i] = currx;
        this.y[i] = curry;

        if (flag) {
          currx = currx + 150;
          curry = curry - 100;
        } else {
          curry = curry + 200;
        }
        flag = (flag + 1) % 2;
      }

      if (this.visited[i] == true) {
        fill(color(255, 255, 0));
      } else if (pq.find(i) == true) {
        fill(color(0, 150, 255));
      } else {
        fill(color(255, 255, 255));
      }

      stroke(color(0, 0, 10));
      rect(this.x[i] - 50, this.y[i] - 30, 100, 30);
      if (parent != -1) {
        line(this.x[parent], this.y[parent], this.x[i], this.y[i]);
        textSize(12);
        fill(color(0, 150, 255));
        text(
          `${parent_cost}`,
          (this.x[parent] + this.x[i]) / 2,
          (this.y[parent] + this.y[i]) / 2
        );
      }
      fill(color(0, 0, 10));
      noStroke();
      textSize(10);
      textAlign(CENTER);
      if (this.dist[i] == INF) {
        text(`Vertex: ${i}, Dist: INF`, this.x[i], this.y[i] - 10);
      } else {
        text(`Vertex: ${i}, Dist: ${this.dist[i]}`, this.x[i], this.y[i] - 10);
      }

      for (var u = 0; u < this.num_vertices; u++) {
        if (this.graph[i][u] == 1 && vis[u] == false) {
          q.enqueue([u, i, this.cost[i][u]]);
        }
      }
    }
  }
}

var g = new Graph();

function setup() {
  createCanvas(1000, 600);
  frameRate(0.5);
  g.generate_graph();
  g.dist[0] = 0;
  pq.insert(0, 0);
}

function draw() {
  background(220);
  g.draw();
  g.dijkstra();
}
