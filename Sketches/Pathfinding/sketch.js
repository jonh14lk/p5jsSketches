class PriorityQueue {
  constructor() {
    this.items = [];
  }

  push(element) {
    var contain = false;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i][2] > element[2]) {
        this.items.splice(i, 0, element);
        contain = true;
        break;
      }
    }
    if (!contain) {
      this.items.push(element);
    }
  }

  pop() {
    if (this.items.length > 0) {
      return this.items.shift();
    }
  }

  front() {
    if (this.items.length > 0) {
      return this.items[0];
    }
  }

  empty() {
    return this.items.length == 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    while (this.items.length > 0) {
      this.items.pop();
    }
  }
}

const INF = 1000000000;
var n, m, size_x, size_y, pos;
var q, xa, ya, xb, yb, directions;
var f_score, g_score, pos_color, previous;

function is_inside(x, y) {
  return x >= 0 && x < n && y >= 0 && y < m;
}

function draw_path() {
  var pos = [xb, yb];
  while (true) {
    pos = previous[pos[0]][pos[1]];
    if (pos[0] == xa && pos[1] == ya) {
      break;
    }
    pos_color[pos[0]][pos[1]] = color(127, 255, 212);
  }
}

function h(x, y) {
  return Math.abs(x - xb) + Math.abs(y - yb);
}

function a_star() {
  if (!q.empty()) {
    if (pos[0] != xa || pos[1] != ya) {
      pos_color[pos[0]][pos[1]] = color(128, 128, 128);
    }
    pos = q.front();
    q.pop();
    if (pos[0] == xb && pos[1] == yb) {
      draw_path();
      q.clear();
      return;
    }
    if (pos[0] != xa || pos[1] != ya) {
      pos_color[pos[0]][pos[1]] = color(255, 215, 0);
    }
    for (var d = 0; d < 4; d++) {
      var x = pos[0] + directions[d][0];
      var y = pos[1] + directions[d][1];
      var curr_g = g_score[pos[0]][pos[1]] + 1;
      if (is_inside(x, y) && pos_color[x][y] != 0 && curr_g < g_score[x][y]) {
        g_score[x][y] = curr_g;
        f_score[x][y] = g_score[x][y] + h(x, y);
        previous[x][y] = pos;
        q.push([x, y, f_score[x][y]]);
      }
    }
  }
}

function generate_obstacles() {
  for (var i = 0; i < 200; i++) {
    var x = floor(random(n));
    var y = floor(random(m));
    if (x == xa && y == ya) {
      continue;
    }
    if (x == xb && y == yb) {
      continue;
    }
    pos_color[x][y] = 0;
  }
}

function init() {
  n = 58;
  m = 36;
  size_x = 1450;
  size_y = 900;
  pos_color = new Array(n).fill(255).map(() => new Array(m).fill(255));
  previous = new Array(n).fill(INF).map(() => new Array(m).fill(INF));
  f_score = new Array(n).fill(INF).map(() => new Array(m).fill(INF));
  g_score = new Array(n).fill(INF).map(() => new Array(m).fill(INF));
  xa = floor(random(n));
  ya = floor(random(m));
  do {
    xb = floor(random(n));
    yb = floor(random(m));
  } while (xa == xb && ya == yb);
  g_score[xa][ya] = 0;
  f_score[xa][ya] = h(xa, ya);
  pos_color[xa][ya] = color(255, 0, 0);
  pos_color[xb][yb] = color(0, 0, 255);
  q = new PriorityQueue();
  q.push([xa, ya, f_score[xa][ya]]);
  pos = [xa, ya, f_score[xa][ya]];
  directions = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
  ];
  generate_obstacles();
}

function setup() {
  init();
  createCanvas(size_x, size_y);
  frameRate(35);
}

function draw() {
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      var x = i * (size_x / n);
      var y = j * (size_y / m);

      fill(pos_color[i][j]);
      stroke(0);
      rect(x, y, size_x / n, size_y / m);
    }
  }
  a_star();
}
