# 作用域与闭包

## 作用域

几乎所有编程语言都具有「存储变量的值，之后对这个变量进行访问和修改」的能力。

所以在将变量引入程序后，需要一套规则来存储变量并可以方便的找到这些变量。这套规则就被称为作用域。

作用域本质上就是程序存储和访问变量的一套规则。

## 理解作用域

尽管我们常说JS是一门“动态”语言，但它其实是一门编译语言。

但与传统的编程语言不一样，JS不是提前编译的。大部分编译发生在代码执行前的几微秒的时间内。

对于`var a = 1`这样一行代码，会进行如下处理：

1. 编译阶段：编译器会查找当前作用域，看看是否已经存在a这样一个变量。如果有，就会忽略这个声明，继续往下编译；如果没有，就会在当前作用域里声明一个新的变量a。然后为引擎生成运行运行时所需要的代码。
2. 运行阶段：JS引擎会查找当前作用域看是否存在a这样一个变量。如果有，就会给a赋值，如果没找到，会继续向上层作用域去找，直到找到变量a，并给其赋值（其实这一层层的查找中，层层递进的作用域就形成了作用域链）。如果最终也没找到，那么就会抛出一个异常来。

## LHS和RHS是什么？

正如上面我们说的，编译器在编译过程中生成了代码，引擎执行的时候，会通过查找变量a来判断它是否已经被声明过（是否存在）。

LHS和RHS就是编译器在查找变量时的两种方式。L代表Left左侧，R代表Right右侧。

这个左和右是看变量出现在赋值操作的左侧还是右侧。

比如还是例子：

```javascript
var a = 1
```

这个变量a出现在赋值操作的左侧，引擎就会为变量a执行LHS查询。

其实讲的更准确一点，RHS查询就是简单的查找某个变量的值。而LHS查询则是试图找到变量的容器本身，从而可以对其赋值。

比如以下例子：

```javascript
console.log(a)
var name = a
```

其实这两行代码对变量a都是RHS查询，所以RHS更准确是表明"非左侧"。

LHS查询意味着变量赋值或写入内存，强调的是“写”。

RHS查询意味着变量查找或从内存中读取，强调的是“读”。

## 词法作用域？动态作用域？

作用域共有两种主要的工作模型。

- 第一种是最普遍的，被大多数编程语言所采用的**词法作用域**
- 第二种是**动态作用域**，仍被一些编程语言在使用，比如bash脚本，Perl中的一些模式等

在JS语言范畴内讨论「作用域」其实指的就是词法作用域。

词法作用域最重要的特征是它的定义过程发生在代码的书写阶段（如果你没有使用eval()和with）。而动态作用域是让作用域作为一个运行时被动态确定的形式。我们可以通过以下示例来说明：

```js
var a = 2
function foo() {
  console.log(a)
}
function bar() {
  var a = 3
  foo()
}
bar()
```

这段代码最后的输出应该是2，foo()中的console.log(a)通过RHS查询查找到了全局中的a变量。这就是JS中的词法作用域。

简单的说，词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的。

无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处 的位置决定。

而动态作用域只关心它们在何处被调用。换句话说，作用域链是基于调用栈的，而不是代码中书写的作用域嵌套。

所以如果JS是动态作用域的话，那么上面的例子中foo将会顺着调用栈在调用foo的地方查找a，并找到值为3的变量a，最终输出3。

总结来说：

- 词法作用域：在代码书写的时候完成划分，作用域链沿着它定义的位置向外延伸。
- 动态作用域：写代码运行的时候完成划分，作用域链沿着它的调用栈向外延伸。

## 欺骗词法，修改词法作用域

词法作用域完全由写代码期间函数定义的位置来决定，那么如何改变作用域呢？

JS中有两个方法来实现这个目的，能在运行过程中改变作用域，就是eval和with。（但写代码不要用这两个东西哈）

## 理解闭包

闭包其实是基于词法作用域书写代码时所产生的自然结果。

当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前的词法作用域之外执行。

我们看下面一段代码，就清晰的展示了闭包：

```javascript
function foo() {
  var a = 2;
  function bar() {
    console.log( a );
  }
  return bar;
}
var baz = foo();
baz(); // 2 —— 这就是闭包的效果。
```

基于词法作用域的查找规则，函数bar()可以访问外部作用域变量a。

在这个例子中，bar()被赋值给baz，在自己的词法作用域之外的地方执行。

