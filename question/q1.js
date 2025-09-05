const obj = {
  name: "zhangsan",
  get name2() {
    console.log("this", this);
    return this.name + "2";
  },
};

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log("get", key);
    return Reflect.get(target, key, receiver);
    // return target[key];
  },
  set(target, key, value, receiver) {
    console.log("set", key, value);
    return Reflect.set(target, key, value, receiver);
  },
});

console.log("proxy", proxy.name2);
