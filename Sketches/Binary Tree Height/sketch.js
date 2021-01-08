function setup() {
  get_tree();
  createCanvas(787, 437);
  tree.build();
  tree.build_draw();
  st.push([0, 0]);
  max_depth = 0;
  frameRate(0.5);
}


function draw() {
  background(220);
  dfs();
  tree.draw_tree();
}
