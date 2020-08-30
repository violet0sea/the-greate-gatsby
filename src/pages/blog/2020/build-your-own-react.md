---
path: '/blog/2020/build-your-own-react'
title: 'Build your own React'
date: '2020-02-29'
---
原文：[Build your own React](pomb.us/build-your-own-react)


翻译：

### 构建你自己的React
  我们打算从头开始，一步步地重写一个“React”。完全仿照真实的React的架构，但是不会包含所有的优化操作和非必要的特性。
  如果你阅读过我之前写的《构建你自己的React》系列的文章，这一篇与之前相比的区别的是它使用的React版本是16.8，因此我们可以使用Hooks 并且舍弃所有与class 相关的代码。
  从头开始，下面这些是我们自己版本React 里的所有特性，我们将一个个的添加：
  * Step 1: **createElement function** 
  * Step 2: **render function**
  * Step 3: **Concurrent Mode**
  * Step 4: **Fibers**
  * Step 5: **Render and Commit Phase**
  * Step 6: **Reconciliation**
  * Step 7: **Function Component**
  * Step 8: **Hooks**

### 前言： 回顾
  首先让我们来回顾一下React里的基本概念。如果你已经掌握React、JSX以及DOM元算的工作原理，可以直接跳过这部分。  
  我们将使用一个三行代码的React应用。第一行定义了一个React Element，第二行从DOM树里获取了一个node节点，最后一行把React Element渲染到node节点容器里。

  ```
  const element = <h1 title="foo">React Mini</h1>;
  const container = document.querySelector("#root");
  ReactDOM.render(element, container);
  ```

  让我们删除所有的与 React 相关的代码，并且将其替换成原生的Javascript。

  首先是第一行，用JSX定义的一个元素。这不是一个原生的Javascript写法，所以我们先要把这一行替换成原生的Javascript。JSX语法是使用类似Babel一样的工具转化成原生Javascript的。转化方式很简单：使用createElement函数替换标签里的代码，传入tag name，props 以及 children作为参数。

  ```
  const element = React.createElement(
      "h1",
      {title: "foo"},
      "React Mini",
  );
  const container = document.querySelector("#root");
  ReactDOM.render(element, container);
  ```

  React.createElement通过传入的参数创建了一个对象。除了一些校验，内部原理就是这样简单。所以我们可以使用他得输出来替换函数调用。

  ```
  const element = {
      type: "h1",
      props: {
          title: "foo",
          children: "React Mini",
      },
  };
  const container = document.querySelector("#root");
  ReactDOM.render(element, container);
  ```
  这就是元素真实的样子，一个对象包含两个属性：type 和 props 。（虽然它还有更多属性，但是我们只关心这两个）
  type属性是一个字符串，它表明了我们创建DOM节点的类型，它的值是一个标签名，和你使用document.createElement创建HTML元素市传入的标签名一样。它可以是一个函数，但是这会在Step 7里讲到。
  props 是一个对象，它包含所有的JSX里的属性，同时它也有一个特殊的属性：children。
  在这个例子里，children 是一个字符串，但是通常它会是一个包含更多元素的数组，这也就是为什么元素会构成树的原因。
  接下来将要替换的是ReactDOM.render 这一段代码，render函数是React更新DOM树的关键所在，所以我们会替换成自己更新。
  首先我们会创建一个node使用elemet对象的type字段，在这个例子里是"h1"，然后将element.props属性设置到元素上，只有一个title属性。

  **为了避免引起误解，我们将会使用"element"来代表React element，"node"来代表DOM element。**

  然后我们为children属性创建node，只有一个字符串，所以创建一个text node
  使用textNode属性而不是innerText属性是为了在这之后统一对待所以元素，注意到我们也为h1设置了title属性就像我们设置了nodeValue属性一样，这几乎和child string拥有porps:{nodeValue: "React Mini"}一摸一样。最后，我们把textNode节点插入h1，h1插入container容器。

  ```
  const element = {
      type: "h1",
      props: {
          title: "foo",
          children: "React Mini",
      },
  };
  const container = document.querySelector("#root");
  
  const node = document.createElement(element.type);
  node["title"] = element.props.title;

  const text = document.createTextNode("");
  text["nodeValue"] = element.props.children;

  node.appendChild(text);
  container.appendChild(node);
  ```
  到此为止，我们拥有了一个一摸一样的APP，但是它并没有使用React。

