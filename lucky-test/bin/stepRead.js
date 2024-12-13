function stepRead(callback) {
  const input = process.stdin;
  const output = process.stdout;
  let line = "";

  emitKeypressEvents(input);
}

function emitKeypressEvents(stream) {
  const g = emitKeys(stream);
  g.next();

  stream.on("data", (chunk) => {
    for (let i = 0; i < chunk.length; i++) {
      g.next(chunk[i]);
    }
  });
}

function* emitKeys(stream) {
  let i = 0;
  while (true) {
    const key = yield;
    stream.emit("keypress", key, {
      name: key,
      sequence: key,
      ctrl: false,
      meta: false,
      shift: false,
    });
    // console.log(key, "key");
    // if (key === "\u0003") {
    //   process.exit();
    // }
    // if (key === "\u0004") {
    //   process.exit();
    // }
    // if (key === "\u007f") {
    //   stream.emit("backspace");
    // }
    // if (key === "\r") {
    //   stream.emit("return");
    // }
    // if (key === "\u001b") {
    //   stream.emit("escape");
    // }
  }
}

stepRead();
