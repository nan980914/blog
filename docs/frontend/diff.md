# Vue2和Vue3的虚拟DOM和核心diff详细实现

## vue2

虚拟DOM其实就是一个javascript对象，用来抽象的描述一个真实的DOM元素。

Vue2中的`vitral-dom`和`diff`是参考了开源的`snabbdom`的实现。

### 用VNode来描述真实DOM

一个真实的Dom元素上有很多属性，比如名字、属性、绑定事件、子节点等。我们可以定义一个Vnode（虚拟dom节点）来进行描述。

如下对象就表示一个链接指向百度的a标签元素。

```javascript
// <a class="baidu" href="https://baidu.com" target="_blank">百度一下，你就知道</a>
{
  sel: 'a',
  data: {
    class: 'baidu',
    href: 'https://baidu.com',
    target: '_blank'
  },
  text:'百度一下，你就知道'
}
```

在`snabbdom`中我们这样来设计VNode：

```typescript
export interface VNode {
  sel: string | undefined; // 标签选择器，如'div','p','h1'等
  data: VNodeData | undefined; // 真实dom上的attrubute,class,style,绑定的事件等
  children: Array<VNode | string> | undefined; // 子节点
  elm: Node | undefined; // 此vnode对应的真实dom节点
  text: string | undefined; // 此vnode为文本节点时对应的文本
  key: Key | undefined; // 此vnode的唯一标记
}
```

通过以上6个核心属性，可以用一个函数来创建一个真实DOM所对应的VNode。

```typescript
export function vnode(
  sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined
){
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}
```

### h函数 - 创建VNode

在vue的render函数中其实我们经常看到这个h。

`snabbdom`为了让vnode的创建能更加灵活，封装了一个h函数来进行创建，可以让我们传入不同的参数来创建出vnode。

通常h函数的调用形式（传参）可以有很多种，在`snabbdom`的源码(ts)中也做了不同形式类型的判断。

```typescript
export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData | null): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData | null, children: VNodeChildren): VNode;
```

在这里我们只分析三个参数(sel,data,children)都传入的情况，并且不考虑svg。

```javascript
function isPrimitive(s) {
  return typeof s === 'string' || typeof s === 'number'
}

export function h(sel, data, c) {
  let children, text
  if (Array.isArray(c)) {
    children = c
  } else if (isPrimitive(c)) {
    text = c
  } else if (c && c.sel){
    children = [c]
  }
  if(children !== undefined) {
    for(let i = 0; i < children.length; i++) {
      if(isPrimitive(children[i])) {
        children[i] = vnode(
          undefined,
          undefined,
          undefined,
          children[i],
          undefined
        )
      }
    }
  }
  return vnode(sel, data, children, text, undefined)
}
```

在h函数中，我们把第三个参数c根据以下不同情况的传入形式进行了讨论，最终返回的是vnode。

```javascript
// 1. c为数组
h("ul", { key: "ul" }, [
  h("li", { key: "a" }, "a"),
  h("li", { key: "b" }, "b"),
  h("li", { key: "c" }, "c"),
]);

// 2. c为字符串或数字
h("div", {}, "aa");

// 3. c为vnode
h("div", {}, h("p", { key: "b" }, "b"));
```

### patch - 判断新旧Vnode是否需要继续对比

到目前为止我们通过h函数创建出了 Vnode 虚拟节点。

**在数据变化后，我们会再把当前的DOM抽象成新的Vnode虚拟节点。然后把前后两个Vnode树做比较，做到尽可能的复用旧节点，减少DOM操作，以最小资源开销来完成更新。**

当两个vnode的选择器名称sel和key值都相同时，我们认为其是相同节点。

是相同的节点的话，我们才会进行核心的diff流程。

否则认为是不同的节点，不会进行比较，而是直接在直接在真实DOM上删除老节点对应的旧节点元素，创建新节点的DOM并插入。

