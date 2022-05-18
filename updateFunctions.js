function updateDensity(d) {
  d = parseFloat(d);
  density = d;
  drawSlopeFieldGlobal();
}

function updateSlopeInterval(i) {
  i = parseFloat(i);
  slopeInterval = i;
  drawSlopeFieldGlobal();
}

function updateLineLength(l) {
  l = parseFloat(l);
  lineLength = l;
  drawSlopeFieldGlobal();
}

function updateSlopeFunction(t) {
  fxy = (x,y) => {
    let s = {x:x,y:y};
    let func = math.parse(t).compile();
    return func.evaluate(s);
  }
}
