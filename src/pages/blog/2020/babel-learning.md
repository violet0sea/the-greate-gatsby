---
path: '/blog/2020/babel-learning'
title: 'Babel 学习记录'
date: '2020-02-29'
---
原文：[Build your own React](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/user-handbook.md)


### Babel是什么？

Babel 是一个多用途的Javascript编译器。当你的项目配置了Babel，你可以尽情地使用Javascript 最新的语法和工具。此外，Babel 也可以做一些语法扩展的工作，比如在React 里支持JSX，通过FLow 来支持语法静态检查。更进一步的说，Babel 里的任何东西都是一个插件，你可以利用Babel 的能力，自己编写插件来实现任何你想要的功能。

到目前为止，Babel 已经分解成好几个核心模块（比如：babel-cli、babel-core、babel-register、babel-node）
 
### Babel核心模块
    
#### babel-cli
babel-cli是一个通过命令行编译js文件的工具
可以通过yarn 或者 npm 的方式全局安装

```
yarn global add babel-cli
```
全局安装仅仅是为了测试方便，一般都是安装在devDependencies里
直接痛过命令行编译 

```
babel index.js
```
这种方式只会在中断里呈现结果，如果需要输出结果到文件，需要添加--out-file 或者 -o 参数

```
babel index.js --out-file dest1.js
# or
babel index.js -o dest2.js
```
如果想把整个目录编译到一个新的目录下，可以使用--out-dir 或者 -d

```
babel src --out-dir dist1
# or
babel src -d dist2
```

**在项目里如何安装babel-cli**

```
yarn add babel-cli -D
```
可以在package.json文件里发现babel-cli依赖：

```
{
    "name": "my-project",
    "version": "1.0.0",
    "devDependencies": {
        "babel-cli": "^6.0.0"
    }
}
```
可以通过增加npm script 的方式来运行babel-cli：

```
{
    "name": "my-project",
    "version": "1.0.0",
+   "scripts": {
+       "build": "babel src -d lib"
+   },
    "devDependencies": {
        "babel-cli": "^6.0.0"
    }
}
```
运行下面的命令，可以得到编译后的文件：

```
yarn build
```

#### babel register
另外一种经常用来运行Babel 的方法是通过babel-registerbabel-register。只有通过require 引入的文件才能运行Babel。
需要注意的是，这种方式不适合在生产环境使用，应该在部署之前就把代码编译好；这种方式只适合本地开发。
使用方式如下：
创建一个index.js

```
console.log('Hello World');
```
如果直接通过node index.js 命令运行是不会通过Babel 编译的，所以需要babel-register
首先安装babel-register

```
yarn add babel-register -D
```

然后创建一个register.js文件
```
require('babel-register');
require('./index.js');
```
这样做是为了在Node 的模块系统里注册Babel，然后通过require 引入的文件就会被编译。
我们可以通过node register.js 命令来运行。

```
node register.js
```
注意：不可以在你想要编译的文件里注册Babel，因为node 会在Babel编译文件之前就执行。
```
require("babel-register");
// not compiled:
console.log("Hello world!");
```

#### babel node
如果你只想通过node 的命令行运行一些代码，如果想要集成Babel 的能力，可以使用babel-node CLI，
它仅仅是起到替换node cli 的作用。
同样的这种方式也不适合于生产环境，通过这种方式部署代码是糟糕的，更好的方式是在部署之前就把代码编译好；这种方式只适合本地开发。
babel-cli 自带babel-node，所以只需要安装babel-cli即可

```
yarn add babel-cli -D
```
然后替换package.json 文件里的scripts 命令

```
    {
        "scripts": {
        -     "script-name": "node script.js"
        +     "script-name": "babel-node script.js"
        }
    }
```
如果没有全局安装babel-cli的话，想要在命令行直接执行babel-node script.js 是不行的，但是可以通过如下命令：
```
./node_modules/.bin/babel-node ./script.js
```
最好还是同scripts 的方式执行，简单快捷。

#### babel-core
如果想使用Babel 来编写程序，可以通过安装babel-core 来实现
首先是安装依赖：
```
yarn add babel-core
```

