# 前端模块化

## 1. 模块化

### 1.1 何为模块化

在解决复杂问题时，按照特定的功能将代码拆分为多个代码段，对其进行独立的开发和测试，每个代码段只需完成特定的职责。最终把它们组合在一起，成为一个整体。

### 1.2 模块化的好处

在没有模块化的时候，我们需要引入多个script标签到html里。

1. 需要手动维护script的顺序，没有明显的依赖关系。
2. 每一个script都意味着要向服务器请求一次静态资源。在HTTP 2还没出现的时期，建立连接的成本是很高的，过多的请求会严重拖慢网页的渲染速度。
3. 在每个script标签中，顶层作用域即全局作用域，如果没有任何处理而直接在代码中进行变量或函数声明，就会造成全局作用域的污染。
4. 难以维护。

有模块化之后，模块化的好处：

1. 通过导入和导出语句我们可以清晰地看到模块间的依赖关系
2. 模块可以借助工具来进行打包，在页面中只需要加载合并后的资源文件，减少了网络开销。
3. 多个模块之间的作用域是隔离的，彼此不会有命名冲突。
4. 更好的分离，按需加载，更高的可复用性和可维护性。

### 1.3 早期的模块化

#### 1.3.1 全局function：将不同的功能封装成不同的全局函数

JS中函数是有独立作用域的，所以我们把不同的功能封装成不同的全局函数，在有需要的地方直接调用即可。

```javascript
function fn1() {
  // ...
}

function fn2() {
  // ...
}
```

但很多变量和函数直接在全局作用域下声明，会污染全局变量，造成命名冲突，模块成员之间看不出直接的关系。

#### 1.3.2 namespace：变量和函数都放于对象内封装

```javascript
let module = {
  age: 1,
  addAge: () => {
    this.age++
  }
}
module.age = -1 // 直接修改模块内部数据
module.addAge() // 0
```

暴露所有模块成员，外部可以直接修改模块内部的数据。

#### 1.3.3 立即执行函数（IIFE 闭包）

利用闭包的特性来实现私有数据和共享方法。数据是私有的，外部只能通过暴露的方法来操作。

将数据和方法封装到一个函数内部

```javascript
var modole = (function() {
	var age = 1
	function addAge() {
		age++
		console.log(age)
	}
	return { addAge }
})()
```

这样我们就不可以在外部直接修改内部的变量，而是只能通过操纵暴露出来的函数来操纵数据。

如果这个模块需要依赖其他的模块呢？👇

#### 1.3.4 引入依赖

比如我们的模块需要引用jQuery，那我们可以通过参数的方式将这个库传入，即函数传参。

```javascript
var modole = (function($) {
	var age = 1
	function addAge() {
		age++
		console.log(age)
    $('div').css('border','1px solid red')
	}
	return { addAge }
})(jQuery)
```

这时我们必须在html里先引入jQuery

```html
// index.html
<!-- 引入的js必须有一定顺序 -->
<script type="text/javascript" src="jquery-1.10.1.js"></script>
<script type="text/javascript" src="module.js"></script>
<script type="text/javascript">
  myModule.foo()
</script>
```

## 2. 模块化演进规范

### 2.1 CommonJS

CommonJS是js社区在09年提出的一系列标准，在Node.js的实现中采用了CommonJS标准的一部分。现在谈到CommonJS实际上说的就是在Node.js中的版本。

CommonJS最初只为服务端而设计，不支持异步加载，直到有了Browserify——一个运行在Node.js环境下的模块打包工具，它可以将CommonJS模块打包为浏览器可以运行的单个文件。这意味着客户端的代码也可以遵循CommonJS标准来编写了。在服务端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。

#### 2.1.1 导出

导出是一个模块向外暴露自身的唯一方式。每个CommonJS模块内部，都有一个module用于存放当前模块的信息。可以理解为每个模块定义了如下属性

```javascript
var module = {...}
// ... 模块自身的逻辑
module.exports = {...}
```

`module.exports`用来制定这个模块要对外暴露哪些信息。

简单的写法可以是`exports.xx = 'xxx'`，其实原理就是将`exports`指向了`module.exports`：

```javascript
var module = {
	...
	exports: {}
}
var exports = module.exports
```

```javascript
module.exports = {
  age: '18',
  name: 'nanxi'
}
// 等同于⬇️
exports.age = '18'
exports.name = 'nanxi'
```

**要注意的两个问题**：

1. 不要直接给exports赋值，因为最后导出的其实是`module.exports`这个对象，并不是导出`exports`所声明的对象。
2. 不要在`exports.xx = 'xxx'`之后又声明`module.exports = {...}`，这样会把上面exports的单独变量或函数都覆盖。

#### 2.1.2 引入

使用`require`来进行模块的引入，引入某个模块，其实就是引入这个模块的`module.exports`。