在foo()被执行完之后，其内部的作用域并没有被销毁。原因是bar()还在使用这个作用域，因此不会被垃圾回收。

bar()依然持有对原作用域的引用，这个引用就叫做闭包。

再来看一段常见的代码：

```js
function wait(message) {
  setTimeout( function timer() {
    console.log( message );
  }, 1000 );
}
wait( "Hello world!" );
```

在执行完wait这个函数后，其内部作用域并不会消失。timer函数还保存着对其作用域的引用，词法作用域在这个过程中保持完整。

这就叫闭包。

发散思维以此类推，何时何地，如果将函数（访问它们的词法作用域）当做参数传递，就会看到闭包在这个函数中的应用。

在**定时器、事件监听器(addEventListener)、Ajax请求、跨窗口通信、Web Worker等任务**中，只要使用了回调函数，都是在使用闭包。

## 在实际开发中对闭包的应用

### 1. 模拟私有变量的实现

闭包常用来创建内部变量，使这些内部变量不能被外部访问到，但可以通过指定的函数接口来对其进行操作。把变量的变化封装在安全的环境里。

```javascript
class Client {
	constructor(money) {
    this.assets = money
  }
  earn() {
   	this.assets++
    console.log(this.assets)
  }
}
let xiaoming = new Client(500)
console.log(xiaoming.assets) // 500,外部可以拿到
```

用闭包封装一层：

```javascript
let createClinet = (function() {
  let assets
  class Client {
    constructor(money) {
      assets = money
    }
		earn() {
      assets++
      console.log(assets)
    }
  }
  return Client
})()
let xiaoming = new createClinet(300)
console.log(xiaoming.assets) // undefined,外部拿不到
```

### 2. 利用闭包来设计单例模式

下面这个例子中，就利用了闭包。使全局只有一个CreateCat的实例，所以最后 miao 和 mi 其实指向的是同一个实例。

```javascript
class CreateCat {
	constructor(name){
    this.name = name
  }
}
let singleMode = (funciton() {
   let instance = null
   return function(name) {
  		if(!instance) {
        instance = new CreateCat(name)
      }
  		return instance
	}
})()

let miao = singleMode('miao')
let mi = singleMode('mi')
console.log(miao === mi) // true
```

### 3. 便函数与柯里化

「"便函数和柯里化都是能帮助我们把需要传入多个参数的函数，转化为需要更少入参的函数的方法"」

#### 柯里化

>在计算机科学中，柯里化（英语：Currying），是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

柯里化是把**接受 n 个参数的 1 个函数**改造为**只接受 1个参数的 n 个互相嵌套的函数**的过程。也就是 fn (a, b, c)会变成 fn (a)(b)(c)。

其实这个就是利用了闭包，在函数里返回函数，并让它记住上次的状态。

比如下面的例子，我们可以传入性别和姓氏和名字三个参数来返回对应的信息。每次也必须传入三个参数。

```javascript
function name(sex,xing,ming) {
	return sex + '-' + xing + ming
}
```

但想一下，如果在录入都是性别女的、都是性别女下姓氏为王的，那还得不断传入”女“，”王“的参数。如果我们改造一下呢？

```javascript
function generateName(sex) {
  return function(xing) {
    return function(ming) {
      return sex + '-' + xing + ming
    }
  }
}
// 生成性别为女的专有函数
let femaleName = generateName('女')

// 生成性别为女、姓氏为王的专有函数
let femaleWangName = femaleName('王')

// 调用
femaleWangName('花花') // 输出 '女-王花花'
```

看这个例子，我们就利用了闭包，生成了复用程度更高的目标函数。

#### 偏函数

便函数与柯里化基本一致，只不过入参的数量比较随意：

```javascript
function generateName(sex) {
  return function(xing,ming) {
      return sex + '-' + xing + ming
  }
}
// 生成性别为女的专有函数
let femaleName = generateName('女')

// 调用
femaleName('王','花花') // 输出 '女-王花花'
```

### 4. 回调函数

正如上一节「理解闭包」里的最后总结。

在**定时器、事件监听器(addEventListener)、Ajax请求、跨窗口通信、Web Worker等任务**中，只要使用了回调函数，都是在使用闭包。

## 总结

当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时 就产生了闭包。

了解了闭包的真正原理后，就会发现我们的代码其实处处都充斥了闭包。

再来一问：“你怎么理解JS中的闭包？”

