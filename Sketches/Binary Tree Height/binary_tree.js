var n;
var max_depth;

class Tree {
  constructor() {
    this.left = [];
    this.right = [];
    this.parent = [];
    this.x = [];
    this.y = [];
    this.depth = [];
    this.status = [];
  }
  add_left(i, x) {
    this.left[i] = x;
  }
  add_right(i, x) {
    this.right[i] = x;
  }
  init(n) {
    max_depth = 0;
    while (this.left.length < n) {
      this.left.push(-1);
      this.right.push(-1);
      this.parent.push(-1);
      this.x.push(0);
      this.y.push(0);
      this.depth.push(0);
      this.status.push(false);
    }
  }
  generate_tree() {
    max_depth = 0;
    var st = new Stack();
    st.push([0, 1]);
    var cnt = 1;
    while (!st.empty()) {
      var i = st.peek()[0];
      var curr = st.peek()[1];
      var can_left = floor(random(2));
      var can_right = floor(random(2));
      st.pop();
      if (curr > max_depth) {
        max_depth = curr;
      }
      if (can_left == 1 && cnt + 1 < n) {
        this.add_left(i, cnt);
        st.push([cnt, curr + 1]);
        cnt = cnt + 1;
      }
      if (can_right == 1 && cnt + 1 < n) {
        this.add_right(i, cnt);
        st.push([cnt, curr + 1]);
        cnt = cnt + 1;
      }
      if (st.empty() && cnt + 1 < n) {
        var where = floor(random(2));
        if (where == 1) {
          this.add_left(i, cnt);
          st.push([cnt, curr + 1]);
          cnt = cnt + 1;
        } else {
          this.add_right(i, cnt);
          st.push([cnt, curr + 1]);
          cnt = cnt + 1;
        }
      }
    }
  }
  build() {
    var st = new Stack();
    st.push([0, -1]);
    this.depth[0] = 1;
    this.parent[0] = -1;
    while (!st.empty()) {
      var i = st.peek()[0];
      var par = st.peek()[1];
      st.pop();
      if (i == -1) {
        continue;
      }
      if (par != -1) {
        this.depth[i] = this.depth[par] + 1;
        this.parent[i] = par;
      }
      if (this.depth[i] > max_depth) {
        max_depth = this.depth[i];
      }
      st.push([this.left[i], i]);
      st.push([this.right[i], i]);
    }
  }
  build_draw() {
    var height_delta = floor((height * 0.9) / max_depth);
    this.x[0] = width / 2;
    this.y[0] = height_delta;
    var st = new Stack();
    st.push(0);
    while (!st.empty()) {
      var i = st.peek();
      st.pop();
      if (this.left[i] != -1) {
        this.x[this.left[i]] =
          this.x[i] - width / Math.pow(2, this.depth[i] + 1);
        this.y[this.left[i]] = this.y[i] + height_delta;
        st.push([this.left[i]]);
      }
      if (this.right[i] != -1) {
        this.x[this.right[i]] =
          this.x[i] + width / Math.pow(2, this.depth[i] + 1);
        this.y[this.right[i]] = this.y[i] + height_delta;
        st.push([this.right[i]]);
      }
    }
  }
  draw_tree() {
    var st = new Stack();
    st.push(0);
    while (!st.empty()) {
      var i = st.peek();
      st.pop();
      if (i == -1) {
        continue;
      }
      if (this.status[i] == false) {
        fill(220);
        stroke(color(0, 0, 10));
      } else {
        fill(color(255, 255, 0));
        stroke(color(0, 0, 10));
      }
      rect(this.x[i] - 50, this.y[i] - 20, 100, 30);
      if (this.parent[i] != -1) {
        line(
          this.x[this.parent[i]],
          this.y[this.parent[i]] + 10,
          this.x[i] - 15,
          this.y[i] - 20
        );
      }
      fill(color(0, 0, 10));
      noStroke();
      textSize(10);
      textAlign(CENTER);
      text(`Node: ${i}, Depth: ${this.depth[i]}`, this.x[i], this.y[i]);
      st.push([this.left[i]]);
      st.push([this.right[i]]);
    }
  }
}

var prev = -1;
var tree = new Tree();
var st = new Stack();

function get_tree() {
  while (true) {
    n = floor(random(5)) + 10;
    tree.init(n);
    tree.generate_tree();
    if (max_depth > 5) {
      tree.left.length = 0;
      tree.right.length = 0;
      tree.parent.length = 0;
      tree.x.length = 0;
      tree.y.length = 0;
      tree.depth.length = 0;
      tree.status.length = 0;
    } else {
      break;
    }
  }
}

function dfs() {
  if (!st.empty()) {
    var i = st.peek()[0];
    var type = st.peek()[1];
    st.pop();
    if (prev != -1) {
      tree.status[prev] = false;
    }
    tree.status[i] = true;
    if (tree.depth[i] > max_depth) {
      max_depth = tree.depth[i];
    }
    fill(color(0, 0, 10));
    noStroke();
    textAlign(CENTER);
    textSize(25);
    text(`Node:${i}, Answer = ${max_depth}`, width / 2, 20);
    if (tree.left[i] != -1 && type == 0) {
      st.push([i, 1]);
      st.push([tree.left[i], 0]);
    } else if (tree.left[i] == -1 && tree.right[i] != -1 && type == 0) {
      st.push([i, 1]);
      st.push([tree.right[i], 0]);
    } else if (tree.left[i] != -1 && tree.right[i] != -1 && type == 1) {
      st.push([i, 2]);
      st.push([tree.right[i], 0]);
    }
    prev = i;
  } else {
    fill(color(0, 0, 10));
    noStroke();
    textAlign(CENTER);
    textSize(25);
    text(`Final Answer = ${max_depth}`, width / 2, 20);
  }
}