可以调用babel.transform方法来操作一个string
```
var babel = require("babel-core");

babel.transform("code();", options);
// => { code, map, ast }
```
此外还可以直接转换文件和AST，babel.transformFile | babel.transformFileSync | babel.transformFromAst

### Babel 配置
仅仅利用babel 做上面的事情看起来什么都没有变化，出现这种现象的原因是我们并没有告诉babel 应该怎么做。
>Since Babel is a general purpose compiler that gets used in a myriad of different ways, it doesn't do anything by default. You have to explicitly tell Babel what it should be doing.
如果想要指导babel 该如何工作，你需要安装plugins 和presets。

#### .babelrc
在告诉babel 应该做什么之前，我们需要创建一个配置文件；你需要做的事情就是在根目录下创建一个名字叫做.babelrc 的文件，内容如下：
```
{
    "presets": [],
    "plugins": [],
}
```
通过配置相应的参数，就可以告诉babel 该做什么；
其实还有其他的配置方式（比如通过往scripts 命令后面增加参数的形式），但是配置文件是最便捷的方式。

babel-preset 都是相对较久的版本里使用的方式，但是使用方式和原理基本相似
#### babel-preset-es2015
让我们从头开始，让es2015 的代码编译成ES5 的版本，首先安装es2015 的Babel preset
```
yarn add babel-preset-es2015 -D
```
新版本使用 @babel/preset-env，直接编译es2015+

然后在.babelrc 文件里配置：
```
{
    "presets": [
        "es2015", // 旧的方式
        //"@babel/env", // 新的方式，
    ],
    "plugins": [],
}
```


#### babel-preset-react
使用react开发项目需要安装此插件

```
yarn add babel-preset-react -D
```
新版本使用 @babel/preset-react
然后在.babelrc 文件里配置：
```
{
    "presets": [
        "es2015",
        "react", // 旧的方式
        // "@babel/preset-react" // 新的方式
    ],
    "plugins": [],
}
```

#### babel-preset-stage-x
支持JS TC39提案里的功能，分别有对应提案的4个阶段：
* babel-preset-stage-0
* babel-preset-stage-1
* babel-preset-stage-2
* babel-preset-stage-3
babel 7版本已经废弃了这种使用方式

```
yarn add  babel-preset-stage-2 -D
```
{
    "presets": [
        "es2015",
        "react",
        "stage-2"
    ],
    "plugins": []
}

### 执行Babel 生成的代码
虽然通过以上的方式用Babel 编译了代码，但这远远没有结束。

#### babel-polyfill
虽然未来的JS语法都可以通过Babel 编译，但是API 却不可以。
例如，我们希望下面带有尖头函数的代码能够被编译：
```
function addAll() {
    return Array.from(arguments).reduce((a, b) => a + b);
}
```
期望的结果是：
```
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```
但是，这并不会生效，因为Array.from 在javascript 环境并不存在。

> Uncaught TypeError: Array.from is not a function

解决问题的方法是使用Polyfill，Polyfill 是一小断的代码，它可以用来复制运行时不存在的api(浏览器缺失对应的api)；
Babel 使用core-js 作为它的Polyfill 方案
使用方式：
```
yarn add babel-polyfill
```
需要注意的是添加到了dependencies里，需要在运行时调用相关的api；
引入方式很简单，在文件头部引入即可
```
import "babel-polyfill";
```

#### babel-runtime
为了实现ECMAScript 规范的细节，Babel 会使用一些helper 方法，目的是保证生成的代码整洁。
由于这些helper 方法可能会变得很长，在每一处需要引用的地方都会增加在文件的顶部，从而造成文件的冗余；所以可以把它们单独放入一个runtime。
使用时需要安装babel-plugin-transform-runtime 和 babel-runtime
```
yarn add babel-plugin-transform-runtime -D
yarn add babel-runtime
```
接下来需要更新.babelrc
```
{
    "plugins": [
        "transform-runtime",
        "transform-es2015-classes"
    ]
}
```

### 配置Babel(进阶)
大多数人可以仅仅依靠一些内置的插件来使用Babel，但是Babel 提供了更加细化的功能。

#### 手动指定插件
Babel的preset 只是所有预置插件的集合，如果你想做一些特殊事情，你可以手动指定插件；这样做和presets的效果没有太大的区别。