- 当这个模块是被第一次`require`，会执行该模块并且导出内容，然后会把内容缓存起来。
- 当下次再被require，模块里的代码不会再次执行，直接导出上次缓存的结果。

这个判断条件是module对象里有一个loaded属性初始值为false，第一次加载执行后会把它置为true。

**要注意的问题：**

1. CommonJS输入是输出的值的拷贝，一旦输出这个值，模块内部的变化就影响不到这个值。但可以用函数来return出变化后的值。

```javascript
// lib.js
var age = 18
function addAge() {
  age++
}
function getAge() {
  return age
}
module.exports = {
  age,
  addAge,
  getAge
}

// main.js
let { age,addAge,getAge } = require('./lib')

console.log(age) // 18
addAge()
console.log(age) // 18
console.log(getAge()) // 19

```

2. 对于对象的拷贝是浅拷贝

```javascript
// lib.js
var obj = {
  name:'小楠',
  cats: {
    '大宝': 6
  }
}
function incCounter() {
  obj.age = 18
  obj.cats['小宝'] = 3
}
module.exports = {
  obj,
  incCounter
};

// main.js
let { obj,incCounter } = require('./lib')

console.log(obj) // { name: '小楠', cats: { '大宝': 6 } }
incCounter()
console.log(obj) // { name: '小楠', cats: { '大宝': 6, '小宝': 3 }, age: 18 }
```

### 2.2 AMD

CommonJS加载模块是运行时同步加载的，最初只被用在服务端。浏览器端则需要去异步的加载模块，因为在浏览器端同步加载模块会带来性能的问题。

所以AMD规范诞生，是"Asynchronous Module Definition"的缩写，意思是异步模块定义。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。依赖这个模块的语句定义在其回调函数中，等模块加载完成，才会运行回调函数。

```javascript
require(['module'],callback)
define(['module'],function(){})
```

目前主要是`require.js`中得以应用，写法比较复杂。但依赖关系很清晰，便于我们代码的编写和维护，而且是异步加载模块。

#### 2.2.1 define定义为模块

1. 定义没有依赖的模块

   ```javascript
   // ageModule.js
   define(function() {
     let age = 18
     function getAge() {
       return age - 1
     }
     return { getAge } // 暴露模块
   })
   ```

2. 定义有依赖的模块

   ```javascript
   // showModule.js
   define(['ageModule','jquery'], function(ageModule,$) {
     let name = 'nanxi'
     function showMsg() {
       alert(name + ':' + ageModule.getAge())
     }
     // 暴露模块
     return { showMsg }
   })
   ```

#### 2.2.2  require引入使用模块

```javascript
// main.js文件
(function() {
  require.config({
    baseUrl: 'js/'
    paths: {
      //映射: 模块标识名: 路径
      ageModule: './ageModule',
      showModule: './showModule',
    	// 第三方库模块
      jquery: './libs/jquery-2.10.0' //注意：写成jQuery会报错
    }
  })
  require(['showModule'], function(showModule) {
    showModule.showMsg()
  })
})()
```

在html里引入require.js，并把入口函数设置为js/main.js

```html
// index.html文件
<!DOCTYPE html>
<html>
  <head>
    <title>Modular Demo</title>
  </head>
  <body>
    <!-- 引入require.js并指定js主文件的入口 -->
    <!-- data-main 用来指定网页程序的主模块 -->
    <script data-main="js/main" src="js/libs/require.js"></script>
  </body>
</html>

```

### 2.3 CMD

CMD规范（Common Module Definition）也是专门用于浏览器端的异步模块加载，与AMD类似。但不同的是：**AMD推崇依赖前置、提前执行，CMD推崇依赖就近，延迟执行。**CMD 是 `SeaJS` 在推广过程中对模块定义的规范化产出。

AMD在声明依赖的模块时，会第一时间加载并执行模块内的代码。

```javascript
// 在最前面声明了 a,b 模块，并第一时间去执行了 a,b 模块的代码
define(['a','b'],function(a,b)) {
   a.getAge() // 只用到了a模块，没用到b模块，但b模块的代码还是执行了
}
```

CMD则推崇在用到模块的时候再去加载模块，也延迟了其执行。

```javascript
define(function(require, exports, module){
  //引入依赖模块(同步)
  var module1 = require('./module1') // 在需要时声明
  module1.getAge()
  //引入依赖模块(异步)
  require.async('./module2', function (module2) {
    module2.getName()
  })
  //暴露模块
  exports.xxx = value
})
```

在CMD规范中，一个模块就是一个文件。

#### 2.3.1 define(factory)

define接受`factory`参数，可以是一个对象或字符串，也可以是一个函数。

当为对象或字符串时，表示该模块的接口就是该对象、字符串。

```javascript
define({ "foo": "bar" });
define("xixi我是一个模块")
```

当为一个函数时，表示时模块的构造方法。默认传入三个参数：`require`，`exports`，`module`。如上面的例子所示。

#### 2.3.2 require导入，exports导出

