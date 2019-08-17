---
path: '/blog/2019/jsinherit'
title: 'JavaScript里的继承'
date: '2019-08-04'
---

继承是 JavaScript 里重要的知识点。

### 基本思想

> 利用原型让一个引用类型继承另一个引用类型的属性和方法

#### 原型链继承

```
function Animal() {
    this.property = 'property';
}

Animal.prototype.getProperty = function() {
    console.log(this.property);
};

function Cat() {
    this.sound = 'meow';
}

// Cat继承Animal时通过创建Animal的实例实现
Cat.prototype = new Animal(); // 此处会导致默认的Cat.prototype.constructor消失
Cat.prototype.getsound = function() {
    console.log(this.sound);
};

var nimo = new Cat();
console.log(nimo.getProperty());
```

#### 确定原型和实例的关系

1. instanceof
2. isPrototypeof()

```
nimo instanceof Cat // true
nimo instanceof Animal // true
nimo instanceof Object // true

Cat.prototype.isPrototypeOf(nimo) // true
Animal.prototype.isPrototypeOf(nimo) // true
Object.prototype.isPrototypeOf(nimo) // true
```

#### 缺点

当原型链包含引用类型值时，值的变化会影响到所有的实例
在创建子类的实例时，不能向超类的构造函数传递参数

### 构造函数继承

为了解决原型中包含引用类型值时所带来的影响；通过在子类型构造函数内部调用超类型构造函数来实现。

```
function Animal(species) {
    this.species = species;
    this.hobits = ['eat', 'sleep', 'play'];
}

function Cat() {
    Animal.call(this, 'cat');
    // todo 调用之后在添加子类实例的属性
}

const nimo = new Cat();
nimo.hobits.push('meow');
console.log(nimo.hobits);

const niya = new Cat();
console.log(niya.hobits);

```

此外还有一个好处，可以向父类构造函数传递参数

#### 缺点

构造函数的方法都是在函数内部定义，无法实现函数复用

### 组合继承

将原型链和构造函数的技术组合到一块，使用原型链实现对原型属性和方法的继承，通过构造函数来实现对实例属性的继承；

```
function Animal(species) {
    this.species = species;
    this.hobits = ['eat', 'sleep', 'play'];
}
Animal.prototype.getSpecies = function() {
    console.log(this.species);
};

function Cat(species, name) {
    Animal.call(this, species);
    this.name = name;
}

Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
Cat.prototype.sayName = function() {
    console.log(this.name);
};

const nimo = new Cat('Cat', 'nimo');
nimo.hobits.push('meow');
console.log(nimo.hobits);
nimo.getSpecies();
nimo.sayName();

const niya = new Cat('Cat', 'niya');
console.log(niya.hobits);
niya.getSpecies();
niya.sayName();
```

#### 缺点

父类构造函数执行两遍，子类实例和其原型上会存在相同的属性，虽然修改同属性的子类值，不会影响原型，但原型上的属性其实是没有必要的。

### 原型式继承

借助原型可以基于已有的对象创建新对象，同时不必因此创建自定义类型

```
function object(o) {
    function Noop(){}
    Noop.prototype = o;
    return new Noop();
}

const animal = {
    property: 'some property',
    hobits: ['eat', 'sleep', 'play']
};

const nimo = object(animal);
nimo.name = 'nimo'
nimo.hobits.push('meow'); // 引用类型受影响
console.log(nimo.name, nimo.hobits);

const niya = object(animal);
console.log(niya.name, niya.hobits);
```

es5 规范了原型式继承，使用 Object.create()方法，与 object 函数类似，行为是浅复制。

缺点：引用类型的属性会造成属性共享的问题，

### 寄生式继承

与原型式继承紧密相关，创建一个仅用于封装继承的过程的函数，函数内部通过某种方式来实现增强对象。

```
function parasitic(o) {
    const clone = Object.create(o) // 使用原型式继承函数object也可以
    clone.sayHi = function() {
        console.log('Hi');
    }

    return clone;
}

const animal = {
    property: 'some property',
    hobits: ['eat', 'sleep', 'play']
};

const nimo = parasitic(animal);
console.log(nimo.sayHi);
```

缺点：共享属性的问题，封装过程中的函数无法复用

### 寄生式组合继承

使用组合继承+寄生式继承

```
function inheritProperty(child, farther) {
    const prototype = Object.create(farther.prototype);
    prototype.constructor = child;
    child.prototype = prototype;
}

function Animal(species) {
    this.species = species;
    this.hobits = ['eat', 'sleep', 'play'];
}
Animal.prototype.getSpecies = function() {
    console.log(this.species);
};

function Cat(species, name) {
    Animal.call(this, species);
    this.name = name;
}

inheritProperty(Cat, Animal);
Cat.prototype.sayName = function() {
    console.log(this.name);
};

const nimo = new Cat('Cat', 'nimo');
nimo.hobits.push('meow');
console.log(nimo.hobits);
nimo.getSpecies();
nimo.sayName();

const niya = new Cat('Cat', 'niya');
console.log(niya.hobits);
niya.getSpecies();
niya.sayName();
```

只调用一次构造函数，避免了在子类 property 上创建不必要的属性。