```javascript
function sameVnode(vnode1, vnode2) {
  return vnode1.sel === vnode2.sel && vnode1.key === vnode2.key
}

function patch(oldVnode, newVnode) {
	if(oldVnode.sel == '' || oldVnode.sel == undefined) {
    // 判断此时第一个参数不是vnode类型，说明为真实dom节点，包装为vnode。
		oldVnode = vnode(
      oldVnode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVnode
    );
	}
  
  if（sameVnode(oldVnode, newVnode)) {
    // 是同一个节点，进行核心的比较
    patchVnode(oldVnode, newVnode)
  } else {
    // 不是同一个节点，则不再进行比较
    ....
  }
}
```

先来写不相同的这种简单情况，首先我们需要一个vnode -> 真实dom节点的函数来创建真实节点：

```javascript
// 把vnode创建为真实dom节点 
function createElement(vnode) {
  let domNode = document.createElement(vnode.sel);
  if (vnode.text !== "" && (vnode.children === undefined || vnode.children.length === 0)) {
    // 内部是文字
    domNode.innerText = vnode.text;
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 内部有子节点，递归创建节点。
    for (let i = 0; i < vnode.children.length; i++) {
      let chdom = createElement(vnode.children[i]);
      domNode.appendChild(chdom);
    }
  }
  // 返回vnode.elm，是一个纯DOM对象
  vnode.elm = domNode;
  return vnode.elm;
}
```

所以patch中不是同一个节点时，我们直接创建新节点，删除旧节点即可。

```javascript
function patch(oldVnode, newVnode) {
	// 省略...
  
  if（sameVnode(oldVnode, newVnode)) {
    // 是同一个节点，进行比较
    patchVnode(oldVnode, newVnode)
  } else {
    // 不是同一个节点，则不再进行比较
    let elm = oldVnode.elm
    let parent = elm.parentNode
    
   	createElement(newVnode) // 创建新节点
    
    if(parent !== null) {
      parent.insertBefore(newVnode.elm, elm);  // 在旧节点之前插入新节点
      parent.removeChild(elm); // 删除旧节点
    }
  }
}
```

### patchVnode - diff过程

由上可知真正的diff过程，即新旧为相同节点时是通过调用patchVnode这个方法继续进行diff的。

此时又可以分以下几种情况。

- 新Vnode是纯文本节点，直接更改DOM。
- 新Vnode有子节点，看旧Vnode有无子节点，进行children的对比。

从这里也可以看出，其实snabbdom的diff算法是采用了**同层比较和深度优先**的策略。

1. 不会去进行跨层的整棵树的比较。这也符合我们的开发，毕竟我们很少会跨层级的变更dom，这也使得diff算法的复杂度不再是O(n^3)。
2. 比较两个相同节点都有children时会深度优先的去递归比较其子孙节点。

