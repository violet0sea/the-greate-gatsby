---
path: '/blog/2019/this'
title: '理解Javascript中的this'
date: '2019-08-12'
---

this不是在定义时绑定的，而是在运行时绑定；它的指向完全取决于call-site,
call-site是指函数调用的位置。
> this is not an author-time binding but a runtime binding. It is contextual based on the conditions of the function's invocation. this binding has nothing to do with where a function is declared, but has instead everything to do with the manner in which the function is called.

> When a function is invoked, an activation record, otherwise known as an execution context, is created. This record contains information about where the function was called from (the call-stack), how the function was invoked, what parameters were passed, etc. One of the properties of this record is the this reference which will be used for the duration of that function's execution.

在JavaScript中，存在5种this指向的规则
### 默认绑定
当函数单独调用时，严格模式下this指向undefined，非严格模式下指向global，浏览器环境下是window
```
var a = 100; // 声明的全局变量同时也是global（window）的一个属性
function foo() {
  console.log(this.a); // 严格模式下会报错 can not read property of undefined
}

foo();
```
### 隐式绑定
当函数作为对象的方法调用时，此时函数有一个context-object，this指向是该对象。

```
var a = 100;
function foo() {
  console.log(this.a);
}

var obj = {
  a: 1,
  foo
};

obj.foo(); //  call-site调用时使用obj来引用函数
var obj2 = {
  a: 2,
  foo
};

var obj1 = {
  a: 3,
  obj2,
}

obj1.obj2.foo();
```

#### 引用丢失
在一些情况下存在隐式绑定丢失绑定的情况，通常发生在将对象的方法赋值给一个变量或者是将对象的方法作为参数传递给某个函数，虽然指向的还是同一个函数，但是这个时候调用变量去执行函数时采取的是默认绑定规则
```
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo
};

var a = 100;
var bar = obj.foo; // 仅仅是一个函数引用
bar()
```
由于引用丢失的问题常常发生，导致代码逻辑不由自己控制，所以需要引入一种方式来解决，接下来：

### 显示绑定
在函数执行时，直接绑定一个对象到this；通过call、apply、bind实现
```
function foo() {
  console.log(this.a);
}

var obj = {
  a: 1
};

foo.call(obj);
```
问题：显示绑定依然无法解决引用丢失，所以引申出了硬绑定
```
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  bar
};
var bar = function() {
  foo.call(obj); // call-site时绑定this为obj
};

bar(); // 2
setTimeout(bar, 100); // 2
bar.call(window); // 2
```
通常这种方式还需要传递参数或者返回结果，所以演变出了一个bind方法，简单的实现

```
function bind(fun, context) {
  return function() {
    fun.apply(context, arguments);
  };
}
```
后来es5里直接提供了内置的bind方法，下面是仿写一个bind方法
```
Function.prototype.prototype.bind = function(context) {
    const func = this;
    const args = Array.prototype.slice.call(arguments, 1); // bind实际上是一个loose curry，可以先接收一部分参数
    function Noop() {}
    const boundFn = function() {
        const nextArgs = Array.prototype.slice.call(arguments); // 后续接收另一部分参数
        return func.apply(this instanceof boundFn ? this : context, args.concat(nextArgs));
    };
    Noop.prototype = func.prototype;
    boundFn.prototype = new Noop();
    return boundFn;
}
```

### new绑定
JavaScript里使用构造函数创建的对象，函数内部的this指向构造函数生成的实例对象。

关键点：new 操作符，需要了解 new 到底做了什么？

1. 创建一个对象
2. 设置该对象的原型（**proto**）为构造函数的原型
3. 绑定 this
4. 执行构造函数
5. 返回该对象

>  there's really no such thing as "constructor functions", but rather construction calls of functions

   代码实现如下：

```
function NewOperator(func) {
    const res = {};
    if(func.prototype) {
        res =  Object.create(func.prototype);
    }
    const ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
    // 构造函数返回一个对象的话就使用该对象作为返回值
    if(ret instanceof Object) {
        return ret;
    }
    return res;
}
## 设置原型有三种方式
obj.__proto__ = func.prototype; 性能不好
Object.setPrototypeof(obj, func.prototype); 依然性能不佳
obj = Object.create(func.prototype);
```
注意：JavaScript里有许多内置的构造函数：Number、String、Array...；使用new和不使用new差别很大
```
var a = Number(100);
typeof a // number
var b = new Numer(100);
typeof b // object
```
### 箭头函数
箭头函数的this绑定在其当前（存在）的环境中，lexical binding
```
function foo() {
	return (a) => {
		console.log( this.a );
	};
}

var obj1 = {
	a: 2
};

var obj2 = {
	a: 3
};

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2
```

### 绑定的优先级
1. 默认绑定有限级最低
2. 显示绑定优先级高于隐式绑定
```
function foo() {
  console.log(this.a);
}

var obj1 = {
  a: 1,
  foo
};

var obj2 = {
  a: 2,
  foo
};

obj1.foo.call(obj2) // 2
obj2.foo.call(obj1) // 1
```
3. new绑定优先级高于隐式绑定
4. new绑定优先级高于显示绑定(bind)
```
function foo(val) {
  this.a = val;
}

var obj1 = {
  foo
};

var obj2 = {

};


obj1.foo(2);
console.log(obj1.a); // 2

obj1.foo.call(obj2, 3)
console.log(obj2.a); // 3
var bound = obj1.foo.bind(obj2,1)
var baz = new bound();
console.log(baz.a); // 1

var bar = new obj1.foo(4);
console.log(bar.a) // 4
console.log(obj1.a) // 2
```

### 例外
1. 显示绑定时忽略this, 传入*undefined* 或者 *null*
```
function foo() {
  console.log(this.a);
}

var a = 2;
foo.call(null); // 2
foo.apply(null); // 2
foo.bind(null)(); // 2
```
2. 对象方法赋值时
```
function() {
  console.log(this.a);
}

var a = 2;
var o = {
  a: 3,
  foo
};

var p = {
  a: 4
};
o.foo();
(p.foo = o.foo)() // 2
```
赋值表达式的值foo函数，此处实际上是执行foo();

### 软绑定
```
Function.prototype.softBind = function(obj) {
  const fun = this;
  const prevArgs = Array.prototype.slice.call(arguments, 1);
  const bound = function() {
    return fun.apply(
        (!this
          || (typeof window !== "undefined" && this === window)
          || (typeof global !== "undefined" && this === global))
        ? obj
        : this,
        prevArgs.concat.apply(prevArgs, arguments)
    );
  };
  bound.prototype = Object.create(fun.prototype);
  return bound;
}
```