const config = {
  W: 4,
  H: 4,
  isGoal: false,
  isMove: false
}

var map, eDOM, count;
count = 0;

function shuffle() {
  map = [];
  var nmap = [];
  for (i = 0; i < config.H * config.W; i++) {
    if (i + 1 == config.H * config.W) {
      nmap.push(0);
    } else {
      nmap.push(i + 1);
    }
  }
  // これだと解けないパターンもあり得る
  // for (i = nmap.length - 1; i > 0; i--) {
  //   var r = Math.floor(Math.random() * (i + 1));
  //   var tmp = nmap[i];
  //   nmap[i] = nmap[r];
  //   nmap[r] = tmp;
  // }
  for (i = 0; i < config.H; i++) {
    var row = [];
    for (j = 0; j < config.W; j++) {
      row.push(nmap[i * config.W + j]);
    }
    map.push(row);
  }
  var py, px;
  py = config.H - 1;
  px = config.W - 1;
  for (i = 0; i < Math.pow(config.H * config.W, 2); i++) {
    var dmap = [];
    if (px - 1 >= 0) dmap.push("l");
    if (py - 1 >= 0) dmap.push("t");
    if (px + 1 < config.W) dmap.push("r");
    if (py + 1 < config.H) dmap.push("b");
    var v = Math.round(Math.random() * (dmap.length));
    if (dmap[v] == "l") {
      // 左
      if (px - 1 >= 0) {
        var t = map[py][px - 1];
        map[py][px - 1] = 0;
        map[py][px] = t;
        px = px - 1;
      }
    } else if (dmap[v] == "t") {
      // 上
      if (py - 1 >= 0) {
        var t = map[py - 1][px];
        map[py - 1][px] = 0;
        map[py][px] = t;
        py = py - 1;
      }
    } else if (dmap[v] == "r") {
      // 右
      if (px + 1 < config.W) {
        var t = map[py][px + 1];
        map[py][px + 1] = 0;
        map[py][px] = t;
        px = px + 1;
      }
    } else if (dmap[v] == "b") {
      // 下
      if (py + 1 < config.H) {
        var t = map[py + 1][px];
        map[py + 1][px] = 0;
        map[py][px] = t;
        py = py + 1;
      }
    }
  }
  console.log(map);
}

function init() {
  shuffle();
  // console.log(isFinish(), map);
  var gameDOM = document.getElementById("game");
  gameDOM.style.fontSize = "1em";
  gameDOM.style.boxSizing = "border-box";
  var div = document.getElementById("stage");
  div.style.width = `${config.W * 2}em`;
  div.style.height = `${config.H * 2}em`;
  div.style.border = "1px solid black";
  div.style.fontSize = "2em";
  div.style.position = "relative";
  div.style.margin = "auto";
  for (y = 0; y < config.H; y++) {
    for (x = 0; x < config.W; x++) {
      var elm = document.createElement("span");
      if (map[y][x] === 0) {
        eDOM = elm;
      }
      elm.style.position = "absolute";
      elm.style.textAlign = "center";
      elm.innerText = map[y][x] == 0 ? "" : map[y][x];
      elm.style.left = `${x * 2}em`;
      elm.style.top = `${y * 2}em`;
      elm.style.width = `2em`;
      elm.style.backgroundColor = "white";
      elm.style.height = `2em`;
      elm.style.lineHeight = "2em";
      elm.style.border = "1px solid #ccc";
      elm.style.borderCollapse = "collapse";
      elm.style.borderSpacing = "0";
      elm.style.cursor = "pointer";
      elm.style.boxSizing = "border-box";
      elm.dataset.y = y;
      elm.dataset.x = x;
      elm.dataset.left = x * 2;
      elm.dataset.top = y * 2;
      elm.style.zIndex = 1;
      elm.dataset.tid = "";
      elm.onclick = (e) => {
        if (config.isMove) return;
        move(e.currentTarget);
      }
      div.appendChild(elm);
    }
  }
}
init();