![patchVnode](https://s3.qiufeng.blue/nan/patchVnode.jpg)

```javascript
function patchVnode(oldVnode, newVnode) {
  if(oldVnode === nexwwVnode) return
  const elm = newVnode.elm = oldVnode.elm // 新Vnode也要存在对旧Vnode真实DOM的引用
  const oldCh = oldVnode.children
  const newCh = newVnode.children
  if(newVnode.text !== undefined && !newCh) {
    elm.innerText = newVnode.text
  } else {
    if(oldCh !== undefined && oldCh.length > 0) {
      // 新旧VNode都有children且不相同
      if(oldCh !== newCh) updateChildren(elm, oldCh, newCh)
    } else {
      // 旧VNode没有children,新VNode有children
      // 直接遍历创建
      elm.innerText = ""
      for(let i = 0; i < newCh.length; i++) {
        let newChDom = createElement(newCh[i]);
        elm.appendChild(newChDom);
      }
    }
  }
}
```

### updateChildren - diff核心

由上可知，在新旧节点都有children的情况下，会对它们的子节点children数组进行diff，这是整个diff的核心。

从旧children数组 -> 新children数组，无非是通过删除、新增、移动、修改来完成。

diff算法就是解决如何以最小的资源开销来完成DOM的更新。

`snabbdom`的diff算法采用了一种**双端比较**的方法，同时从新旧children的头尾开始进行比较。使用了4个指针，分别指向oldChildren和newChildren数组的头部和尾部。

我们假设有这样两组children（为了能做到最大程度的复用，给每个vnode都添加上`key`属性，让它们有唯一的标志。）

```javascript
// 旧children
[
	{
		sel: 'li',
		key: 1,
		text: 1
	},
	{
		sel: 'li',
		key: 2,
		text: 2
	},
	{
		sel: 'li',
		key: 3,
		text: 3
	}
]
// 新children
[
	{
		sel: 'li',
		key: 2,
		text: 2
	},
	{
		sel: 'li',
		key: 3,
		text: 3
	},
	{
		sel: 'li',
		key: 1,
		text: 1
	}
]
```

![未命名文件 (1)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(2).png)

所以我们先来定义出初始的4个指针及4个指针指向的VNode。

```javascript
function updateChildren(elm, oldCh, newCh) {
  let oldStartIdx = 0; // 旧前
  let newStartIdx = 0; // 新前
  let oldEndIdx = oldCh.length - 1; // 旧后
  let newEndIdx = newCh.length - 1; // 旧后

  let oldStartVnode = oldCh[0]; // 旧前节点
  let oldEndVnode = oldCh[oldEndIdx]; // 旧后节点
  let newStartVnode = newCh[0]; // 新前节点
  let newEndVnode = newCh[newEndIdx]; // 新后节点
}
```

**双端比较**的规则是这样的：

1. 先用旧前节点和新前节点相比较。
2. 再用旧后节点和新后节点相比较。
3. 再用旧前节点和新后节点相比较。
4. 再用旧后节点和新前节点相比较。

在这个过程中试图去找有无相同的节点可以复用，即`sel`和`key`都相同的节点。一旦在某一步中找到了可复用节点，就会停止后续的查找。我们用一个while循环来遍历oldChildren和newChildren一轮一轮的进行查找，直到oldChildren或newChildren某一个被遍历完则结束🔚。

如果在某一步中找到了可复用的节点，我们就需要把指针给上移或者下移一位，进行下一轮的比较。

```javascript
function updateChildren(elm, oldCh, newCh) {
  let oldStartIdx = 0; // 旧前
  let newStartIdx = 0; // 新前
  let oldEndIdx = oldCh.length - 1; // 旧后
  let newEndIdx = newCh.length - 1; // 旧后

  let oldStartVnode = oldCh[0]; // 旧前节点
  let oldEndVnode = oldCh[oldEndIdx]; // 旧后节点
  let newStartVnode = newCh[0]; // 新前节点
  let newEndVnode = newCh[newEndIdx]; // 新后节点
  
  // 开始while循环
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx ) {
    // 首先4个if判断保证4个vnode都不为空，若为空则上移/下移指针
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    }
    
    // 对4种规则进行判断比较
    else if(sameVnode(oldStartVnode, newStartVnode)) {
      // 1⃣️，旧前与新前为同一节点
      patchVnode(oldStartVnode, newStartVnode) // 进行patch更新
      // 下移旧前和新前指针
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }
    
    else if(sameVnode(oldEndVnode, newEndVnode)) {
      // 2⃣️，旧后与新后为同一节点
      patchVnode(oldEndVnode, newEndVnode) // 进行patch更新
      // 上移旧后和新后指针
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }
    
    else if(sameVnode(oldStartVnode, newEndVnode)) {
      // 3⃣️，旧前与新后为同一节点
      patchVnode(oldStartVnode, newEndVnode); // 进行patch更新
      // 要移动节点,把旧前移动到旧后之后
      elm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
      // 下移旧前指针，上移新后指针
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }
    
    else if(sameVnode(oldEndVnode, newStartVnode)) {
      // 4⃣️，旧后与新前为同一节点
      patchVnode(oldEndVnode, newStartVnode); // 进行patch更新
      // 要移动节点,把旧后移动到旧前之前
      elm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
      // 上移旧后指针，下移新前指针
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }
  }
}
```

比如以上图为例，在第一轮中：

- 旧前1和新前2对比，key不相同，不可以复用。
- 旧后3和新后1对比，key不相同，不可以复用。
- 旧前1和新后1对比，key相同，是同一个节点，可以复用。

所以我们走到了旧前和新后的对比判断里，把这个节点的前后状态patch更新。因为最终的DOM的顺序是新children的顺序，现在这个节点现在到了这轮比较的最后的位置，所以我们要把其对应的DOM元素移动到当前旧后的后面，当前节点处理完毕，相应的旧前指针要下移一位，新后指针要上移一位。

这一步完成后，就变成了如下图这样的。

![未命名文件 (1)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(3).png)

继续进行第二轮的对比：

- 旧前2和新前2对比，key相同，是同一个节点，可以复用。

然后把前后进行patch更新，不用移动节点的位置。继续下移两个指针。进行下一轮对比

- 旧前3和新前3对比，key相同，是同一个节点，可以复用。

然后把前后进行patch更新，不用移动节点的位置。继续下移两个指针。

此时发现不满足while循环的条件，跳出循环。

但若如下图栗子🌰，在循环对比中，这四种规则判断后都没有找到可复用的节点呢？

![未命名文件 (4)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(4).png)

我们可以拿着新前这个节点去当前旧children中寻找有没有拥有相同key值的节点，若有，说明当前这个节点在旧children中是存在的。那么我们只需对比更新，然后把这个节点移动到相应的位置即可。如果没找到，说明这是一个全新的节点，那我们直接创建新的DOM插入到相应的位置即可。

除了两层for循环的遍历的方式外，我们可以采取性能优化，以空间换取时间，建一个oldChildren的key to index Map来处理。键为节点的key，值为节点在oldChildren中的index值。

如上，就得到一个`keyToIndexMap = {"1" => 0,"2" => 1,"3" => 2,"4" => 3}`

```javascript
function updateChildren(elm, oldCh, newCh) {
  // ....
  
  let keyToIndexMap = null; //创建一个key -> index的Map用于四种情况都没有命中时的处理
  
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx ) {
    // 首先4个if判断保证4个vnode都不为空，若为空则上移/下移指针
    // ....
    
    // 对4种规则进行判断比较
    else if(sameVnode(oldStartVnode, newStartVnode)) {
      // ....
    } else if(sameVnode(oldEndVnode, newEndVnode)) {
      // ....
    } else if(sameVnode(oldStartVnode, newEndVnode)) {
      // ....
    } else if(sameVnode(oldEndVnode, newStartVnode)) {
      // ....
    }
    
    // 若进行以上4种规则都没有找到可复用节点
    else {
      // 给剩余未处理oldChildren创建一个key -> index的map
      if(!keyToIndexMap) {
        keyToIndexMap = {}
        for(let i = oldStartIdx; i<= oldEndIdx; i++) {
          const key = oldCh[i].key
          if(key !== undefined) {
            keyToIndexMap[key] = i
          }
        }
      }
      // 寻找当前newStartVnode这项在keyMap中的位置序号
      const idxInOld = keyToIndexMap[newStartVnode.key]
      if(idxInOld) {
        // 当前节点在oldCh中存在，复用。
        const elmToMove = oldCh[idxInOld]
        patchVnode(elmToMove, newStartVnode); // 进行patch
        // 把这项设置为undefined，表示已处理完这项，再次遍历到不会进行处理
        oldCh[idxInOld] = undefined;
        // 移动节点，把此节点移动到旧前之前
        elm.insertBefore(elmToMove.elm, oldStartVnode.elm);
      } else {
        // 当前节点在old中不存在，直接创建新的dom并插入旧前之前
        elm.insertBefore(createElement(newStartVnode), oldStartVnode.elm);
      }
      // 把当前新前的指针下移
      newStartVnode = newCh[++newStartIdx];
    }
  }
}
```

在while循环跳出结束后，还需要判断一下新旧`children`的数组有无未处理到的节点。

若此时`newStartIdx <= newEndIdx`，说明新children中还有没处理完的全新节点，要把这些节点插入到`newCh[newEndIdx+1]`之前。

若此时`oldStartIdx <= oldEndIdx`，说明旧children中还有没处理完的剩余节点，它们已经在新children中不存在了，要把这些节点都移除。

```javascript
// while循环结束后，判断是否还有节点没有处理
  if(newStartIdx <= newEndIdx) {
    // newCh还没有处理完,要把这些剩余节点添加插入到合适的位置
    const before = newCh[newEndIdx+1] == null ? null : newCh[newEndIdx+1].elm // 即把这些项插入到newCh[newEndIdx+1]之前
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      elm.insertBefore(createElement(newCh[i]), before);
    }
  }
  else if(oldStartIdx <= oldEndIdx) {
    // oldCh还没有遍历完，要把这些剩余节点移除
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (oldCh[i]) {
        elm.removeChild(oldCh[i].elm);
      }
    }
  }
```

![updateChildren(elm,oldCh,newCh)](https://s3.qiufeng.blue/nan/updateChildren.jpg)

至此，diff的核心流程结束。

### 总结

vue2的diff是借鉴了`snabbdom`，通过**同层比较**，**深度优先遍历**，**双端比较**几个策略来实现。

## vue3

Vue3中的核心diff算法参考了`inferno`，在对新旧children数组进行对比diff时，不同于vue2的**双端比较**。

在进行真正核心diff之前，会先进行一个头尾单向遍历的预处理优化。这一优化最初由 [Neil Fraser](https://neil.fraser.name/writing/diff/) 在这篇文章里提出。

### 一. "去除"相同的前置和后置元素

```javascript
old: [1,2,3,5,6]
new: [1,2,3,4,5,6]
```

对比可以发现，这两个数组的前置元素`1,2,3`和后置元素`5,6`都是相同的，于是真正需要diff的就变成了：

```javascript
old: 
new: 4
```

我们只需把4这个元素插入即可。

通过比较找到相同的前置和后置元素，可以先"去除掉"这些元素，避免后续真正核心diff算法的执行。

#### 1. **从头部开始遍历**

所以我们按照这个思想先从头部依次开始遍历，判断是否为同一个节点。若为同一个节点，进行patch更新，再向后继续遍历。直到遇到不相同的两个头部节点，则break跳出。

新建一个指针i，用来记录当前从头遍历到了哪个位置。所以循环的条件是`i <= e1 && i<= e2 `。

```javascript
let i = 0;
const l2 = c2.length
let e1 = oldChildren.length - 1 // prev ending index
let e2 = newChildren.length - 1 // next ending index

// 1. 从头部开始遍历，直到遇到不相同的节点。sync from start
while(i <= e1 && i <= e2) {
  const n1 = oldChildren[i]
  const n2 = newChildren[i]
  if(sameVnode(n1,n2)) {
    patch(n1,n2) // 进行patch更新
  } else {
    break
  }
  i++
}
```

如下图这个栗子，这一步进行完后旧children剩下e节点，新children剩下f,e节点。此时i = 2 , e1 = 2 , e2 = 3。

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(8).png)

#### 2. **从尾部开始遍历**

然后再从新旧children的尾部开始向前遍历，用e1和e2的值来记录从尾部处理到了哪个位置，循环的条件还是`i <= e1 && i<= e2 `。

```javascript
// 2. 从尾部开始遍历，直到遇到不相同的节点。sync from end
while(i <= e1 && i <= e2) {
  // 从两个children的末尾元素开始
  const n1 = oldChildren[e1]
  const n2 = newChildren[e2]
  if(sameVnode(n1,n2)) {
    patch(n1,n2) // 进行patch更新
  } else {
    break
  }
  e1--
  e2--
}
```

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(9).png)

这一步进行完后旧children所有节点都遍历完毕，新children剩下f节点。此时i = 2 , e1 = 1 , e2 = 2。

相同的前置和后置元素都找到且patch更新完毕。

### 二. 若一方遍历完毕，挂载新添加节点或删除旧剩余节点

进行了头尾遍历并“去除”后，若有其中一方此时遍历完毕了，则说明有剩余新的待挂载节点或者旧的待删除节点。

#### 3.  **旧children遍历完毕，挂载新添加的节点**

若`i > e1`，说明此时旧children已经遍历完毕。若此时`i <= e2`，说明新children中有全新的节点需要挂载。全新的节点可能有很多，需要递归挂载。挂载位置就是在e2对应的下一个节点的DOM元素之前。

```javascript
// 3. common sequence + mount
// (a b)
// (a b) c
// i = 2, e1 = 1, e2 = 2
// (a b)
// c (a b)
// i = 0, e1 = -1, e2 = 0
if (i > e1) {
	if(i <= e2) {
    const nextPos = e2 + 1 // e2的下一个节点
    const anchor = nextPos < l2 ? c2[nextPos].el : null
    while(i <= e2) {
      // 在anchor之前插入新增节点...
      // i++
    }
  }
}
```

如上图栗子，进行完这一步后，f节点就被挂载到了e之前。

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(10).png)

