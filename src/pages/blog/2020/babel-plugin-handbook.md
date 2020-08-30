---
path: '/blog/2020/babel-plugin-handbook'
title: 'Babel插件手册'
date: '2020-03-07'
---
原文：[babel-plugin-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-introduction)

这片文章涵盖了如何创建Babel plugins

### 介绍
Babel 是一个多用途的通用JavaScript 编译器；更进一步的讲，它是一系列模块的集合，可以用于不同形式的静态分析(static analysis)。
> 静态分析是一个不需要执行代码就可以分析代码的过程；（在执行代码的过程中分析也被成为动态分析）静态分析的目的很多，可以用于代码格式化、代码编译、代码高亮、代码转化、代码优化、代码压缩等等。

你可以使用Babel 构建不同用途的工具，帮助你写出更加优美、高效的代码。

### 基础
Babel 是 javascript的一个编译器(compiler)，一个专门的源文件到源文件的编译器，通常也叫做 "transpiler"，这意味着你给Babel 一段代码，Babel 对其进行了修改，然后生成新的代码返回给你。

#### ASTs
上面的处理步骤中涉及了创建和编辑Abstract Syntax Tree，或者叫做AST

> Babel 使用的AST 是从[ESTree](https://github.com/estree/estree) 修改而来，其中的规范都位于[这里](https://github.com/babel/babylon/blob/master/ast/spec.md)

```
function square(n) {
    return n * n;
}
```
上面的代码通过AST 转化可以呈现为：
```
- FunctionDeclaration:
  - id:
    - Identifier:
      - name: square
  - params [1]
    - Identifier
      - name: n
  - body:
    - BlockStatement
      - body [1]
        - ReturnStatement
          - argument
            - BinaryExpression
              - operator: *
              - left
                - Identifier
                  - name: n
              - right
                - Identifier
                  - name: n
```
或者以JavaScript 对象的形式呈现：
```
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```
你可能注意到了每一层级的AST 都有相似的结构：
```
{
  type: "FunctionDeclaration",
  id: {...},
  params: [...],
  body: {...}
}
```

```
{
  type: "Identifier",
  name: ...
}
```

```
{
  type: "BinaryExpression",
  operator: ...,
  left: {...},
  right: {...}
}
```
> 注意：为了简单起见，一部分属性被移除了。

每一个区块都被称作一个节点（Node），一个AST 可以是一个单一的节点，也可以由成百上千的节点组合而成；两者相结合，就可以描述一段程序的语法，也就可以被用作静态分析。

每一个节点都有这样的一个接口（interface）：
```
interface Node {
    type: string;
}
```
type 字段是一个字符串，代表节点对象的类型（比如："FUnctionDeclaration"、"Identifier"或者"BinaryExpression"）；每一个类型的节点还会定义一些额外的字段来表示这个特定的类型节点。

对于Babel 生成的节点来说，这里有一些额外的字段来描述代码在源文件的位置信息。
```
{
  type: ...,
  start: 0,
  end: 38,
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 3,
      column: 1
    }
  },
  ...
}
```
start, end, loc 属性会在每一个node 里存在。

#### Babel 编译的阶段
Babel 编译有三个重要的阶段：解析（parse）、转换（transform）、生成（generate）

**解析**  
解析阶段，利用代码生成AST，在Babel 中有解析阶段有两个重要的阶段：词法分析（Lexical Analysis）和语法分析（Syntax Analysis）

**词法解析**  
词法解析会接受一个字符串形式的代码，输出一个tokens 流；可以把tokens 看作是一系列平行的代码片段组成的数组。
```
n * n;
```
```
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
  ...
]
```
这里的每一个 type 字段都有很多的属性用来描述这个token。
```
{
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  ...
}
```
和AST 的节点一样，同样存在start，end，loc。

**语法分析**  
语法分析会将tokens 流解析，以AST 的形式呈现出来；使用tokens 中的一些信息，这个阶段会生成AST，AST 会以更加简单的方式呈现出代码的结构，这样方便后续的操作。

**转换**  
转换阶段会对AST 进行遍历，在遍历的时候可以增加，修改，删除节点。到目前为，这一阶段对Babel 乃至任何编译器来说都是最复杂的阶段，这一阶段也是Babel 插件运行的时期，同时本书的主旨也是在这一块，所以现在不会过多的讲述。

**生成**  
生成阶段会拿到修改后的AST，生成字符串形式的代码，同时也生成了source map。  
代码生成十分简单：采用深度优先的规则遍历AST，构建出转换后的代码字符串。

#### 遍历
当你想要遍历一个AST 时，你需要递归的遍历这个树。  
假如我们有一个类型是 *FunctionDeclaration* 的节点，它有一些属性：*id*，*params*，*body*，这些属性同样有嵌套的节点。
```
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```
所以我们从*FunctionDeclaration*节点开始，按照顺序遍历它的每一个属性以及每一个属性的children节点
。  
然后我们进入到*id*节点，它的类型是*Identifier*。*Identifier*节点没有child 节点，所以我们继续到下一个节点。  
在这之后是*params*节点，这是一个由节点构成的数组，所以我们需要访问每一个成员。但是上面的示例中只有一个节点，并且它是一个*Identifier*类型的节点，所以可以继续到遍历下一个节点。  
然后遇见的节点是*body*，它的类型是*BlockStatement*；这个节点也有一个*body*节点，它是由一系列节点构成的数组，我们需要访问其中的每一个成员。 它里面只有一个*ReturnStatement*节点，这个节点有一个*argument*子节点，所以我们进入到*argument*节点发现它是*BinaryExpression*类型，它有一个*operator*，一个*left*，一个*right*属性，*operator*属性是一个值而不是一个节点，所以不需要进入，相反的，我们需要遍历*left* 和 *right* 节点。
这个遍历过程会在Babel 的转换过程中持续的发生。

**访问者**  
当我们讲到“进入”一个节点，那通常意味着访问（visiting）它们；我们使用这个术语的原因是这里有一个 [vistor](https://en.wikipedia.org/wiki/Visitor_pattern) 的概念。  
访问者是用于遍历AST 树的一种模式，简单的设置对象，这个对象拥有能够进入树里特定类型节点的方法。这里有点抽象，所以让我们看一个例子。
```
const myVistor = {
    Identifier() {
        console.log('Called!');
    }
};

// 你也可以设置一个vistor对象，然后为其添加一些方法
const vistor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {};
```
> 注意：*Identifier() {...}* 是 *Identifier: { enter() {...} }* 的简写  

这是一个最基础的访问者的例子，在遍历整个AST树的过程中，每遇见一个 *identifier* 节点，都会调用 *Identifier()* 方法。  
所以下面的代码中，*Identifier()* 方法会由于 *identifier* 节点（包含square）调用4次。
```
function square(n) {
    return n * n;
}
```
```
path.traverse(MyVisitor);
Called!
Called!
Called!
Called!
```
这些调用都是在进入节点时发生的，当然也有可能在离开节点时调用访问者的方法。  
假想我们有这样一个树结构：
```
- FunctionDeclaration
  - Identifier (id)
  - Identifier (params[0])
  - BlockStatement (body)
    - ReturnStatement (body)
      - BinaryExpression (argument)
        - Identifier (left)
        - Identifier (right)
```
当我们遍历这个树的每一个分支，都会抵达终点，我们需要返回然后遍历下一个节点；沿着树向下遍历我们需要进入节点，然后向上返回需要离开节点。  
让我们参照上面的树结构来看一下这个遍历过程
```
Enter FunctionDeclaration
    Enter Identifier (id)
        Hit dead end
    Exit Identifier (id)
    Enter Identifier (params[0])
        Hit dead end
    Exit Identifier (params[0])
    Enter BlockStatement (body)
        Enter ReturnStatement (body)
            Enter BinaryExpression (argument)
                Enter Identifier (left)
                    Hit dead end
                Exit Identifier (left)
                Enter Identifier (right)
                    Hit dead end
                Exit Identifier (right)
            Exit BinaryExpression (argument)
        Exit ReturnStatement (body)
    Exit BlockStatement (body)
Exit FunctionDeclaration
```
当创建一个 *visitor* 后，存在两次访问节点的机会
```
const MyVistor = {
    Identifier: {
        enter() {
            console.log('Entered.');
        },
        exit() {
            console.log('Exited.');
        },
    },
};
```
如果有必要的话，你还可以为同一个函数应用多个访问节点通过使用 **|** 来分割方法名，就像 **Identitfier|MemberExpression**。  
[flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47)插件里有使用。
```
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```
你也可以使用别名来访问一个节点（[babel-type](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)里有定义）。  
例如：  
*Function* 是 *FunctionDeclaration* 、*FunctionExpression* 、*ArrowFunctionExpression*、*ObjectMethod*、*ClassMethod* 的别名。
```
const MyVistor = {
    Function(path) {

    }
}
```
**Paths**  
一个AST 树通常有很多节点，节点之间是如何关联的？我们可能有一个巨大的易改变的对象，你可以完全掌控并且可以操控，或者我们可以使用 **Paths** 来简化操作。  
**Path** 是一个对象，呈现了两个节点之间的链接关系。  
例如：我们使用下面的节点作为 *child* 节点
```
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  ...
}
```
如果要呈现 child *Identifier* 作为一个 *Path*，它看起来会是这样：
```
{
  "parent": {
    "type": "FunctionDeclaration",
    "id": {...},
    ....
  },
  "node": {
    "type": "Identifier",
    "name": "square"
  }
}
```
*path* 对象里还有其他的一些属性
```
{
  "parent": {...},
  "node": {...},
  "hub": {...},
  "contexts": [],
  "data": {},
  "shouldSkip": false,
  "shouldStop": false,
  "removed": false,
  "state": null,
  "opts": null,
  "skipKeys": null,
  "parentPath": null,
  "context": null,
  "container": null,
  "listKey": null,
  "inList": false,
  "parentKey": null,
  "key": null,
  "scope": null,
  "type": null,
  "typeAnnotation": null
}
```
由于大量的方法涉及到添加、修改、移动、删除节点，我们会在之后讨论。  
从某种意义上说，*path* 是一个节点在树中位置的反馈，包含了关于节点的各种信息。任何时候你调用一个方法改变树，这些信息都会同步改变。*Babel* 会帮助你管理这些事情，尽可能的让处理节点变得简单而且无状态。  

*Path in Vistor*  
当你的Vistor对象拥有一个 *Identifier* 方法时，实际上你在访问 *path* 对象而不是 *node* 对象。这种时候，你几乎是在操作node节点的呈现而不是node节点本身。
```
const MyVisitor = {
  Identifier(path) {
    console.log("Visiting: " + path.node.name);
  }
};
```
```
a + b + c;
```
```
path.traverse(MyVisitor);
Visiting: a
Visiting: b
Visiting: c
```

**State**  
state 是AST 转化最大的敌人。state 会一次又一次的引发问题，你的任何关于state 假设几乎都会被证实为错误的，这一切都是由于你没有考虑到一些语法。  
拿下面的代码为例：
```
function square(n) {
    return n * n;
}
```
让我们快速实现一个vistor，它会将n 替换成 x。
```
let paramName;
const MyVistor = {
    FunctionDeclaration(path) {
        const param = path.node.params[0];
        paramName = param.name;
        param.name = 'x';
    },
    Identifier(path) {
        if(path.node.name === paramName) {
            path.node.name = 'x';
        }
    },
};
```
这也许会对上面的代码起作用，但是我们可以轻易的让它失效，就像下面这样做：
```
function square(n) {
    return n * n;
}
n;
```
处理这种情况的最佳方式是使用递归，把一个vistor 放入到另一个vistor 里。
```
const updateParamNameVistor = {
    Identifier(path) {
        if(path.node.name === this.paramName) {
            path.node.name = 'x';
        }
    },
};

const MyVistor = {
    FunctionDeclartion(path) {
        const param = path.node.params[0];
        const paramName = param.name;
        param.name = 'x';

        path.traverse(updateParamNameVistor, { paramName });
    },
};

path.traverse(MyVistor);
```
当然了，这仅仅是一个展示，如何消除全局state 带来的影响。  

**Scopes**  
接下来讨论的是 *scope*，JavaScript 有词法作用域，它是一个树结构，代码块会创建新的作用域。
```
// global scope
function scopeOne() {
    // scope 1

    function scopeTwo() {
        // scope 2
    }
}
```
任何时候你创建一个引用，它可以是变量，函数，类，参数，模块引用等等，它都属于当前作用域。
```
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```
深层作用域里的代码可以使用上层作用域里的引用。
```
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```
下层作用域里的代码也可以创建一个同名引用，不会对上层作用域的引用产生影响。
```
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```
当在写代码转换的任务时，我们需要警惕作用域。我们要确保在修改代码的不同部分时没有破坏代码。
我们可以新建一个引用，确保它不会域现有的引用发生冲突。或者，也许我们只是想找到引用变量的位置。我们希望能够在给定范围内跟踪这些引用。  
一个scope 可以是这样子的：
```
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```
当你创建一个新的作用域时，你需要给他一个path 和 parent 作用域。然后在递归阶段会收集到所有的作用域引用。一旦完成，你可以在作用域里使用各种方法。这个问题会在之后讨论。  

**Bindings**  
所有的引用都属于一个作用域，这个关系被称为 *binding*。
```
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```
一个 *binding* 看起来是这个样子的：
```
{
  identifier: node,
  scope: scope,
  path: path,
  kind: 'var',

  referenced: true,
  references: 3,
  referencePaths: [path, path, path],

  constant: false,
  constantViolations: [path]
}
```
有了这些信息，你可以找到所有的绑定引用，查看是哪一种绑定（参数，声明，等等），寻找它的作用域，或者获取这个声明的副本，你甚至可以区分是不是常量，可以查看究竟是哪一个*path*造成了它不是常量。  
区别一个绑定是不是常量在很多情况下都是很有用处的，最大用途是代码压缩。
```
function scopeOne() {
  var ref1 = "This is a constant binding";

  becauseNothingEverChangesTheValueOf(ref1);

  function scopeTwo() {
    var ref2 = "This is *not* a constant binding";
    ref2 = "Because this changes the value";
  }
}
```

### API
Babel 是很多模块的集合。在这一部分内容里，我们将要学历重要的几个模块，解释它们是如何运行以及如何使用。  > 注意：这不是一个对于文档API细节的简单替换，而是可以在任何地方应用的简化说明。

#### babylon
Babylon 是Babel 的一个编译器，一开始只是Acorn的一个fork，Acorn的特点是快速，简单易用，为那些非标准的特性提供了插件架构模式。  
首先，安装babylon
```
yarn add babylon
```
首先是解析一个简单的字符串代码
```
import * as babylon from "babylon";

const code = `function square(n) {
  return n * n;
}`;

babylon.parse(code);
// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }
```
我们也可以给parse方法添加options参数，比如：
```
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```
*sourceType* 是Babylon 解析代码的模式，要么是 *"module"*，要么是 *"script"*。 *"module"* 模式将在严格模式下解析并且允许模块声明，而*"script"* 则不可以。  
> 注意：*sourceType* 默认是 *"script"*，并且在使用 *import* 或者 *export* 时会报错，给 *sourceType* 赋值 *module* 可以消除这些错误。  
由于Babylon是基于插件结构的，所以这里也有一个 *options* 选项来开启内部插件。注意，Babylon并没有对外部插件开放API，尽管未来有可能会开放。  
想要了解全部的插件，请查阅[Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins)。

#### babel-traverse
Babel Traverse 模块维护了树的整体状态，它的职责是替换、移除、新增节点。  
使用命令安装：
```
yarn add babel-traverse
```
我们可以在Babylon使用时来遍历更新节点。  
```
import * as babylon from "babylon";
import traverse from "babel-traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
```

#### babel-types
Babel Types是一个Lodash-esque工具库，用于AST节点。它包含各种方法：构建、校验、转换AST节点。利用经过深思熟虑的工具集方法，对于清理AST的逻辑来说它是有用的。  
你可以通过命令来安装使用：
```
yarn add babel-types
```
然后使用它：
```
import traverse from "babel-traverse";
import * as t from "babel-types";

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```
**definitions**  
Babel types对每一个节点都有definitions，包含了很多信息，诸如：属性属于哪里，值是合法，如何构建节点，节点如何遍历以及节点的别名等。  
一个简单的节点definitions 看起来是这样子：
```
defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: assertValueType("string")
    },
    left: {
      validate: assertNodeType("Expression")
    },
    right: {
      validate: assertNodeType("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});
```
**Builders**  
如果你注意到上面的 *BinaryExpression* 的定义里又有一个 *builder* 字段。
```
builder: ["operator", "left", "right"]
```
这是因为每一个节点类型拥有一个builder方法，通常是这样：
```
t.binaryExpression("*", t.indentifier("a"), t.identifier("b"));
```
builder方法会创建一个AST：
```
{
    type: "BinaryExpression",
    operator: "*",
    left: {
        type: "Identifier",
        name: "a",
    },
    right: {
        type: "Identifier",
        name: "b",
    },
}
```
输出结果：
```
a * b;
```
Builders 也会验证它们创建节点并在使用不正确时抛出一些可描述性的错误信息。这就引出了接下来的方法。  
**Validators**  
*BinaryExpression* 的定义里也包含了节点字段的验证信息。  
```
fields: {
    operator: {
        validate: assertValueType("string")
    },
    left: {
        validate: assertNodeType("Expression")
    },
    right: {
        validate: assertNodeType("Expression")
    }
}
```
这被用来创建了两种类型的验证方法。第一种类型是 *isX*。  
```
t.isBinaryExpression(maybeBinaryExpressionNode);
```
这一检测是为了验证节点是一个二元表达式，你也可以传递第二个参数来确保表达式包含特定的属性和值。
```
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```
此外还有许多版本的方法，它们不会返回*true* 或者 *false*， 而是抛出错误。
```
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```
#### babel-generator
Babel生成器是一个专为Babel的代码生成器。它接收一个AST，转化生成源代码。
运行下面的命令来安装
```
yarn add babel-generator
```
然后这样使用它：
```
import * as babylon from "babylon";
import generate from "babel-generator";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

generate(ast, {}, code);
// {
//   code: "...",
//   map: "..."
// }
```
你也可以传递options参数：
```
generate(ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  quotes: "double",
  // ...
}, code);
```
#### babel-template
Babel Template是一个很小但是很有用的模块，它允许你使用占位符来编写代码字符串，而不是手动构建一个巨大AST。在计算机科学中，这被称作反引号。
```
yarn add babel-template
```
```
import template from "babel-template";
import generate from "babel-generator";
import * as t from "babel-types";

const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

const ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module")
});

console.log(generate(ast).code);
```
```
var myModule = require("my-module");
```

### 第一个Babel plugin
现在已经熟悉了Babel的基础知识，让我们将这些只是和插件的API结合起来。  
从一个函数开始，这个函数接收babel对象。  
```
export default function(babel) {
 // plugin contents
}
```
由于你将会经常使用babel.types，你可以像这样获取它：
```
export default function({ types: t }) {
  // plugin contents
}
```
然后你可以返回一个对象，这个对象包含vistor属性，这个vistor是插件里最重要的vistor。
```
export default function({ types: t }) {
    return {
        vistor: {
            // vistor contents
        },
    };
};
```
每一个vistor里的方法接收两个参数：*path* 和 *state*。
```
export default function({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {},
      ASTNodeTypeHere(path, state) {}
    }
  };
};
```
让我们写一个快速插件来揭示它是如何工作的。下面是源代码：
```
foo === bar;
```
或者以AST的形式呈现：
```
{
  type: "BinaryExpression",
  operator: "===",
  left: {
    type: "Identifier",
    name: "foo"
  },
  right: {
    type: "Identifier",
    name: "bar"
  }
}
```
我们会从添加一个 *BinaryExpression* 开始。
```
export default function({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path) {
        // ...
      }
    }
  };
}
```
然后我们缩小范围，只寻找 *BinaryExpression* 表达式使用了 *===* 运算符
```
visitor: {
  BinaryExpression(path) {
    if (path.node.operator !== "===") {
      return;
    }

    // ...
  }
}
```
现在，让我们用一个新的标识符替换 *left* 节点。
```
visitor: {
  BinaryExpression(path) {
    if (path.node.operator !== "===") {
      return;
    }
    path.node.left = t.identifier("sebmck")
    // ...
  }
}
```
如果运行这个插件会得到：
```
sebmck === bar;
```
让我们接着替换 *right* 节点。
```
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```
最终结果是：
```
sebmck === dork;
```

### 转换操作
#### 访问
**获得子节点的path**  
为了获取AST里node节点的属性，通常是先找到node节点，再获取属性，*path.node.left*。
```
// the BinaryExpression AST node has properties: `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```
如果你需要获得那个属性的path，使用path的 *get* 方法，传递属性的字符串作为参数。
```
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```
**检查节点的类型**  
如果你想检查某个节点的类型，通常的做法是这样的：
```
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```
你可以做给节点做一个浅检查：
```
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```
功能上等同于：
```
BinaryExpression(path) {
  if (
    path.node.left != null &&
    path.node.left.type === "Identifier" &&
    path.node.left.name === "n"
  ) {
    // ...
  }
}
```
**检查path的类型**  
path在检查节点的类型上具有相同的方法：
```
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```
操作等同于：
```
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```
**检查一个标识符是否被引用**  
```
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```
或者：
```
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```
**找到特定的parent path**  
有时候你需要向上遍历，直到找到符合条件的path。  
调用内部提供的方法，这个方法包含所有父节点的*NodePath*， 当*callback*返回真值时，我们返回对应的*NodePath*。
```
path.findParent((path) => path.isObjectExpression());
```
如果想要包含当前节点：
```
path.find((path) => path.isObjectExpression());
```
找到最近的函数或者程序节点：
```
path.getFunctionParent();
```
遍历树结构直到遇见一个node path在列表里：
```
path.getStatementParent();
```
**获取兄弟节点的Path**  
如果一个path是list，比如*Function/Program*里包裹的代码，那么就会存在兄弟关系。  
* 使用path.inList来检查一个path是否是一个列表的其中一个
* 使用*path.getSibling(index)*方法获取兄弟path
* 使用*path.key*拉货去容器里当前节点的索引
* 使用*path.container*获取节点的容器
* 使用*path.listKey*获取列表容器的名字
> 这些Api使用了babel-minify里的transform-merge-sibling-variables插件。
```
var a = 1; // pathA, path.key = 0
var b = 2; // pathB, path.key = 1
var c = 3; // pathC, path.key = 2
```
**停止遍历**  
如果你的插件在某些情形下不需要执行，最简单的方式是提前返回。
```
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```
如果你在一个高一级的path里做遍历，你可以使用2种提供的Api：  
*path.skip()*跳过当前path节点下children节点的遍历，*path.stop()*完全停止遍历。
```
outerPath.traverse({
  Function(innerPath) {
    innerPath.skip(); // if checking the children is irrelevant
  },
  ReferencedIdentifier(innerPath, state) {
    state.iife = true;
    innerPath.stop(); // if you want to save some state and then stop traversal, or deopt
  }
});
```
#### 操作
**替换一个节点**  
```
BinaryExpression(path) {
    if(path.node.operator === '*') {
        path.replaceWith(t.binaryExpression('**', path.node.left, t.numericLiteral(2)))
    }
}
```
```
function square(n) {
-   return n * n;
+   return n ** 2;
}
```
**替换一个节点为多个节点**  
```
ReturnStatement(path) {
  path.replaceWithMultiple([
    t.expressionStatement(t.stringLiteral("Is this the real life?")),
    t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
    t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
  ]);
}
```
```
function square(n) {
-   return n * n;
+   "Is this the real life?";
+   "Is this just fantasy?";
+   "(Enjoy singing the rest of the song in your head)";
}
```
> 注意：当把一个表达式替换为多个节点时，这些节点必须是语句。这是因为Babel在替换节点时广泛的使用启发式，这意味着你做的一些疯狂的替换操作，否则会非常冗长。
**使用一个源字符串替换节点**  
```
FunctionDeclaration(path) {
  path.replaceWithSourceString(`function add(a, b) {
    return a + b;
  }`);
}
```
```
- function square(n) {
-   return n * n;
+ function add(a, b) {
+   return a + b;
}
```
> 注意：不推荐使用这个Api，除非你需要处理一些动态的代码，否则，在vistior外面解析代码才是更有效的。
**插入一个兄弟节点**  
```
FunctionDeclaration(path) {
  path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
  path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
}
```
```
+ "Because I'm easy come, easy go.";
  function square(n) {
    return n * n;
  }
+ "A little high, little low.";
```
> 注意：这种情况下插入的内容必须是一条语句或者是一组语句，这里使用了启发式方法，和替换节点里提及的一样。
**在容器里插入一个节点**  
如果你想在一个容器里插入一个节点属性，像是在body数组里那样。这和*insertBefore/insertAfter* 是一样的，唯一的不同之处是你需要指定*listKey*，它通常是*body*。
```
ClassMethod(path) {
  path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
  path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')));
}
```
```
 class A {
  constructor() {
+   "before"
    var a = 'middle';
+   "after"
  }
 }
```
**移除一个节点**  
```
FunctionDeclaration(path) {
  path.remove();
}
```
```
- function square(n) {
-   return n * n;
- }
```
**替换父节点**  
在 *pathParent* 上调用 *replaceWith* 方法：path.parentPath。
```
BinaryExpression(path) {
  path.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral("Anyway the wind blows, doesn't really matter to me, to me."))
  );
}
```
```
function square(n) {
-   return n * n;
+   "Anyway the wind blows, doesn't really matter to me, to me.";
}
```
**移除父节点**  
```
BinaryExpression(path) {
  path.parentPath.remove();
}
```
```
function square(n) {
-   return n * n;
}
```
#### 作用域
**检查一个局部变量是否绑定**  
```
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```
调用这个方法会遍历AST树并检查那个特定的绑定。  
你也可以检查一个作用域是不是有自己的绑定。  
```
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```
**生成一个UID**  
生成一个标识符，不会与任何本地遍历冲突。
```
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```
**将一个变量声明放入到父级作用域**  
有时候你想要将一个*VariableDeclaration*放到父级作用域，你可以这样做：
```
FunctionDeclaration(path) {
  const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
  path.remove();
  path.scope.parent.push({ id, init: path.node });
}
```
```
- function square(n) {
+ var _square = function square(n) {
    return n * n;
- }
+ };
```
**重新命名一个绑定和它的引用**  
```
FunctionDeclaration(path) {
  path.scope.rename("n", "x");
}

```
```
- function square(n) {
-   return n * n;
+ function square(x) {
+   return x * x;
}
```
或者，你也可使用一个生成的唯一标识符来重新命名。
```
FunctionDeclaration(path) {
  path.scope.rename("n");
}
```
```
- function square(n) {
-   return n * n;
+ function square(_n) {
+   return _n * _n;
}
```

### 插件选项
如果你想让你的插件使用你自己定义的行为，那么你可以使用一些参数选项，它们通常是这样的：
```
{
  plugins: [
    ["my-plugin", {
      "option1": true,
      "option2": false
    }]
  ]
}
```
这些参数选项通过*state* 对象传递到 *vistors*。
```
export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path, state) {
        console.log(state.opts);
        // { option1: true, option2: false }
      }
    }
  }
}
```
这些选项都是*plugin-specific*，你不可以从其他插件里获取到。
**插件的前置与收尾**  
插件可以在运行前以及运行后设置函数，这些函数可以被用来做初始化，清理以及分析的任务。
```
export default function({ types: t }) {
  return {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
  };
}
```
**在插件里使用一些语法**  
插件里可以使用[babylon plugins](https://github.com/babel/babylon#plugins)，所以你不需要安装或者启用它，这就阻止了在没有继承语法插件时引发的错误。
```
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```
**抛出一个语法错误**  
如果你想抛出一个babel-code-frame和一个消息：
```
export default function({ types: t }) {
  return {
    visitor: {
      StringLiteral(path) {
        throw path.buildCodeFrameError("Error message here");
      }
    }
  };
}
```
这个错误看起来是这个样子的：
```
file.js: Error message here
   7 |
   8 | let tips = [
>  9 |   "Click on any AST node with a '+' to expand it",
     |   ^
  10 |
  11 |   "Hovering over a node highlights the \
  12 |    corresponding part in the source code",
```

### 构建节点
当你在做转化操作的时候，想要构建一些节点插入到AST树中，正如之前提到的，你可以使用*babel-types*里提供的*builder*方法来实现。 
方法和名字和你想要构建的节点的类型名字一致，除了首字母需要小写。举个例子：如果你想要创建一个*MemberExpression*，你需要使用*t.memberExpression*方法。  
这些构建方法的参数是由节点定义的，接下来会做些一些工作，让那些定义的文档容易阅读，但是现在只能在[这里查看](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)。  
一个node节点的定义看起来是这个样子：
```
defineType("MemberExpression", {
  builder: ["object", "property", "computed"],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: {
    object: {
      validate: assertNodeType("Expression")
    },
    property: {
      validate(node, key, val) {
        let expectedType = node.computed ? "Expression" : "Identifier";
        assertNodeType(expectedType)(node, key, val);
      }
    },
    computed: {
      default: false
    }
  }
});
```
这样你就可以特定节点的所有信息，包括如何构建、遍历以及校验。  
通过查看*builder*属性，你可以看到为了调用构建方法（t.memberExpression），需要三个参数。  
```
builder: ["object", "property", "computed"],
```
> 注意，有的时候你可以在节点上自定义更多的属性而不是依靠*builder*数组里包含的。这样做避免了builder方法接收过多的参数，在这种情况下你需要手动设置属性，这里有一个ClassMethod的例子：
```
// Example
// because the builder doesn't contain `async` as a property
var node = t.classMethod(
  "constructor",
  t.identifier("constructor"),
  params,
  body
)
// set it manually after creation
node.async = true;

```
你可以通过*fields*对象来查看builder参数的合法性。
```
fields: {
  object: {
    validate: assertNodeType("Expression")
  },
  property: {
    validate(node, key, val) {
      let expectedType = node.computed ? "Expression" : "Identifier";
      assertNodeType(expectedType)(node, key, val);
    }
  },
  computed: {
    default: false
  }
}
```
可以发现*object*必须是一个*Expression*，*property*要么是一个*Expression*，要么是一个*Identifier*，这取决于成员的表达式是否是*computed*，*computed*属性是一个布尔值，默认为false。  
所以我们可以想下面这样构建一个*Expression*：
```
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```
得到如下结果：
```
object.property
```
然而，我们说到*object*应该是一个*Expression*，这里为什么*Identifier*是合法的？  
如果我们查看*Identifier*的定义会发现它包含一个*alias*属性，这个属性表明它同时是一个表达式。  
```
aliases: ["Expression", "LVal"],
```
由于*MemberExpression*是*Expression*的一种子类型，所以我们可以将其设置为另一个*MemberExpresssion*的*object*属性。
```
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```
得到如下结果：
```
member.expression.property
```
想要记住所有node节点builder方法的签名是不可能的，所以你需要花时间理解它们是如何从node定义中产生的。
你可以在这里查看所有的[定义]（https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions），以及所有的[文档]（https://github.com/babel/babel/blob/master/doc/ast/spec.md）。  
### 最佳实践
#### 创建Helper Builders和Checkers
将某些检查（如果节点是特定类型）提取到自己的帮助函数中以及提取特定节点类型的帮助程序是非常简单的。
```
function isAssignment(node) {
  return node && node.operator === opts.operator + "=";
}

function buildAssignment(left, right) {
  return t.assignmentExpression("=", left, right);
}
```
#### 避免过多的遍历操作
遍历AST树开销巨大，比起必要的遍历，很容易产生意外的遍历操作。这可能是数千，如果不是数以万计的额外操作。
Babel会尽可能的优化这些问题，如果可能的话会合并访问者，目的是为了让节点操作在一次遍历中完成。

**无论何时都进行合并**  
当在编写一个遍历操作时，有可能会在各个地方调用*path.traverse*，尽管这些调用在逻辑上是必须的。
```
path.traverse({
  Identifier(path) {
    // ...
  }
});

path.traverse({
  BinaryExpression(path) {
    // ...
  }
});
```
然而，更好的做法是将多个遍历写成一个，只执行一次；否则，你将会多次遍历AST。
```
path.traverse({
  Identifier(path) {
    // ...
  },
  BinaryExpression(path) {
    // ...
  }
});
```
**手动查找时不要遍历**  
当需要查找特定节点时会尝试调用*path.traverse*。
```
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.get('params').traverse(nestedVisitor);
  }
};
```
但是，如果你正在寻找特定和浅层的东西，很有可能可以手动查找所需的节点，而无需执行昂贵的遍历。
```
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```
#### 优化嵌套的遍历
当你在谢嵌套的遍历代码时，写成嵌套的形式或许会容易明白。
```
const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse({
      Identifier(path) {
        // ...
      }
    });
  }
};
```
但是，每次调用函数调用时，都会创建新的访问者对象。这可能是昂贵的，因为 Babel 在每次传入新的访问者对象时都会执行一些处理（例如，分解包含多种类型的键、执行验证和调整对象结构）。由于 Babel 在访问者对象上存储标志，指示它已执行该处理，因此最好将访问者存储在变量中，并每次都传递同一对象。
```
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse(nestedVisitor);
  }
};
```
如果你在嵌套的访问者里需要一些状态，比如这样：
```
const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;

    path.traverse({
      Identifier(path) {
        if (path.node.name === exampleState) {
          // ...
        }
      }
    });
  }
};
```
那么你可以将其传入*traverse()* 方法，并在潜逃的访问者里使用this获取
```
const nestedVisitor = {
  Identifier(path) {
    if (path.node.name === this.exampleState) {
      // ...
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;
    path.traverse(nestedVisitor, { exampleState });
  }
};
```
#### 意识到嵌套的访问者
有时候在你考一个给定的转化操作时，你可能不会记得给定结构也许是嵌套的形式。
例如：假如我们想要从*Foo* *ClassDeclaration* 里寻找*constructor* *ClassMethod*。
```
class Foo {
  constructor() {
    // ...
  }
}
```
```
const constructorVisitor = {
  ClassMethod(path) {
    if (path.node.name === 'constructor') {
      // ...
    }
  }
}

const MyVisitor = {
  ClassDeclaration(path) {
    if (path.node.id.name === 'Foo') {
      path.traverse(constructorVisitor);
    }
  }
}
```
这种情况下我们会忽视一个事实，我们在使用上面的遍历操作时，*class*有可能是嵌套的，我们在遍历时会遇见一个嵌套的*constructor*。
```
class Foo {
  constructor() {
    class Bar {
      constructor() {
        // ...
      }
    }
  }
}
```


