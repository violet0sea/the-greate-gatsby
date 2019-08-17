---
path: '/blog/2019/object-immutable'
title: 'JavaScript里实现对象不可变'
date: '2019-08-13'
---

在某些场合下需要JS生成的对象不可变，【不可变】这里不单单指对象属性值不可变，也包含属性不可删除，不可以新增属性；具体需要哪一种得根据实际情况判断。整理4种相关的方法如下：

### Object.defineProperty
设置对象属性的writable:false & configurable: false，可以使该属性无法修改，无法删除；
```
var obj = {};

Object.defineProperty(obj, 'a', {
    value: 1,
    writable: false,
    configurable: false
});
```
注意： 如果只是不可以修改，能删除，可以设置configurable为true

### Object.preventExtensions
创建一个无法被扩展的对象，即不允许新增属性到对象
```
var obj = {
    a: 1
};

Object.preventExtensions(obj);

obj.b = 2; // 无法新增，严格模式下会报错
obj.a = 3; // 可以修改
delete obj.a; // 可以删除
```

### Object.seal
创建一个密封的对象，即拥有无法被扩展的属性，同时属性的configurable为false
```
var obj = {
    a: 1
};
Object.seal(obj);

obj.a = 2; // 可以修改
delete obj.a; // 无法删除
```

### Object.freeze
创建一个冻结的对象，具有最严苛的不可变特性，不仅具备seal的特性，而且属性的writable为false
```
var obj = {
    a: 1,
    b: {
        c: 1
    }
};
Object.freeze(obj);

obj.a = 2; // 不可以修改
delete obj.a; // 无法删除
obj.b.c = 2; // 可以修改,仅仅是浅层冻结
```
