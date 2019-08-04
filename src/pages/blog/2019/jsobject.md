---
path: '/blog/2019/jsobject'
title: 'JavaScript里创建对象'
date: '2019-08-04'
---

对象是 JavaScript 里重要的知识点，梳理一下几种创建对象的方法。

常见的创建对象的方式，适合单个对象的创建

### Object 构造函数

```
const obj = new Object();
obj.key = value;
```

### 对象字面量

```
// 常用的方式，简洁
const obj = {
    key: value
};
```

以上方法虽然能创建对象，但是在创建多个时，会产生大量的重复代码，所以有产生了一些模式来创建对象

### 工厂模式

特点：利用函数来封装，以特定的接口创建对象的细节

```
function createPerson(name, age, job) {
    const res = new Object();
    res.name = name;
    res.age = age;
    res.job = job;
    res.sayName = function() {
        console.log(this.name);
    }
    return res;
}

const p1 = createPerson('Zed', 20, 'teacher');
```

缺点：无法知道对象的类型（无法使用 instanceof 来判断实例的类型）

### 构造函数

类似在 JavaScript 中存在原生的构造函数（Object、Array），我们可以利用自定义的构造函数来创建对象
特点：可以使用 instanceof 来判断实例类型

```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        console.log(this.name);
    }
}
const p1 = new person('Zed', 20, 'teacher');
```

关键点：new 操作符，需要了解 new 到底做了什么？

1. 创建一个对象
2. 设置该对象的原型（**proto**）为构造函数的原型
3. 绑定 this
4. 执行构造函数
5. 返回该对象

   代码实现如下：

```
function NewOperator(func) {
    const res = {};
    if(func.prototype) {
        res.__proto__ = func.prototype;
    }
    const ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
    if((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
        return ret;
    }
    return res;
}
```

缺点：实例上的每个方法都需要在生成时创建一遍

### 原型模式

由于每一个函数都有一个 prototype 属性，可以利用该属性来保存共享的属性和方法
特点： 所有的属性和方法都是共享的

```
function Person() {}
Person.prototype.name = 'Zed';
Person.prototype.age = 20;
Person.prototype.job = 'teacher';
Person.prototype.sayName = function() {
    console.log(this.name);
};
const p1 = new Person();
```

缺点： 省略了构造函数的初始化参数，共享的特性导致引用类型的属性很容易被污染（灾难级）；

### 组合模式

组合使用构造函数模式和原型模式，构造函数模式用于定义实例的属性，原型模式用于定义方法和共享的属性；
特点：集两种模式的长处为一体,使用广泛

```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
}

Person.prototype.sayName = function() {
    console.log(this.name);
};
const p1 = new Person('Tom', 29, 'Software Engineer');
```

### 动态原型模式

为什么会存在这种？其他 oo 的开发人员会对构造函数和原型产生困惑，所以产生了这种模式
特点：把所有信息都封装在构造函数里，在构造函数里面进行原型的初始化操作

```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    if(typeof this.sayName !== 'function') {
        Person.prototype.sayName = function() {
            console.log(this.sayName);
        };
    }
}
const p1 = new Person('Tom', 29, 'Software Engineer');
```

在构造函数里面将方法添加到原型上面，方法仅在第一次执行时绑定（需要理解 new 操作符）

### 寄生构造函数模式

在前面几种模式不适用的情况下使用
特点：工厂模式的实现+new 操作符

```
function Person(name, age, job) {
    var res = new Object();
    res.name = name;
    res.age = age;
    res.job = job;
    res.sayName = function() {
        console.log(this.name);
    };
    return res;
}
const p1 = new person('Tom', 20, 'worker');
```

缺点： 无法使用 instanceof 判断类型

### 稳妥构造函数模式

稳妥对象：没有公共属性，方法不引用 this；
特点：使用闭包，安全性高

```
function Person(name, age, job) {
    const res = new Object;
    // todo 设置一些私有变量和方法
    res.sayName = function() {
        console.log(name);
    };
    return res;
}
const p1 = new Person('Tom', 20, 'driver');
```