#### 4. **新children遍历完毕，删除旧剩余的节点**

但若`i > e2`，说明此时新children已经遍历完成。

如下图所示栗子：

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(11).png)

则要递归移除旧children中`i ～ e1`之间的c,d节点。

```javascript
// 4. common sequence + unmount
// (a b) c
// (a b)
// i = 2, e1 = 2, e2 = 1
// a (b c)
// (b c)
// i = 0, e1 = 0, e2 = -1
else if(i > e2) {
  while(i <= e1) {
    // 卸载节点...
  }
}
```

到目前为止，总体的代码结构是这样的：

```javascript
let i = 0;
const l2 = c2.length
let e1 = oldChildren.length - 1 // prev ending index
let e2 = newChildren.length - 1 // next ending index

// 1⃣️ 进行头部遍历，直到遇到不相同的节点。
while(i <= e1 && i <= e2) {
  ...
}
// 2⃣️ 从尾部开始遍历，直到遇到不相同的节点。
while(i <= e1 && i <= e2) {
  ...
}

// 3⃣️ 旧children被遍历完
if (i > e1) {
	if(i <= e2) {
    // 有要新挂载的节点
    ...
  }
}
// 4⃣️ 新children被遍历完
else if(i > e2) {
  // 有要移除的节点
  ...
}
```

