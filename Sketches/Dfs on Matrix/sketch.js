class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.items.length > 0) {
      return this.items.pop();
    }
  }

  peek() {
    if (this.items.length > 0) {
      return this.items[this.items.length - 1];
    } else {
      return [0, 0];
    }
  }

  empty() {
    return this.items.length == 0;
  }

  size() {
    return this.items.length;
  }
}

var n = 10;
var m = 10;
var dx = [-1, 1, 0, 0];
var dy = [0, 0, 1, -1];
var v = [];
var visited = [];
var curr_color = [];
var st = new Stack();
var line_color;

function is_inside(xx, yy) {
  if (xx >= 0 && xx < n && yy >= 0 && yy < m) {
    return true;
  } else {
    return false;
  }
}

function dfs() {
  if (!st.empty()) {
    var x = st.peek()[0];
    var y = st.peek()[1];

    st.pop();

    visited[x][y] = 2;

    for (var i = 0; i < 4; i++) {
      var xx = x + dx[i];
      var yy = y + dy[i];

      if (is_inside(xx, yy) && !visited[xx][yy]) {
        if (v[xx][yy] == ".") {
          visited[xx][yy] = 1;
          st.push([xx, yy]);
        }
      }
    }
  }
}

function show() {
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (v[i][j] == "#") {
        curr_color[i][j] = color(0, 0, 0);
      } else if (visited[i][j] != 2) {
        curr_color[i][j] = color(255, 255, 255);
      } else {
        curr_color[i][j] = color(0, 191, 255);
      }
    }
  }

  curr_color[st.peek()[0]][st.peek()[1]] = color(255, 215, 0);
}

function init() {
  for (var i = 0; i < n; i++) {
    visited[i] = [];
    v[i] = [];
    curr_color[i] = [];

    for (var j = 0; j < m; j++) {
      visited[i][j] = 0;
      curr_color[i][j] = color(255, 255, 255);
      v[i][j] = ".";
    }
  }

  for (var i = 0; i < floor(random(n * m)); i++) {
    var x = floor(random(n));
    var y = floor(random(m));
    if (x != 0 || y != 0) {
      v[x][y] = "#";
    }
  }
}

function get_ready() {
  dfs();
  show();
}

function setup() {
  // a setup é executada uma unica vez antes da primeira execução da draw
  createCanvas(400, 400); // cria a tela com 400 por 400
  frameRate(5); // definir um framerate baixo pra não ficar acelerado
  init();
  st.push([0, 0]);
  line_color = 0;
}

function draw() {
  // a draw fica rodando "para sempre"
  background(51);
  get_ready();

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      var x = i * (400 / n);
      var y = j * (400 / m);

      fill(curr_color[i][j]); // define a cor que vai ser usada para preencher as formas

      stroke(line_color); // define a cor a ser usada nas linhas em torno das formas

      rect(x, y, 400 / n, 400 / m); // desenha um retangulo a partir da coordenada (x, y) e com width e height == 40 nesse caso
    }
  }
}
