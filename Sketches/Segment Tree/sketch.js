var n = 8; // array size
var v = [];
var can_query;

class SegmentTree {
  constructor() {
    this.seg_sz = 1;
    while (this.seg_sz < n) {
      this.seg_sz *= 2;
    }
    this.seg_sz *= 2;

    this.tree = new Array(this.seg_sz).fill(0);
    this.status = new Array(this.seg_sz).fill(false);
    this.parent = new Array(this.seg_sz).fill(-1);
    this.x = new Array(this.seg_sz).fill(0);
    this.y = new Array(this.seg_sz).fill(0);
  }

  reset() {
    for (var i = 0; i < this.seg_sz; i++) {
      this.status[i] = false;
    }
  }

  build() {
    var n_log = floor(Math.log2(n));

    if (Math.pow(2, n_log) != n) {
      n_log++;
    }

    var height_delta = floor((height * 0.9) / (n_log + 1));
    var width_delta = floor(width / n);

    for (var i = 0; i < n; i++) {
      this.tree[i + n] = v[i];
      this.x[i + n] = width_delta * (i + 0.5);
      this.y[i + n] = height_delta * (n_log + 1);
    }

    for (var i = n - 1; i > 0; i--) {
      this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
      this.x[i] = (this.x[2 * i] + this.x[2 * i + 1]) / 2;
      this.y[i] = this.y[2 * i] - height_delta;
      this.parent[2 * i] = i;
      this.parent[2 * i + 1] = i;
    }
  }

  query(l, r) {
    l += n;
    r += n + 1;
    var ans = 0;

    while (l < r) {
      if (l % 2 != 0) {
        this.status[l] = true;
        ans += this.tree[l];
        l++;
      }
      if (r % 2 != 0) {
        r--;
        this.status[r] = true;
        ans += this.tree[r];
      }
      l = floor(l / 2);
      r = floor(r / 2);
    }

    return ans;
  }

  update(pos, value) {
    pos += n;
    this.tree[pos] = value;
    this.status[pos] = true;
    pos = floor(pos / 2);

    while (pos > 0) {
      this.tree[pos] = this.tree[2 * pos] + this.tree[2 * pos + 1];
      this.status[pos] = true;
      pos = floor(pos / 2);
    }
  }

  draw_tree() {
    var l = new Array(this.seg_sz);
    var r = new Array(this.seg_sz);
    l[1] = 0;
    r[1] = n - 1;

    for (var i = 1; i < this.seg_sz; i++) {
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
      text(`[${l[i]}, ${r[i]}] Sum = ${this.tree[i]}`, this.x[i], this.y[i]);

      if (l[i] != r[i]) {
        var mid = floor((l[i] + r[i]) / 2);
        l[2 * i] = l[i];
        r[2 * i] = mid;
        l[2 * i + 1] = mid + 1;
        r[2 * i + 1] = r[i];
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
  seg.build();
}

function setup() {
  var canvas_sz = Math.pow(2, floor(Math.log2(n)));
  if (Math.pow(2, floor(Math.log2(n))) != n) {
    canvas_sz++;
  }
  createCanvas(canvas_sz * 112.5, canvas_sz * 62.5);
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
    var type = floor(random(2));

    if (!type) {
      var pos = floor(random(n));
      var value = floor(random(20));

      seg.reset();
      seg.update(pos, value);

      fill(color(255, 255, 0));
      noStroke();
      textAlign(CENTER);
      textSize(25);
      text(`Update(${pos}) = ${value}`, width / 2, 20);
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
  }

  seg.draw_tree();
}