### 三. 都剩余未知子序列 - 进入核心diff

当然大多数情况并不会那么简单理想，很多情况是进行完**头尾比较**这个处理后新旧children都没有遍历完。

如下图例子，进行完头尾比较后，旧children中还剩c,d两个，新children中还剩f,d,c三个。

此时我们可以认为新旧children的diff对比就简化为了这两个剩余数组的diff对比，也进入了真正的核心diff算法。

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(13).png)

首先这时的代码逻辑应该走到都没有被遍历完也就是5 ->  else里。

```javascript
// 3⃣️ 旧children被遍历完
if (i > e1) {
	if(i <= e2) {
    // 有要新挂载的节点
    ...
  }
}
// 4⃣️ 新children被遍历完
else if(i > e2) {
  // 有要移除的节点
  ...
}
// 5⃣️ 新旧children被没有被遍历完
// 5. unknown sequence
// [i ... e1 + 1]: a b [c d e] f g
// [i ... e2 + 1]: a b [e d c h] f g
// i = 2, e1 = 4, e2 = 5
else {
  // ...
  // 这里写逻辑
}
```

#### 5.1 为新children创建key:index的map

首先我们创建一个Map，作为新剩余（待处理）数组(newChildren)中 key -> index的映射。

```javascript
else {
  // 先把当前i的位置存储下来
  const s1 = i
  const s2 = i
  
  // 5.1 创建key:index map for newChildren
  const keyToNewIndexMap = new Map()
  // s2为当前新children中剩余节点的开端，e2为结尾
  for(i = s2; i<= e2; i++) {
    const nextChild = c2[i]
    if(nextChild.key !== null) {
      keyToNewIndexMap.set(nextChild.key, i)
    }
  }
}
```