function nextPos(y, x) {
  var result = { validate: false, y: y, x: x, dl: 0, dt: 0 };
  // 上
  if (y - 1 >= 0 && map[y - 1][x] === 0) {
    result.validate = true;
    result.y = y - 1;
    result.dt = -1;
  }
  // // 右上
  // else if (y - 1 >= 0 && x + 1 < config.W && map[y - 1][x + 1] === 0) {
  //   result.validate = true;
  //   result.y = y - 1;
  //   result.x = x + 1;
  //   result.dt = -1;
  //   result.dl = 1;
  // }
  // 右
  else if (x + 1 < config.W && map[y][x + 1] === 0) {
    result.validate = true;
    result.x = x + 1;
    result.dl = 1;
  }
  // // 右下
  // else if (y + 1 < config.H && x + 1 < config.W && map[y + 1][x + 1] === 0) {
  //   result.validate = true;
  //   result.y = y + 1;
  //   result.x = x + 1;
  //   result.dt = 1;
  //   result.dl = 1;
  // }
  // 下
  else if (y + 1 < config.H && map[y + 1][x] === 0) {
    result.validate = true;
    result.y = y + 1;
    result.dt = 1;
  }
  // // 左下
  // else if (x - 1 >= 0 && y + 1 < config.H && map[y + 1][x] === 0) {
  //   result.validate = true;
  //   result.y = y + 1;
  //   result.dt = 1;
  //   result.x = x - 1;
  //   result.dl = -1;
  // }
  // 左
  else if (x - 1 >= 0 && map[y][x - 1] === 0) {
    result.validate = true;
    result.x = x - 1;
    result.dl = -1;
  }
  // // 左上
  // else if (y + 1 < config.H && x - 1 >= 0 && map[y + 1][x - 1] === 0) {
  //   result.validate = true;
  //   result.y = y + 1;
  //   result.x = x - 1;
  //   result.dt = 1;
  //   result.dl = -1;
  // }
  return result;
}


function move(target) {
  var sl = parseInt(target.dataset.left);
  var st = parseInt(target.dataset.top);
  var c = target;
  // console.log(0, map);
  var r = nextPos(parseInt(c.dataset.y), parseInt(c.dataset.x));
  // console.log(r);
  if (!r.validate) return;
  config.isMove = true;
  c.style.zIndex = 2;
  eDOM.style.display = "none";
  eDOM.style.left = c.style.left;
  eDOM.style.top = c.style.top;
  tmp = map[c.dataset.y][c.dataset.x];
  map[c.dataset.y][c.dataset.x] = map[r.y][r.x];
  map[r.y][r.x] = tmp;
  eDOM.dataset.y = parseInt(c.dataset.y);
  eDOM.dataset.x = parseInt(c.dataset.x);
  c.dataset.y = r.y;
  c.dataset.x = r.x;
  eDOM.dataset.top = c.dataset.top;
  eDOM.dataset.left = c.dataset.left;

  var f = 0;
  if (c.dataset.tid == "") {
    // console.log(1, map);
    c.dataset.tid = setInterval(() => {
      f++;
      if (f >= 100) {
        clearInterval(c.dataset.tid);
        c.style.zIndex = 1;
        c.dataset.tid = "";
        eDOM.style.display = "block";
        if (isFinish() && !config.isGoal) {
          config.isGoal = true;
          setTimeout(() => {
            alert("GOAL!!");
          }, 500);
        }
        config.isMove = false;
        count++;
        var cc = document.getElementById("counter");
        cc.innerText = count;
      }
      c.style.left = (sl + 2 * f / 100 * r.dl) + "em";
      c.style.top = (st + 2 * f / 100 * r.dt) + "em";
      c.dataset.left = (sl + 2 * f / 100 * r.dl);
      c.dataset.top = (st + 2 * f / 100 * r.dt);
    }, 1);
    return;
  }
}

function isFinish() {
  var validate = true;
  for (i = 0; i < map.length && validate; i++) {
    for (j = 0; j < map[i].length; j++) {
      if (i == map.length - 1 && j == map.length - 1) continue;
      if (map[i][j] != i * config.H + j + 1) {
        validate = false;
        break;
      }
    }
  }
  return validate;
}