导出的写法与CommonJS相似，`exports`和`module.exports`。

用sea.js应用在项目中，写法与上述一致。最后在index.html中引入sea.js和入口文件即可。

```html
<script type="text/javascript" src="js/libs/sea.js"></script>
<script type="text/javascript">
  seajs.use('./main')
</script>
```

常用的API其实就是`define`， `require` ，`require.async` ，`exports` ，`module.exports`

与RequireJS的AMD规范相比，CMD规范书写起来就简单很多了。

### 2.4 UMD

UMD（Universal Module Definition）是一种js通用模块定义规范，可以让模块能在js所有运行环境中发挥作用。也就是说在CommonJS、AMD、CMD规范下都能运行。

但不同的模块其实导出和定义的定义是不一样的，所以UMD接收一个工厂函数。

核心其实是通过判断当前的环境处于什么模块规范，对应不同的导出形式和定义形式即可。

#### 2.4.1 判断模块规范

```javascript
(function(root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        console.log('是commonjs模块规范，nodejs环境')
        var depModule = require('./umd-module-depended')
        module.exports = factory(depModule);
    } else if (typeof define === 'function' && define.amd) {
        console.log('是AMD模块规范，如require.js')
        define(['depModule'], factory)
    } else if (typeof define === 'function' && define.cmd) {
        console.log('是CMD模块规范，如sea.js')
        define(function(require, exports, module) {
            var depModule = require('depModule')
            module.exports = factory(depModule)
        })
    } else {
        console.log('没有模块环境，直接挂载在全局对象上')
        root.umdModule = factory(root.depModule);
    }
}(this, function(depModule) {
    console.log('我调用了依赖模块', depModule)
    return {
        name: '我自己是一个umd模块'
    }
}))
```

我们上面说的`CommonJS`，`AMD`，`CMD`，`UMD`，其实都是社区的模块化规范，并不是语言层面的规范。

ES6在推出了语言层面的规范`ES Module`。

### 2.5 ES Module

ES6在语言标准的层面上，实现了模块功能，成为浏览器和服务器通用的模块解决方案。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 等模块，都只能在运行时确定这些东西。叫做“运行时加载”，所以没办法在编译时做“静态优化”。

而ES6的加载是“编译时加载”，效率比CommonJS的加载方式高。也正是由于它是编译时加载，就可以进行静态分析，引入类型校验等功能。

#### 2.5.1 导出export

ES6中用export命令来导出模块，有`命名导出`和`默认导出`两种形式。

1. 命名导出写法：

```javascript
// 写法1
export const name = '小楠'
export const age = 18

// 写法2
const name = '小楠'
const age = 18
export { name, age }
```

2. 默认导出写法

```javascript
// 模块的默认导出默认只能有1个
export default {
  name: '小楠'
  age: 18
}
```

#### 2.5.2 导入import

1. 加载命名导出的模块

```javascript
import { name,age } from './a.js'
```

导入变量的效果相当于在当前作用域下声明了这些变量（name和age），并且不可对其进行更改，也就是所有导入的变量都是只读的。

当导入多个变量时，我们可以采用整体导入的方式。

```javascript
import * as service from './service.js'

console.log(service.addAge())
```

2. 加载默认导出的模块

```javascript
// myInfo.js
export default {
  name: '小楠'
  age: 18
}

// main.js
import info from './myInfo.js' 
```

默认导出import后面直接加变量名即可，这个名字可以自己指定。

## 3. CommonJS和ES Module的区别

### 3.1 动态与静态

CommonJS与ES6 Module最本质的区别在于前者对模块依赖的解决是“动态的”，而后者是“静态的”。在这里“动态”的含义是，模块依赖关系的建立发生在代码运行阶段；而“静态”则是模块依赖关系的建立发生在代码编译阶段。

静态加载的好处有： 

- 可以通过静态分析工具检测出哪些模块没有被调用过，在打包时可以去掉这些没被用到过的代码，减小打包体积（tree shaking)。
- 模块变量类型检查。
- 编译器优化。在CommonJS等动态模块系统中，无论采用哪种方式，本质上导入的都是一个对象，而ES6 Module支持直接导入变量，减少了引用层级，程序效率更高。

### 3.2 值拷贝与动态引用

在导入一个模块时，对于CommonJS来说获取的是一份导出值的拷贝。

而在ES6Module中则是值的动态映射，并且这个映射是只读的。

### 3.3 循环依赖

ES6 Module的特性使其可以更好地支持循环依赖。

## 4. 参考

[「前端工程四部曲」模块化的前世今生（上）](https://juejin.cn/post/7007946894605287432)

[前端模块化详解(完整版)](https://juejin.cn/post/6844903744518389768)

[图解 webpack（模块化 - CommonJS）](https://juejin.cn/post/6844904200539766797)

[模块打包](https://weread.qq.com/web/reader/8fc322d07185cc948fc5aa8kc81322c012c81e728d9d180)