经历完这一步，我们就得到了一个**keyToNewIndexMap**如图所示。

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(14).png)

#### 5.2 循环旧剩余节点，尝试patch复用节点和删除不在的节点

我们先来创建一个数组**newIndexToOldIndexMap**，这个数组的长度就是新children中剩余的子序列的长度，并把初始值全部设为0。这个数组要存储新children中的元素在旧children中的索引，用来计算之后需要移动时的最长递增子序列。

```javascript
// 5.2
let j
let patched = 0 // 记录比较过的数量
const toBePatched = e2 - s2 + 1 // 记录新children中待比较的数量
const moved = false // 记录是否需要移动节点
let maxNewIndexSoFar = 0 // 记录遍历到达过最远的新children中的位置来判断是否有节点需要移动

// 这个数组之后用来存储新children中的元素在旧children中的索引
const newIndexToOldIndexMap = New Array(toBePatched) // -> [,,,]
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0 // -> [0,0,0]
```

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(15).png)

接着我们就可以来遍历旧的剩余（待处理）数组，尝试是否可以在**keyToNewIndexMap**这个新children的Map中寻找到相同节点。

如果能找到，说明可以复用并进行patch更新，同时我们把当前节点在旧children中的索引记录下来，并偏移一位(+1)赋值给`newIndexToOldIndexMap`的相同位置。

