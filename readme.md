



为什么要使用Reflect？
Reflect 一般与 Proxy 配合使用，用来解决以下问题。

```
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
  }
});

console.log("proxy", proxy.name2);

```
在上面的案例中，如果直接target[key]，当我们访问proxy.name2的时候，返回值虽然没错，但是this的指向是obj，其中name2中的this.name就不会被进行依赖收集。
但是如果使用Reflect.get(target, key, receiver)，那么当访问proxy.name2的时候，this.name就会被劫持到并进行依赖收集。