首先安装插件
```
yarn add babel-plugin-transform-es2015-classes -D
```
然后在.babelrc 里加入插件
```
{
   "plugins": [
        "transform-es2015-classes"
    ]
}
```
这样做可以针对特定的转化有更加细化的控制。
官方的plugin 列表： [plugins](https://babeljs.io/docs/en/plugins/)
如果想要学习自己实现一个Babel Plugin，可以参考 [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)

#### plugin 配置项
许多插件提供了配置参数的功能，这样做可以使他们的有尽可能多的表现形式。例如，许多插件都提供了 loose 模式，这种模式会舍弃一些规范，从而使得代码具备简洁，高性能。
想要添加配置项，仅需要像下面这样做：
```
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

#### 根据环境信息配置Babel
Babel 的插件完成了很多不同的任务；其中，很多都是开发环境的工具，可以帮助你debug 代码或者和其他工具集成。当然也有很多工具是为了优化生产环境代码而开发的。因为这个原因，想要根据环境来配置Babel，你可以很轻易对.babelrc 做如下改动：
```
{
    "presets": ["es2015"],
    "plugins": [],
    "env": {
        "development": {
            plugins: [],
        },
        "production": {
            plugins: [],
        },
    },
}
```
Babel 会根据当前环境的env 来决定使用哪种配置。
当前环境的env 会使用process.env.BABEL_ENV 来取值，当BABEL_ENV 不存在时，会根据NODE_ENV 来取值，如果都不存在的话会默认为development。

**Unix**
```
BABEL_ENV=production [COMMAND]
NODE_ENV=production [COMMAND]
```
**windows**
```
SET BABEL_ENV=production
[COMMAND]
```
> [COMMAND] 是任何你运行Babel 的命令（比如， babel，babel-nodebabel-node，或者是node当你使用了register方法）；webpack的项目一般使用npm run [script-name]
> 如果想要跨unix 和windows 一起使用command 命令，可以使用[cross-env](https://www.npmjs.com/package/cross-env)

#### 配置属于你的preset
如果你拥有很多项目的话，手动配置插件、插件配置项、环境配置项，这些配置任务都是重复性的工作。由于这个原因，我们鼓励社区创建属于自己的preset；这个preset 可以是为了运行特定版本的node，也可以适用于整个公司的preset。
创建一个preset 其实很简单，假如你又如下的信息在.babelrc 文件里：
```
{
  "presets": [
    "es2015",
    "react"
  ],
  "plugins": [
    "transform-flow-strip-types"
  ]
}
```

你所要做的仅仅是创建一个新的工程遵从babel-preset-*（请务必认真负责的命名），然后创建两个文件：
首先，创建一个package.json 文件，为你的preset 添加必要的dependencies字段
```
{
  "name": "babel-preset-own",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "babel-preset-es2015": "^6.3.13",
    "babel-preset-react": "^6.3.13",
    "babel-plugin-transform-flow-strip-types": "^6.3.15"
  },
  "license": "MIT"
}
```
然后，创建一个index.js 文件，导出.babelrc的配置内容：
```
module.exports = {
    presets: [
        require("babel-preset-es2015"),
        require("babel-preset-react"),
    ],
    plugins: [
        require("babel-plugin-transform-flow-strip-types"),
    ],
};
```
然后通过npm 发布，然后你就可以像以前一样使用了。
### Babel 和其他工具
一旦你掌握了Babel 的窍门，使用Babel 是很简单而又直接的，但是与其他工具配合起来使用却是很难指导的。

#### 静态分析工具
新的标准为JS引入新的语法，静态分析工具也开始利用这些特性

#### Linting
最受欢迎的linting 工具便是es-lint，因此官方写了babel-eslint 的集成工具；
首先需要安装eslint 和 babel-eslint
```
yarn add eslint babel-eslint -D
```
然后修改.eslintrc 文件，设置parser 字段的值为babel-eslint
```
{
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
}
```
接下来，在package.json 文件里添加一个lint 命令：
```
{
    "name": "my-module",
    "scripts": {
+     "lint": "eslint my-files.js"
    },
    "devDependencies": {
      "babel-eslint": "...",
      "eslint": "..."
    }
}
```
最后，在命令行执行：
```
yarn lint
```

剩余工具不怎么常用，略过...