找不到说明此节点在新children中已经没有了，则删除已经不存在的节点。

```javascript
// 遍历旧children的剩余待处理节点
for(i = s1; i <= e1; i++) {
  const prevChild = c1[i]
  let newIndex
  if(prevChild.key != null) {
    // 拿到此节点在新children数组中的位置index
    newIndex = keyToNewIndexMap.get(prevChild.key)
  }
  // 这个旧节点已经在新children数组中已经不存在了
  if(newIndex === undefined) {
    // 卸载节点。
    // ...
  } else {
   	// 旧节点在新children数组中仍存在
    // 就把上面的创建数组的数值填充为 i + 1的值（即当前节点在旧children中的index 位置 + 1的值），避免i=0的情况
    newIndexToOldIndexMap[newIndex - s2] = i + 1
    
    patch(prevChild,c2[newIndex]) // 进行patch更新
    patched++
  }
}
```

我们每次如果在新children中找到旧children中的元素，会进行patch更新，并用patched的值来标记已经更新过几个。若新children中的节点都已被patch过，那其实就不用继续遍历旧children了，直接把剩下的卸载就可以了。

我们来补充逻辑。

```javascript
if(patched >= toBePatched) {
  // 卸载节点...
  continue
}
```

此时数组就变成了如下图所示，d,c节点对应的`newIndexToOldIndexMap`数组的位置的值被填充为了当前新节点在旧children数组中的index+1的值。

如果最后还有元素对应的位置值为最初的0，说明这个元素在旧children中不存在，是新添加的。

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(16).png)

**判断是否有节点需要移动**

我们上面定义了一个`maxNewIndexSoFar`，初始值为0，用来记录遍历到达过最远的新children中的位置。

首次先把第一次`newIndex`的值赋给`maxNewIndexSoFar`，若之后有某次的`newIndex`的值小于`maxNewIndexSoFar`，说明本来在旧children中位置比某个节点靠后的节点，到了新children中位置比那个节点位置靠前了。此时就需要进行移动操作，把moved置为true来标记。

所以补充上面的逻辑：

```javascript
for(i = s1; i <= e1; i++) {
  const prevChild = c1[i]
  if(patched >= toBePatched) {
    // 卸载节点。
    continue
  }
  let newIndex
  if(prevChild.key != null) {
    // 拿到此节点在新children数组中的位置index
    newIndex = keyToNewIndexMap.get(prevChild.key)
  }
  // 这个旧节点已经在新children数组中已经不存在了
  if(newIndex === undefined) {
    // 卸载节点。
  } else {
   	// 旧节点在新children数组中仍存在
    // 就把上面的创建数组的数值填充为 i + 1的值（即当前节点在旧children中的index 位置 + 1的值）
    newIndexToOldIndexMap[newIndex - s2] = i + 1
    
    if(newIndex >= maxNewIndexSoFar) {
      maxNewIndexSoFar = newIndex
    } else {
      moved = true
    }
    
    patch(prevChild,c2[newIndex]) // 进行patch更新
    patched++
  }
}
```



我们上面通过遍历旧children中的节点，查找它是否在新children中存在。若不存在，直接卸载删除节点。若存在，则进行patch更新，并得出了是否从旧 -> 新是否需要进行移动节点这一操作的结论（即moved是否为true），并没有直接移动节点的位置。

#### **5.3 移动和挂载move and mount**