### Step 1: createElement函数
  让我们再次开启另一个项目。这一次我们将要替换React代码为我们自己的React版本。我们首先会重写一个属于自己的createElement。让我们把JSX转化成JS，这样我们就能知道createElement 该如何调用。
  ```
  // JSX语法
  const element = (
      <div id="foo">
          <a>bar</a>
          <b />
      </div>
  );
  // JS语法
  const _element = React.createElement(
      "div",
      {id: "foo"},
      React.createElement("a", null, "bar"),
      React.createElement("b"),
  );
  const container = document.querySelector("#root");
  ReactDOM.render(element, container);
  ```
  正如我们在之前所看到的，一个element就是一个对象，包含type和props属性。我们的函数需要做的就是创建这个对象。
  ```
  function createElement(type, props, ...children) {
      return {
          type,
          props: {
              ...props,
              children,
          },
      };
  }
  const element = createElement(
      "div",
      {id: "foo"},
      createElement("a", null, "bar"),
      createElement("b"),
  );
  const container = document.querySelector("#root");
  ReactDOM.render(element, container);
  ```
  我们在porps上使用spread运算符，在children上使用rest运算符，这样保证了children永远都是一个数组。
  例如：
  createElement("div")返回：
  ```
  {
      type: "div",
      props: {
          children: [],
      },
  }
  ```
  createElement("div", null, a)返回：
  ```
  {
      type: "div",
      props: {
          children: [a],
      },
  }
  ```
  createElement("div", null, a, b)返回：
  ```
  {
      type: "div",
      props: {
          children: [a, b],
      },
  }
  ```
  children数组也可以包含基本数据类型，比如字符串和数字。所以我们把一切不是对象类型的包裹在他们自己的element中，为此我们创建了一个特殊的类型：TEXT_ELEMENT。
  React 并没有包裹基本类型，也没有在不含children 属性时创建一个空的数组；我们这样做是为了简化我们的代码，因为我们的代码库更加考虑简单而不是性能。
  ```
  function createElement(type, props, ...children) {
      return {
          type,
          props: {
              ...props,
              children: children.map(child =>
                  typeof child === 'object'
                      ? child
                      : createTextElement(child)
              ),
          },
      };
  }

  function createTextElement(text) {
      return {
          type: 'TEXT_ELEMENT',
          props: {
              nodeValue: text,
              children: [],
          },
      };
  }

  const Didact = {
      createElement,
  };


  const element = Didact.createElement(
      "div",
      {id: "foo"},
      Didact.createElement("a", null, "bar"),
      Didact.createElement("b"),
  );
  const container = document.querySelector("#root");
  ReactDOM.render(element, container);
  ```
  我们仍然会使用React 的createElement 方法，但是为了区别，我们为自己的库取了一个新的名字。我们需要一个和React 很相似的名称，但是同时也能显示出学习性的目的。
  我们叫它Didact。但是我们也想使用JSX，我们应该怎么做才能让Babel 知道使用的是Didact 的createElement 而不是React 的createElement。
  我们可以想下面这样做，写一个注释，当Babel编译JSX 时会使用我们定义的方法
  ```
  /** @jsx Didact.createElement */
  const element = (
      <div id="foo">
          <a>bar</a>
          <b />
      </div>
  );
  ```

  ### Step 2: render 函数
  接下来，我们将实现自己版本的ReactDOM.render 方法。
  目前为止，我们只关心DOM树的插入，在之后的部分会处理更新和删除操作。然后对每一个child使用相同的递归操作；同时我们也要处理text elements，如果一个element 的类型是TEXT_ELEMENT，我们创建一个text node节点而不是普通的节点。最后一件事情是将所有的props属性赋值到node 节点。

  ```
  function createElement(type, props, ...children) {
      return {
          type,
          props: {
              ...props,
              children: children.map(child =>
                  typeof child === 'object'
                      ? child
                      : createTextElement(child)
              ),
          },
      };
  }

  function createTextElement(text) {
      return {
          type: 'TEXT_ELEMENT',
          props: {
              nodeValue: text,
              children: [],
          },
      };
  }

  function render(element, container) {
      // create dom nodes
      const dom = 
          element.type === 'TEXT_ELEMENT';
          ? document.createTextNode('')
          : document.createElement(element.type);
      const isProperty = key => key !== 'children';
      Object.keys(element.props)
          .filter(isProperty)
          .forEach(name => dom[name] === element.props[name]);
      // 递归children属性创建element
      element.props.children.forEach(child => render(child, dom));
      container.appendChild(dom);
  }

  const Didact = {
      createElement,
      render,
  };


  const element = Didact.createElement(
      "div",
      {id: "foo"},
      Didact.createElement("a", null, "bar"),
      Didact.createElement("b"),
  );
  // result of element
  const _element = {
      type: 'div',
      props: {
          id: 'foo',
          children: [
              {
                  type: 'a',
                  props: {
                      children: [
                          {
                              type: 'TEXT_ELEMENT',
                              props: {
                                  nodeValue: 'bar',
                                  children: [],
                              }
                          }
                      ]
                  }
              },
              {
                  type: 'b',
                  props: {
                      children: [],
                  }
              }
          ]
      }
  }
  const container = document.querySelector("#root");
  Didact.render(element, container);
  ```
  至此，我们已经有了一个库可以将JSX 插入到DOM里。
  
  ### Step 3: Concurrent Mode
  在我们添加更多的代码之前我们需要重构，因为这里的递归调用存在一个问题：一旦我们开始渲染，渲染逻辑会一直执行直到dom 树创建完成。如果dom树很大，会造成主线程被长时间占用。如果浏览器需要做高优先级的事务，比如处理用户的输入或者保持动画的流畅，这个时候会一直等待直到渲染完成。
  所以我们将要把任务分解为小的单元，每次完成一个单元后我们允许浏览器中断渲染过程去做那些优先级较高的事务
  ```
  function createElement(type, props, ...children) {
      return {
          type,
          props: {
              ...props,
              children: children.map(child =>
                  typeof child === 'object'
                      ? child
                      : createTextElement(child)
              ),
          },
      };
  }

  function createTextElement(text) {
      return {
          type: 'TEXT_ELEMENT',
          props: {
              nodeValue: text,
              children: [],
          },
      };
  }

  function render(element, container) {
      // create dom nodes
      const dom = 
          element.type === 'TEXT_ELEMENT';
          ? document.createTextNode('')
          : document.createElement(element.type);
      const isProperty = key => key !== 'children';
      Object.keys(element.props)
          .filter(isProperty)
          .forEach(name => dom[name] === element.props[name]);
      // 递归children属性创建element
      element.props.children.forEach(child => render(child, dom));
      container.appendChild(dom);
  }

  let nextUnitOfWork = null;

  function worlLoop(deadline) {
      let shouldYield = false;
      while(nextUnitOfWork && !shouldYield) {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
          shouldYield = deadline.timeRemaining() < 1;
      }
      requestIdleCallback();
  }

  requestIdleCallback(workLoop);

  function performUnitOfWork(nextUnitOfWork) {
      // TODO
  }

  const Didact = {
      createElement,
      render,
  };


  const element = Didact.createElement(
      "div",
      {id: "foo"},
      Didact.createElement("a", null, "bar"),
      Didact.createElement("b"),
  );
  const container = document.querySelector("#root");
  Didact.render(element, container);
  ```
  我们使用了requestIdleCallback 方法开启循环，你可以把它看作是setTimeout，和setTimeout不同的是，你不用告诉它什么时间开始执行，浏览器会在主线程空闲的时候开始。
  现在React 不再使用requestIdleCallback 方法，而是使用Scheduler包，在这里他们在概念上是一样的。
  requestIdleCallback 也提供了一个deadline参数，我们可以知道还有多少时间剩余直到浏览器需要掌管线程。
  直到2019年11月，Concurrent Mode仍然不是稳定的功能，相对稳定版本的循环看起来是这个样子的：
  ```
  while (nextUnitOfWork) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  ```
  为了使用循环我们需要
  设置第一次的任务单元，需要定义一个performUnitOfWork函数，这个函数不仅执行任务，而且还会返回下一个任务单元。

  ### Step 4: Fibers
  为了组织每一个任务单元，我们需要一个数据结构： 一个fiber树。
  每一个element元素都会对应一个fiber，每一个fiber都是一个任务单元。
  下面举一个例子：
  假设现在需要渲染一个element 树：
  ```
  Didact.render(
      <div>
          <h1>
              <p />
              <a />
          </h1>
          <h2 />
      </div>,
      container
  )
  ```
  在render方法里，创建了一个root fiber并且设置它为nextUnitOfWork，其余的任务都会在performUnitOfWork 函数里触发，在这里我们会对每一个fiber做以下三件事：
  1. 将element添加到dom中
  2. 给element的children创建fibers
  3. 设置下一个任务单元
  这种数据结构的其中的一种好处是可以很容易的找到下一个任务单元。这就是为什么每一个fiber都有指向第一个child节点、兄弟节点、父节点的指针。
  当我们完成了fiber的任务单元，如果它有一个child，那么该child的fiber就是下一个任务单元。
  在我们的例子里，当我们完成了div fiber上的任务，那么下一个任务单元将是h1的fiber。
  如果fiber不存在child，那么我们使用兄弟节点作为下一个任务单元。
  例如，p节点的fiber不存在child，那么使用a节点的fiber；如果当前节点的fiber不存在child和兄弟节点，那么我们寻找它的“uncle”节点：父节点的兄弟节点，比如a节点和h2节点。
  同样的，如果父节点不存在兄弟节点，那么我们继续向上寻找各级的父节点直到找到兄弟节点或者是找到root节点。如果找到的是root节点，那么这意味着render函数的工作完成了。
  接下来，让我们把上面的逻辑放入代码里：
  首先，移除render函数里的代码，并把这部分代码放入到createDom函数里，这个函数会在后面使用；在render函数里，我们设置nextUnitOfWork为fiber 树的root节点;
  然后，浏览器准备好了以后，它会执行workLoop函数，渲染工作姐这样从root节点开始执行了。
  在performUnitOfWork里，首先创建一个新的节点，并把它插入到dom树，我们可以通过fiber.dom属性来跟踪DOM节点；然后为每一个child，我们创建一个新的fiber，然后把它添加到fiber树里作为child或者sibling，这取决于它是否是第一个元素；最后，我们寻找下一个任务单元，首先尝试寻找child，接下里寻找sibling，再之后才是uncle，以此类推。这就是performUnitOfWork所做的事情。

  ```
  function createElement(type, props, ...children) {
      return {
        type,
        props: {
          ...props,
          children: children.map(child =>
            typeof child === 'object'
                ? child
                : createTextElement(child)
          ),
        },
      };
  }

  function createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: [],
      },
    };
  }

  function createDom(fiber) {
    // create dom nodes
    const dom = 
        element.type === 'TEXT_ELEMENT';
        ? document.createTextNode('')
        : document.createElement(element.type);
    const isProperty = key => key !== 'children';
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => dom[name] === element.props[name]);
    // 递归children属性创建element
    element.props.children.forEach(child => render(child, dom));
    container.appendChild(dom);
  }

  function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element],
        },
    };
  }

  let nextUnitOfWork = null;

  function worlLoop(deadline) {
    let shouldYield = false;
    while(nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback();
  }

  requestIdleCallback(workLoop);

  function performUnitOfWork(nextUnitOfWork) {
    // add dom node
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom);
    }

    // create new fibers
    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;

    while(index < elements.length) {
        const element = elements[i];
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        };

        if(index === 0) {
            fiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }

    // return nextUnitOfWork
    if(fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while(nextFiber) {
      if(nextFiber.sibling) {
          return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  }

  const Didact = {
      createElement,
      render,
  };

  const element = Didact.createElement(
      "div",
      {id: "foo"},
      Didact.createElement("a", null, "bar"),
      Didact.createElement("b"),
  );
  const container = document.querySelector("#root");
  Didact.render(element, container);
  ```

  ### Step 5: Render and Commit Phases
  上面的代码存在一个问题，当一个element工作时我们添加一个新的节点到DOM树上。在这期间，浏览器可以在在我们渲染完整个树之前打断我们的任务。这个时候，用户会看到一个不完整的UI，这并不是我们所希望的结果。因此，我们需要移除performUnitOfWork函数里改变DOM的那部分代码。相应的，我们需要追踪root节点的fiber，我们把它称作"work in progress"或者简称wipRoot。一旦所有的任务完成（当没有下一个任务单元时我们就直到任务完成了），我们提交整个的fiber树到DOM节点。提交工作会在commitRoot函数里执行，在这个函数里递归的将所有的nodes插入到dom。
  ```
  function createElement(type, props, ...children) {
      return {
          type,
          props: {
              ...props,
              children: children.map(child =>
                  typeof child === 'object'
                      ? child
                      : createTextElement(child)
              ),
          },
      };
  }

  function createTextElement(text) {
      return {
          type: 'TEXT_ELEMENT',
          props: {
              nodeValue: text,
              children: [],
          },
      };
  }

  function createDom(fiber) {
      // create dom nodes
      const dom = 
          element.type === 'TEXT_ELEMENT';
          ? document.createTextNode('')
          : document.createElement(element.type);
      const isProperty = key => key !== 'children';
      Object.keys(element.props)
          .filter(isProperty)
          .forEach(name => dom[name] === element.props[name]);
      // 递归children属性创建element
      element.props.children.forEach(child => render(child, dom));
      container.appendChild(dom);
  }

  function commitRoot() {
      // add nodes to dom
      commitWork(wipRoot.child);
      wipRoot = null;
  }

  function commitWork(fiber) {
      if(!fiber) {
          return;
      }
      const domParent = fiber.parent.dom;
      domParent.appendChild(fiber.dom);
      commit(fiber.child);
      commit(fiber.sibling);
  }

  function render(element, container) {
      wipRoot = {
          dom: container,
          props: {
              children: [element],
          },
      };
      nextUnitOfWork = wipRoot;
  }

  let nextUnitOfWork = null;
  let wipRoot = null;

  function worlLoop(deadline) {
      let shouldYield = false;
      while(nextUnitOfWork && !shouldYield) {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
          shouldYield = deadline.timeRemaining() < 1;
      }
      if(!nextUnitOfWork && wipRoot) {
          commitRoot();
      }
      requestIdleCallback();
  }

  requestIdleCallback(workLoop);

  function performUnitOfWork(nextUnitOfWork) {
      // add dom node
      if (!fiber.dom) {
          fiber.dom = createDom(fiber);
      }


      // create new fibers
      const elements = fiber.props.children;
      let index = 0;
      let prevSibling = null;

      while(index < elements.length) {
          const element = elements[i];
          const newFiber = {
              type: element.type,
              props: element.props,
              parent: fiber,
              dom: null,
          };

          if(index === 0) {
              fiber.child = newFiber;
          } else {
              prevSibling.sibling = newFiber;
          }

          prevSibling = newFiber;
          index++;
      }

      // return nextUnitOfWork
      if(fiber.child) {
          return fiber.child;
      }

      let nextFiber = fiber;
      while(nextFiber) {
          if(nextFiber.sibling) {
              return nextFiber.sibling;
          }
          nextFiber = nextFiber.parent;
      }
  }

  const Didact = {
      createElement,
      render,
  };


  const element = Didact.createElement(
      "div",
      {id: "foo"},
      Didact.createElement("a", null, "bar"),
      Didact.createElement("b"),
  );
  const container = document.querySelector("#root");
  Didact.render(element, container);
  ```
  ### Step 6: Reconciliation
  到目前为止，我们仅仅添加节点到dom，但是更新和删除操作该如何？接下来就将揭晓这些，我们需要对上一次提交到dom节点的fiber树和当前render函数里生成的fiber树进行比较。所以我们需要将“上一词提交到DOM的fiber树”存储起来，我们将其称作currentRoot。同时我们也需要为每一个fiber添加一个alternate属性，这个属性会链接到旧的fiber（上一个提交的fiber）。那么就开始从performUnitOfWork里提取代码来创建新的fibers，增加一个新的reconcileChildren函数。
  接下来就是如何reconcile 旧的fibers和新的elements：
  同时递归旧的fiber的children和将要reconcile的elements，如果忽略遍历一个数组和一个链表之间的样板代码，那么剩下的便是最重要的：oldFiber和element。element是我们想要插入到DOM重的，oldFiber是上一次渲染的引用。我们需要比较oldFiber和element之间变化来决定是否需要应用到DOM。
  为了比较它们，我们使用type字段：
  * 如果旧的fiber和新的element具有相同的类型，那么可以保留dom节点，仅更新props的变化
  * 如果type字段不一样，并且新的element存在，这意味着需要创建一个新的DOM节点
  * 如果type字段不一样，而且旧的fiber存在，我们需要移除这个节点
  在React里使用了keys，这使得reconciliation更好。举例来说，它可以检测一个数组元素的位置是否发生变化。
  在第一种情况下，旧的fiber和element具有相同的type，我们需要创建一个新的fiber，保留旧fiber的DOM节点，获取element的props属性。同时也需要新加一个effectTag属性，这个属性会在稍后的提交阶段使用；对于第二种情况，我们需要一个新的DOM节点，并且标记了新fiber的effectTag属性为PLACEMENT；对于第三种情况，我们需要删除节点，因为这种情况不会创建新的fiber，所以effectTag属性添加到旧的fiber上面。但是在提交阶段，我们的操作都是在work in progress root上面，这里并不会包含旧的fiber。所以我们需要一个数组来追踪那些需要被移除的节点，在这之后，我们也会使用那个数组提交变更到DOM节点。
  接下来，就是改变commitWork里的代码来处理新的effectTag字段下对应的情况：
  * 如果fiber的effectTag字段值为PLACEMENT，逻辑跟之前一样，把dom元素插入到父fiber的dom节点里；
  * 如果effectTag字段值为DELETION，我们需要移当前的节点
  * 如果effectTag字段值为UPDATE，我们需要根据porps的变化来更新已存在的dom节点；更新操作会在updateDom函数里，通过比较旧的fiber和新的fiber 的props属性，移除不存在的属性，设置新的属性或者更新属性。一种特殊情况是如果prop是事件处理函数，即prop已on开头，我们将会区别对待。若果事件处理函数发生变化，那么直接移除，并增加新的事件函数。

  ```
  function createElement(type, props, ...children) {
      return {
          type,
          props: {
              ...props,
              children: children.map(child =>
                  typeof child === 'object'
                      ? child
                      : createTextElement(child)
              ),
          },
      };
  }

  function createTextElement(text) {
      return {
          type: 'TEXT_ELEMENT',
          props: {
              nodeValue: text,
              children: [],
          },
      };
  }

  function createDom(fiber) {
      // create dom nodes
      const dom = 
          element.type === 'TEXT_ELEMENT';
          ? document.createTextNode('')
          : document.createElement(element.type);
      const isProperty = key => key !== 'children';
      Object.keys(element.props)
          .filter(isProperty)
          .forEach(name => dom[name] === element.props[name]);
      // 递归children属性创建element
      element.props.children.forEach(child => render(child, dom));
      container.appendChild(dom);
  }

  const isEvent = key => key.startWith('on');
  const isProperty = key => key !== 'children' && !isEvent(key);
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isGone = (prev, next) => key => !(key in next);
  function updateDOm(dom, prevProps, nextProps) {
      // Remove old or changed event listeners
      Object.keys(prevProps)
          .filter(isEvent)
          .filter(key => !(key in nextProps) || isNew(prevProps, nextProps))
          .forEach(name => {
              const eventType = name.toLowerCase().subString(2);
              dom.removeEventListener(eventType, prevProps[name]);
          });
      
      // Remove unexisted old property
      Object.keys(prevProps)
          .filter(isProperty)
          .filter(isGone(prevProps, nextProps))
          .forEach(name => dom[name] === '');
      
      // set new or changed properties
      Object.keys(nextProps)
          .filter(isProperty)
          .filter(isNew(prevProps, nextProps))
          .forEach(name => dom[name] = nextProps[key]);

      // add event listeners
      Object.keys(nextProps)
          .filter(isEvent)
          .filter(isNew(prevProps, nextProps))
          .forEach(name => {
              const eventType = name.toLowerCase().subString(2);
              dom.addEventListener(eventType, nextProps[name]);
          }); 
  }

  function commitRoot() {
      // add nodes to dom
      deletions.forEach(commitWork)
      commitWork(wipRoot.child);
      currentRoot = wipRoot; // update and delete key point
      wipRoot = null;
  }

  function commitWork(fiber) {
      if(!fiber) {
          return;
      }
      const domParent = fiber.parent.dom;

      if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
          domParent.appendChild(fiber.dom);
      } else if (fiber.effectTag === 'DELETION') {
          domParent.removeChild(fiber.dom);
      } else if (fiber.effectTag === 'UPDATE') {
          updateDom(fiber.dom, fiber.alternate.props, fiber.props);
      }
      commit(fiber.child);
      commit(fiber.sibling);
  }

  function render(element, container) {
      wipRoot = {
          dom: container,
          props: {
              children: [element],
          },
          alternate: currentRoot, // ***
      };
      deletions = [];
      nextUnitOfWork = wipRoot;
  }

  let nextUnitOfWork = null;
  let currentRoot = null;
  let wipRoot = null;
  let deletions = [];

  function worlLoop(deadline) {
      let shouldYield = false;
      while(nextUnitOfWork && !shouldYield) {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
          shouldYield = deadline.timeRemaining() < 1;
      }
      if(!nextUnitOfWork && wipRoot) {
          commitRoot();
      }
      requestIdleCallback();
  }

  requestIdleCallback(workLoop);

  function performUnitOfWork(nextUnitOfWork) {
      // add dom node
      if (!fiber.dom) {
          fiber.dom = createDom(fiber);
      }

      // create new fibers
      const elements = fiber.props.children;
      reconcileChildren(fiber, elements);

      // create new fibers
      const elements = fiber.props.children;
      let index = 0;
      let prevSibling = null;

      while(index < elements.length) {
          const element = elements[i];
          const newFiber = {
              type: element.type,
              props: element.props,
              parent: fiber,
              dom: null,
          };

          if(index === 0) {
              fiber.child = newFiber;
          } else {
              prevSibling.sibling = newFiber;
          }

          prevSibling = newFiber;
          index++;
      }

      // return nextUnitOfWork
      if(fiber.child) {
          return fiber.child;
      }

      let nextFiber = fiber;
      while(nextFiber) {
          if(nextFiber.sibling) {
              return nextFiber.sibling;
          }
          nextFiber = nextFiber.parent;
      }
  }

  function reconcileChildren(wipFiber, elements) {
      let index = 0;
      let oldFiber = wipFiber.alternate && wipFiber.alternate.child
      let prevSibling = null;

      while(index < elements.length || oldFiber !== null) {
          const element = elements[i];
          let newFiber = null;

          // compare oldFiber to element
          const sameType = oldFiber && element && element.type === oldFiber.type;
          if(sameType) {
              // update then node
              newFiber = {
                  type: oldFiber.type,
                  props: element.props,
                  dom: oldFiber.dom,
                  parent: wipFiber,
                  alternate: oldFiber,
                  effectTag: 'UPDATE',
              };
          }

          if(element && !sameType) {
              // add this node
              newFiber = {
                  type: element.type,
                  props: element.props,
                  dom: null,
                  parent: wipFiber,
                  alternate: null,
                  effectTag: 'PLACEMENT'
              }
          }

          if(oldFiber && !sameType) {
              // delete the oldFiber's node
              oldFiber.effectTag = 'DELETION';
              deletions.push(oldFiber);
          }

          if(oldFIber) {
              oldFiber = oldFiber.sibling
          }
          if(index === 0) {
              fiber.child = newFiber;
          } else {
              prevSibling.sibling = newFiber;
          }

          prevSibling = newFiber;
          index++;
      }
  }

  const Didact = {
      createElement,
      render,
  };

  const element = Didact.createElement(
      "div",
      {id: "foo"},
      Didact.createElement("a", null, "bar"),
      Didact.createElement("b"),
  );
  const container = document.querySelector("#root");
  Didact.render(element, container);
  ```

  ### Step 7: Function Component
  接下来的事情是需要支持function component。
  首先需要改变例子，我们使用一个简单的function component，返回一个h1 element。

  ```
  /** @jsx Didact.createElement */
  function App(props) {
      return <h1>Hi, {props.name}</p>;
  }

  const element = <App name="foo" />;
  const container = document.getElementById("root");
  Didact.render(element, container);
  ```
  注意，如果我们将jsx转化为js，它将会变成：

  ```
  function App(props) {
      return Didact.createElement(
          'h1',
          null,
          'Hi ',
          props.name,
      );
  }

  const element = Didact.createElement(App, {name: 'foo'});
  ```
  Function Component 存在两点区别：
  1. function component生成的fiber没有DOM节点
  2. children是运行函数产生的，而不是直接从props获取的
  我们需要检测fiber的类型是不是函数，它将决定是否需要使用一个不同的更新函数
  在updateHostComponent里，我们做的工作和以前一样
  在updateFunctionComponent里，我们需要运行函数来得到children，在我们的例子里，fiber.type对应App函数，当我们运行这个函数后，返回了h1 element。我们获取到children后，reconciliatiion工作和以前一样，我们不需要改变任何代码。
  我们需要在commitWork函数里改变一些逻辑，有一些fiber没有dom属性所以我们需要改变两个地方：
  首先，需要找到一个有DOM节点的祖先fiber，我们需要向上遍历fiber树直到找到一个拥有dom节点的fiber；
  其次，当我们删除一个节点时，我们需要向下遍历直到找到那个有dom 节点的child。

  ```
  function createElement(type, props, ...children) {
      return {
          type,
          props: {
              ...props,
              children: children.map(child =>
                  typeof child === 'object'
                      ? child
                      : createTextElement(child)
              ),
          },
      };
  }

  function createTextElement(text) {
      return {
          type: 'TEXT_ELEMENT',
          props: {
              nodeValue: text,
              children: [],
          },
      };
  }

  function createDom(fiber) {
      // create dom nodes
      const dom = 
          element.type === 'TEXT_ELEMENT';
          ? document.createTextNode('')
          : document.createElement(element.type);
      const isProperty = key => key !== 'children';
      Object.keys(element.props)
          .filter(isProperty)
          .forEach(name => dom[name] === element.props[name]);
      // 递归children属性创建element
      element.props.children.forEach(child => render(child, dom));
      container.appendChild(dom);
  }

  const isEvent = key => key.startWith('on');
  const isProperty = key => key !== 'children' && !isEvent(key);
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isGone = (prev, next) => key => !(key in next);
  function updateDom(dom, prevProps, nextProps) {
      // Remove old or changed event listeners
      Object.keys(prevProps)
          .filter(isEvent)
          .filter(key => !(key in nextProps) || isNew(prevProps, nextProps))
          .forEach(name => {
              const eventType = name.toLowerCase().subString(2);
              dom.removeEventListener(eventType, prevProps[name]);
          });
      
      // Remove unexisted old property
      Object.keys(prevProps)
          .filter(isProperty)
          .filter(isGone(prevProps, nextProps))
          .forEach(name => dom[name] === '');
      
      // set new or changed properties
      Object.keys(nextProps)
          .filter(isProperty)
          .filter(isNew(prevProps, nextProps))
          .forEach(name => dom[name] = nextProps[key]);

      // add event listeners
      Object.keys(nextProps)
          .filter(isEvent)
          .filter(isNew(prevProps, nextProps))
          .forEach(name => {
              const eventType = name.toLowerCase().subString(2);
              dom.addEventListener(eventType, nextProps[name]);
          }); 
  }

  function commitRoot() {
      // add nodes to dom
      deletions.forEach(commitWork)
      commitWork(wipRoot.child);
      currentRoot = wipRoot; // update and delete key point
      wipRoot = null;
  }

  function commitWork(fiber) {
      if(!fiber) {
          return;
      }

      let domParentFiber = fiber.parent;
      while(!domParentFiber.dom) {
          domParentFiber = domParentFiber.parent;
      }
      const domParent = domParentFiber.dom;

      if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
          domParent.appendChild(fiber.dom);
      } else if (fiber.effectTag === 'DELETION') {
          // domParent.removeChild(fiber.dom);
          commitDeletion(fiber, domParent);
      } else if (fiber.effectTag === 'UPDATE') {
          updateDom(fiber.dom, fiber.alternate.props, fiber.props);
      }
      commit(fiber.child);
      commit(fiber.sibling);
  }

  function commitDeletion(fiber, domParent) {
      if(fiber.dom) {
          domParent.removeChild(fiber.dom);
      } else {
          commitDeletion(fiber.child, domParent);
      }
  }

  function render(element, container) {
      wipRoot = {
          dom: container,
          props: {
              children: [element],
          },
          alternate: currentRoot, // ***
      };
      deletions = [];
      nextUnitOfWork = wipRoot;
  }

  let nextUnitOfWork = null;
  let currentRoot = null;
  let wipRoot = null;
  let deletions = [];

  function worlLoop(deadline) {
      let shouldYield = false;
      while(nextUnitOfWork && !shouldYield) {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
          shouldYield = deadline.timeRemaining() < 1;
      }
      if(!nextUnitOfWork && wipRoot) {
          commitRoot();
      }
      requestIdleCallback();
  }

  requestIdleCallback(workLoop);

  function updatefunctionComponent(fiber) {
      const children = [fiber.type(fiber.props)];
      reconcileChildren(fiber, children);
  }

  function updateHostComponent(fiber) {
      // add dom node
      if (!fiber.dom) {
          fiber.dom = createDom(fiber);
      }
      // create new fibers
      const elements = fiber.props.children;
      reconcileChildren(fiber, elements);
  }

  function performUnitOfWork(nextUnitOfWork) {
      // distinct function or class
      const isFunctionComponent = fiber.type instanceof Function;
      if(isFunctionComponent) {
          updateFunctionComponent(fiber);
      } else {
          updateHostComponent(fiber);
      }

      // return nextUnitOfWork
      if(fiber.child) {
          return fiber.child;
      }

      let nextFiber = fiber;
      while(nextFiber) {
          if(nextFiber.sibling) {
              return nextFiber.sibling;
          }
          nextFiber = nextFiber.parent;
      }
  }

  function reconcileChildren(wipFiber, elements) {
      let index = 0;
      let oldFiber = wipFiber.alternate && wipFiber.alternate.child
      let prevSibling = null;

      while(index < elements.length || oldFiber !== null) {
          const element = elements[i];
          let newFiber = null;

          // compare oldFiber to element
          const sameType = oldFiber && element && element.type === oldFiber.type;
          if(sameType) {
              // update then node
              newFiber = {
                  type: oldFiber.type,
                  props: element.props,
                  dom: oldFiber.dom,
                  parent: wipFiber,
                  alternate: oldFiber,
                  effectTag: 'UPDATE',
              };
          }

          if(element && !sameType) {
              // add this node
              newFiber = {
                  type: element.type,
                  props: element.props,
                  dom: null,
                  parent: wipFiber,
                  alternate: null,
                  effectTag: 'PLACEMENT'
              }
          }

          if(oldFiber && !sameType) {
              // delete the oldFiber's node
              oldFiber.effectTag = 'DELETION';
              deletions.push(oldFiber);
          }

          if(oldFIber) {
              oldFiber = oldFiber.sibling
          }
          if(index === 0) {
              fiber.child = newFiber;
          } else {
              prevSibling.sibling = newFiber;
          }

          prevSibling = newFiber;
          index++;
      }
  }

  const Didact = {
      createElement,
      render,
  };


  const element = Didact.createElement(
      "div",
      {id: "foo"},
      Didact.createElement("a", null, "bar"),
      Didact.createElement("b"),
  );
  const container = document.querySelector("#root");
  Didact.render(element, container);
  ```

  ### Step VII: Hooks
  最后一步，让我们给function component增加状态管理。
  让我们把例子改成经典的计数器组件：每一次我们点击它，计数器加1。注意到我们使用Didact.useState来获取和更新计数器的值。
  在Counter函数里我们调用了setState。在调用function component之前，首先需要定义一些全局变量，这些变量会在useState函数里使用。首先，我们需要设置work in progress fiber，同时也需要增加一个hooks数组到上面，这样就可以支持我们在一个组件里多次调用useState函数，此外，我们追踪当前hook的索引。当函数组件调用useState时，我们检查是否存在一个旧的hook，通过检查fiber.alternative.hooks里面是否存在hookIndex对应的值。如果存在旧的hook，并且不是初始化操作，我们从旧的hook里拷贝一份state到新的hook。然后我们把新的hook放入fiber.hooks数组里，将hookIndex的值加1，并返回state。useState同时也需要返回一个函数来更新state，我们定义一个setState函数来接受一个action（在Counter的例子里action是一个函数，这个函数会将state的值加1）。我们把action放入到hook.queue里。然后我们需要做一些类似render函数里的工作，设置一个新的wipRoot作为下一次的任务单元，这样我们就可以让workLoop函数开启一个新的render阶段。但是我们没有执行action函数。我们会在下一次渲染组件时执行，我们从旧的hook.queue里获取所有的actions，然后一个个执行，将state更新，所以我们最终返回了最新的state。
  ```
  function createElement(type, props, ...children) {
      return {
          type,
          props: {
              ...props,
              children: children.map(child =>
                  typeof child === 'object'
                      ? child
                      : createTextElement(child)
              ),
          },
      };
  }

  function createTextElement(text) {
      return {
          type: 'TEXT_ELEMENT',
          props: {
              nodeValue: text,
              children: [],
          },
      };
  }

  function createDom(fiber) {
      // create dom nodes
      const dom = 
          element.type === 'TEXT_ELEMENT';
          ? document.createTextNode('')
          : document.createElement(element.type);
      const isProperty = key => key !== 'children';
      Object.keys(element.props)
          .filter(isProperty)
          .forEach(name => dom[name] === element.props[name]);
      // 递归children属性创建element
      element.props.children.forEach(child => render(child, dom));
      container.appendChild(dom);
  }

  const isEvent = key => key.startWith('on');
  const isProperty = key => key !== 'children' && !isEvent(key);
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isGone = (prev, next) => key => !(key in next);
  function updateDom(dom, prevProps, nextProps) {
      // Remove old or changed event listeners
      Object.keys(prevProps)
          .filter(isEvent)
          .filter(key => !(key in nextProps) || isNew(prevProps, nextProps))
          .forEach(name => {
              const eventType = name.toLowerCase().subString(2);
              dom.removeEventListener(eventType, prevProps[name]);
          });
      
      // Remove unexisted old property
      Object.keys(prevProps)
          .filter(isProperty)
          .filter(isGone(prevProps, nextProps))
          .forEach(name => dom[name] === '');
      
      // set new or changed properties
      Object.keys(nextProps)
          .filter(isProperty)
          .filter(isNew(prevProps, nextProps))
          .forEach(name => dom[name] = nextProps[key]);

      // add event listeners
      Object.keys(nextProps)
          .filter(isEvent)
          .filter(isNew(prevProps, nextProps))
          .forEach(name => {
              const eventType = name.toLowerCase().subString(2);
              dom.addEventListener(eventType, nextProps[name]);
          }); 
  }

  function commitRoot() {
      // add nodes to dom
      deletions.forEach(commitWork)
      commitWork(wipRoot.child);
      currentRoot = wipRoot; // update and delete key point
      wipRoot = null;
  }

  function commitWork(fiber) {
      if(!fiber) {
          return;
      }

      let domParentFiber = fiber.parent;
      while(!domParentFiber.dom) {
          domParentFiber = domParentFiber.parent;
      }
      const domParent = domParentFiber.dom;

      if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
          domParent.appendChild(fiber.dom);
      } else if (fiber.effectTag === 'DELETION') {
          // domParent.removeChild(fiber.dom);
          commitDeletion(fiber, domParent);
      } else if (fiber.effectTag === 'UPDATE') {
          updateDom(fiber.dom, fiber.alternate.props, fiber.props);
      }
      commit(fiber.child);
      commit(fiber.sibling);
  }

  function commitDeletion(fiber, domParent) {
      if(fiber.dom) {
          domParent.removeChild(fiber.dom);
      } else {
          commitDeletion(fiber.child, domParent);
      }
  }

  function render(element, container) {
      wipRoot = {
          dom: container,
          props: {
              children: [element],
          },
          alternate: currentRoot, // ***
      };
      deletions = [];
      nextUnitOfWork = wipRoot;
  }

  let nextUnitOfWork = null;
  let currentRoot = null;
  let wipRoot = null;
  let deletions = [];

  function worlLoop(deadline) {
      let shouldYield = false;
      while(nextUnitOfWork && !shouldYield) {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
          shouldYield = deadline.timeRemaining() < 1;
      }
      if(!nextUnitOfWork && wipRoot) {
          commitRoot();
      }
      requestIdleCallback();
  }

  requestIdleCallback(workLoop);
  let wipFiber = null;
  let hookIndex = null;

  function updatefunctionComponent(fiber) {
      wipFiber = fiber;
      hookIndex = 0;
      wipFiber.hooks = [];
      const children = [fiber.type(fiber.props)];
      reconcileChildren(fiber, children);
  }

  function useState(initial) {
      const oldHook =
          wipFiber.alternate &&
          wipFiber.alternate.hooks &&
          wipFiber.alternative.hooks[hookIndex];
      const hook = {
          state: oldHook ? oldHook.state : initial,
          queue: [],
      };

      const actions = oldHook ? oldHook.queue : [];
      actions.forEach(action => hook.state = action(hook.state));

      const setState = action => {
          hook.queue.push(action);
          wipRoot = {
              dom: currentRoot.dom,
              props: currentroot.props,
              alternate: currentRoot,
          };
          nextUnitOfWork = wipRoot;
          deletions = [];
      }
      wipFiber.hooks.push(hook);
      hookIndex++;
      return [hook.state, setState];
  }

  function updateHostComponent(fiber) {
      // add dom node
      if (!fiber.dom) {
          fiber.dom = createDom(fiber);
      }
      // create new fibers
      const elements = fiber.props.children;
      reconcileChildren(fiber, elements);
  }

  function performUnitOfWork(nextUnitOfWork) {
      // distinct function or class
      const isFunctionComponent = fiber.type instanceof Function;
      if(isFunctionComponent) {
          updateFunctionComponent(fiber);
      } else {
          updateHostComponent(fiber);
      }

      // return nextUnitOfWork
      if(fiber.child) {
          return fiber.child;
      }

      let nextFiber = fiber;
      while(nextFiber) {
          if(nextFiber.sibling) {
              return nextFiber.sibling;
          }
          nextFiber = nextFiber.parent;
      }
  }

  function reconcileChildren(wipFiber, elements) {
      let index = 0;
      let oldFiber = wipFiber.alternate && wipFiber.alternate.child
      let prevSibling = null;

      while(index < elements.length || oldFiber !== null) {
          const element = elements[i];
          let newFiber = null;

          // compare oldFiber to element
          const sameType = oldFiber && element && element.type === oldFiber.type;
          if(sameType) {
              // update then node
              newFiber = {
                  type: oldFiber.type,
                  props: element.props,
                  dom: oldFiber.dom,
                  parent: wipFiber,
                  alternate: oldFiber,
                  effectTag: 'UPDATE',
              };
          }

          if(element && !sameType) {
              // add this node
              newFiber = {
                  type: element.type,
                  props: element.props,
                  dom: null,
                  parent: wipFiber,
                  alternate: null,
                  effectTag: 'PLACEMENT'
              }
          }

          if(oldFiber && !sameType) {
              // delete the oldFiber's node
              oldFiber.effectTag = 'DELETION';
              deletions.push(oldFiber);
          }

          if(oldFIber) {
              oldFiber = oldFiber.sibling
          }
          if(index === 0) {
              fiber.child = newFiber;
          } else {
              prevSibling.sibling = newFiber;
          }

          prevSibling = newFiber;
          index++;
      }
  }

  const Didact = {
      createElement,
      render,
      // add state manage
      useState,
  };

  /** @jsx Didact.createElement */
  function Counter() {
      const [state, setState] = Didact.useState(1);
      return (
          <h1 onClick={() => setState(c => c + 1)}>
              Count: {state}
          </h1>
      );
  }
  const element = <Counter />;
  const container = document.querySelector("#root");
  Didact.render(element, container);
  ```
  以上就是所有的代码。