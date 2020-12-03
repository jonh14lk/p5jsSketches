var n = 8; // array size
var v = [];
var can_query;

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
    return this.items[this.items.length - 1];
  }

  empty() {
    return this.items.length == 0;
  }

  size() {
    return this.items.length;
  }
}

class SegmentTree {
  constructor() {
    this.tree = [];
    this.status = [];
    this.parent = [];
    this.x = [];
    this.y = [];
  }

  resize() {
    while (this.tree.length < 4 * n) {
      this.tree.push(0);
      this.status.push(false);
      this.parent.push(-1);
      this.x.push(0);
      this.y.push(0);
    }
  }

  reset() {
    for (var i = 0; i < this.tree.length; i++) {
      this.status[i] = false;
    }
  }

  size() {
    return this.tree.length;
  }

  build() {
    var n_log = floor(Math.log2(n));

    if (Math.pow(2, floor(Math.log2(n))) != n) {
      n_log++;
    }

    var height_delta = floor((height * 0.9) / (n_log + 1));

    var st = new Stack();

    st.push([0, n - 1, 1, 0]);
    this.x[1] = width / 2;
    this.y[1] = height_delta;

    while (!st.empty()) {
      var l = st.peek()[0];
      var r = st.peek()[1];
      var i = st.peek()[2];
      var type = st.peek()[3];

      st.pop();

      if (type == 0) {
        if (l == r) {
          this.tree[i] = v[l];
        } else {
          var mid = floor((l + r) / 2);

          st.push([l, r, i, 1]);

          st.push([l, mid, 2 * i, 0]);

          var log = floor(Math.log2(i)) + 2;

          this.parent[2 * i] = i;
          this.x[2 * i] = this.x[i] - width / Math.pow(2, log);
          this.y[2 * i] = this.y[i] + height_delta;

          st.push([mid + 1, r, 2 * i + 1, 0]);

          this.parent[2 * i + 1] = i;
          this.x[2 * i + 1] = this.x[i] + width / Math.pow(2, log);
          this.y[2 * i + 1] = this.y[i] + height_delta;
        }
      } else if (type == 1) {
        this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
      }
    }
  }

  query(ql, qr) {
    var st = new Stack();
    var ans = 0;

    st.push([0, n - 1, 1]);

    while (!st.empty()) {
      var l = st.peek()[0];
      var r = st.peek()[1];
      var i = st.peek()[2];

      st.pop();

      var mid = floor((l + r) / 2);

      if (l > r || l > qr || r < ql) {
        continue;
      } else if (l >= ql && r <= qr) {
        this.status[i] = true;
        ans += this.tree[i];
        continue;
      }

      st.push([l, mid, 2 * i]);
      st.push([mid + 1, r, 2 * i + 1]);
    }

    return ans;
  }

  draw_tree() {
    var st = new Stack();

    st.push([0, n - 1, 1]);

    while (!st.empty()) {
      var l = st.peek()[0];
      var r = st.peek()[1];
      var i = st.peek()[2];

      st.pop();

      if (!this.status[i]) {
        noFill();
        stroke(255);
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

      if (!this.status[i]) {
        fill(255);
        noStroke();
      } else {
        fill(color(0, 0, 10));
        noStroke();
      }

      textSize(12);
      textAlign(CENTER);
      text(`[${l}, ${r}] Sum = ${this.tree[i]}`, this.x[i], this.y[i]);

      if (l != r) {
        var mid = floor((l + r) / 2);

        st.push([l, mid, 2 * i]);
        st.push([mid + 1, r, 2 * i + 1]);
      }
    }
  }
}

var seg = new SegmentTree();

function create_array() {
  for (var i = 0; i < n; i++) {
    var k = floor(random(20));
    v.push(k);
  }
}

function init() {
  create_array();
  seg.resize();
  seg.build();
}

function setup() {
  if (Math.pow(2, floor(Math.log2(n))) == n) {
    createCanvas(n * 112.5, n * 62.5);
  } else {
    var nn = Math.pow(2, floor(Math.log2(n) + 1));
    createCanvas(nn * 112.5, nn * 62.5);
  }

  frameRate(0.5);
  can_query = false;
  init();
}

function draw() {
  background(color(0, 60, 250));

  if (!can_query) {
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(25);

    text(`Array = {${v}}`, width / 2, 20);
    can_query = true;
  } else {
    var l = floor(random(n));
    var r = floor(random(n));

    if (l > r) {
      var aux = l;
      l = r;
      r = aux;
    }

    seg.reset();
    var ans = seg.query(l, r);

    fill(color(255, 255, 0));
    noStroke();
    textAlign(CENTER);
    textSize(25);
    text(`Query(${l}, ${r}) = ${ans}`, width / 2, 20);
  }

  seg.draw_tree();
}