目前为止我们的`newIndexToOldIndexMap`数组还没有用到过。接下来我们就可以写移动和挂载的逻辑。

```javascript
// 5.3 move and mount
// 仅当节点需要移动时生成最长递增子序列
const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
```

首先如果moved为true即需要有移动的节点，我们用`getSequence`计算得到一个最长递增子序列数组`increasingNewIndexSequence`。

我们看下面这个案例（新案例）👇，结合上面讲的可以很快得到keyToNewIndexMap和newIndexToOldIndexMap数组，如图所示：

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(18).png)

我们先简单说一下什么是最长递增子序列：

> [Wikipedia](https://zh.wikipedia.org/wiki/%E6%9C%80%E9%95%BF%E9%80%92%E5%A2%9E%E5%AD%90%E5%BA%8F%E5%88%97)：最长递增子序列（longest increasing subsequence）是指，在一个给定的数值序列中，找到一个子序列，使得这个子序列元素的数值依次递增，并且这个子序列的长度尽可能地大。最长递增子序列中的元素在原序列中不一定是连续的。

> 对于以下的原始序列 :
>
> [8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7]
>
> 最长递增子序列为:
>
> [2, 6, 9, 11]
>
> 值得注意的是原始序列的最长递增子序列并不一定唯一，对于该原始序列，实际上还有以下三个最长递增子序列:
>
> [4, 6, 9, 11]
>
> [4, 6, 9, 13]
>
> [2, 6, 9, 13]

在vue3中，我们求的最长递增子序列不是像上面一样具体的值，而是其对应的下标。具体的最长递增子序列求解算法我们在这里先不展开。

对`newIndexToOldIndexMap`为[5, 3, 4, 0]这个数组来说，其最长递增子序列是[3,4]，在vue3中我们取的是其下标，也就是[1,2]，得到`increasingNewIndexSequence`为[1,2]。

```javascript
// 5.3 move and mount
// 仅当节点需要移动时生成最长递增子序列
const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
j = increasingNewIndexSequence.length - 1

for(i = toBePatched - 1; i>= 0; i--) {
  const nextIndex = s2 + i // 新children的最后一个待处理的节点index
  const nextChild = c2[nextIndex]
  // 锚点
  const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor
  
  if(newIndexToOldIndexMap[i] === 0) {
    // 说明还是初始值，为新节点，挂载新节点
    ....
  } else if(moved) {
    // 移动的条件是 j<0 即没有最长递增子序列 或者 当前索引值i不在最长递增子序列内
    if(j < 0 || i !== increasingNewIndexSequence[j]) {
      move(nextChild,container,anchor) // 移动节点，插入锚点之前
    } else {
      // 有最长递增子序列且当前索引值i ===increasingNewIndexSequence[j] 的话就不用移动
      // j递减指向上一位即可
      j--
    }
  }
}

```

在计算出最长递增子序列数组后，我们对剩下待处理的新children的节点数组开始倒序遍历，以便我们可以使用最后一个被更新的节点作为锚点。

第一次是这样如下图这样的，i = toBePatched - 1 = 3，j = 1,从节点g开始向前遍历，锚点为节点e。然后newIndexToOldIndexMap[i]为0，说明节点g是新节点，进行挂载。

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(19).png)

然后进入第二轮循环，i=2，nextIndex = 4指向节点d，j = 1, 此时newIndexToOldIndexMap[i]不为0，且 j > 0 && i === increasingNewIndexSequence[j]，所以这个节点位于最长递增子序列内，不用做移动操作，直接 j-1。(进入下一轮循环，发现c节点也是在最长递增子序列，与d节点流程一样，j-1。（经过两次，此时j变成了-1。）)

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(20).png)

循环最后到达f节点，此时I = 0, j = -1，newIndexToOldIndexMap[i]为5，且J<0的条件满足，所以这个节点需要移动，把f节点移动到锚点c节点之前。

![未命名文件 (5)](https://s3.qiufeng.blue/nan/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20(21).png)



至此，我们完成了**移动和挂载**操作，也完成了新旧children数组的整个diff过程。

## 总结

比较一下vue2和vue3的diff流程，思维导图待补充。