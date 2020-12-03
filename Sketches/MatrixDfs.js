var dx = [-1, 1, 0, 0];
var dy = [0, 0, 1, -1];
var v = [];
var stack = [];
var visited = [];
var curr_color = [];
var line_color;

function peek() {
  if (stack.length > 0) {
    return stack[stack.length - 1];
  } else {
    return [0, 0];
  }
}

function is_inside(xx, yy) {
  if (xx >= 0 && xx < 10 && yy >= 0 && yy < 10) {
    return true;
  } else {
    return false;
  }
}

function dfs() {
  if (stack.length > 0) {
    var x = peek()[0];
    var y = peek()[1];

    stack.pop();

    visited[x][y] = 2;

    for (var i = 0; i < 4; i++) {
      var xx = x + dx[i];
      var yy = y + dy[i];

      if (is_inside(xx, yy) && !visited[xx][yy]) {
        if (v[xx][yy] == ".") {
          visited[xx][yy] = 1;
          stack.push([xx, yy]);
        }
      }
    }
  }
}

function show() {
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (v[i][j] == "#") {
        curr_color[i][j] = color(0, 0, 0);
      } else if (visited[i][j] != 2) {
        curr_color[i][j] = color(255, 255, 255);
      } else {
        curr_color[i][j] = color(0, 191, 255);
      }
    }
  }

  curr_color[peek()[0]][peek()[1]] = color(255, 215, 0);
}

function init() {
  for (var i = 0; i < 10; i++) {
    visited[i] = [];
    v[i] = [];
    curr_color[i] = [];
    for (var j = 0; j < 10; j++) {
      visited[i][j] = 0;
      curr_color[i][j] = color(255, 255, 255);
      v[i][j] = ".";
    }
  }

  v[9][1] = "#";
  v[7][2] = "#";
  v[5][3] = "#";
  v[1][4] = "#";
  v[2][7] = "#";
  v[5][5] = "#";
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
  stack.push([0, 0]);
  line_color = 0;
}

function draw() {
  // a draw fica rodando "para sempre"
  background(51);
  get_ready();

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var x = i * 40;
      var y = j * 40;

      fill(curr_color[i][j]); // define a cor que vai ser usada para preencher as formas

      stroke(line_color); // define a cor a ser usada nas linhas em torno das formas

      rect(x, y, 40, 40); // desenha um retangulo a partir da coordenada (x, y) e com width e height == 40 nesse caso
    }
  }
}
