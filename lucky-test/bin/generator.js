function* g() {
  console.log("red");
  let ch = yield; // 执行到这里，会暂停，等待next方法传入的参数，然后赋值给ch
  console.log(ch);
}

function* g1() {
  console.log("blue");
}

const f = g();
console.log(f); // 返回一个generator对象

f.next();
f.next("a");
