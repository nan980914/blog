(window.webpackJsonp=window.webpackJsonp||[]).push([[124],{490:function(t,s,e){"use strict";e.r(s);var a=e(44),n=Object(a.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"我们应该如何学习-element-ui-源码"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#我们应该如何学习-element-ui-源码"}},[t._v("#")]),t._v(" 我们应该如何学习 element-ui 源码？")]),t._v(" "),e("h2",{attrs:{id:"_1-前言"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-前言"}},[t._v("#")]),t._v(" 1.前言")]),t._v(" "),e("p",[t._v("最近在维护团队内部的组件库，所以对组件库的整体框架有一些见解吧。因为对内组件库不公开，所以我们来讲讲 element-ui 的整体框架吧。很多人对于这种巨型库的源码有一种莫名的害怕，并且哪怕拿到整个库的源码，也不知道如何去阅读，但是看到有些大佬，明明都没有怎么阅读过这个库的源码，遇到问题，却能直接去分析源码，并且定位到根本问题。(本文都是个人见解哈，如有错误可以指出)")]),t._v(" "),e("p",[t._v("所以本文就三点进行讲解：")]),t._v(" "),e("p",[t._v("1.为什么别人学习源码那么快？")]),t._v(" "),e("p",[t._v("2.阅读源码前所需要的步骤")]),t._v(" "),e("p",[t._v("3.如何阅读源码以element-ui为例")]),t._v(" "),e("h2",{attrs:{id:"_2-为什么别人学习源码那么快"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-为什么别人学习源码那么快"}},[t._v("#")]),t._v(" 2 为什么别人学习源码那么快？")]),t._v(" "),e("p",[t._v("其实学习的快，又回到了以前高中时代，所说的学习方法，然后又回到了如何高效学习。。。但是本文不讨论那么高深的东西。我认为学习这一类的源码有两点吧。")]),t._v(" "),e("p",[t._v("1.心智模型")]),t._v(" "),e("p",[t._v("2.做大于看")]),t._v(" "),e("h3",{attrs:{id:"_2-1-心智模型"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-心智模型"}},[t._v("#")]),t._v(" 2.1 心智模型")]),t._v(" "),e("p",[t._v("那么什么是心智模型？所谓心智模式是指深植我们心中关于我们自己、别人、组织及周围世界每个层面的假设、形象和故事。并深受习惯思维、定势思维、已有知识的局限。")]),t._v(" "),e("p",[t._v("“心智模型是经由经验及学习，脑海中对某些事物发展的过程，所写下的剧本。”")]),t._v(" "),e("p",[t._v("“心智模型是你对事物运行发展的预测。”")]),t._v(" "),e("p",[t._v("简单概括来讲，就是你对一个事物下意识的判定。")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufengh.com/blog/521abef50a43e595b4d69d721a776857_1440w.jpg",alt:"521abef50a43e595b4d69d721a776857_1440w"}})]),t._v(" "),e("p",[t._v("那么心智模型又是怎么和源码学习结合在一起的呢？其实这也是经验的积累，对项目工程化的熟悉，例如源码库有很多目录，我们会有一套默认的书写方式，我们知道 "),e("code",[t._v("src")]),t._v(" 目录下放的是源码、test 下放的是测试用例、"),e("code",[t._v("packages")]),t._v(" 目录可以联想到 "),e("code",[t._v("monorepo")]),t._v(" 风格多包单独抽离，想到 "),e("code",[t._v("yarn workspace")]),t._v("，例如"),e("code",[t._v("yarn workspace")]),t._v(" 你用 "),e("code",[t._v("npm")]),t._v(" 安装是会出错的，这如果你是重度  "),e("code",[t._v("npm")]),t._v(" 用户，这就够你喝一壶的等等。。。这些都是我们的心智模型，所以一些大佬源码阅读的多了，就会形成一套流水线式的套路，先找 "),e("code",[t._v("package.json")]),t._v(" ，去确定主入口，然后一步一步地去往内层读，大多数的目录名称都是语义化的。唯一阻碍你的可能就是英文意思，这个....读多了也能克服，我反正英语渣....")]),t._v(" "),e("p",[t._v("所以别看那些大佬看的很快，在这背后也是人家前期的积累，肯定看过不少框架源码。所以加强自己的心智模型的方法就是多看，哈哈哈哈，我仿佛说了废话，但是如何入门，可以看我后面部分，带你学习。")]),t._v(" "),e("h3",{attrs:{id:"_2-2-做大于看"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-做大于看"}},[t._v("#")]),t._v(" 2.2 做大于看")]),t._v(" "),e("p",[t._v("遇到一个源码中的问题，往往大家就慌了，不知道他到底哪里出错了，源码这么多，调试起来肯定很麻烦，算了算了，换个方法试试？如果是对于一个业务紧急状态下，换方法可以说是比较明智的原则，因为软件最终服务于业务，如何快速解决确实是对的，但是对于我们日常的学习中，你遇到问题了，还是这样，那么很难挖掘深层次，也比较难提高。其实入手源码也很简单，你只要在源码中写上一个简单的 "),e("code",[t._v("console.log")]),t._v(" ，因为其实如果你不长期维护一个源码框架，你对其实的一些实现细节是很难记住的。（反正我自己维护的库，好久没维护，过一段时间来看，也很难记住其中一些细节) 所以这个时候，你需要了解其中到底发生了什么，**看源码，不是真的看源码，你得去调试，去打印出其中的关键点。**例如其实很多源码问题，都是有错误栈的，你可以根据错误栈一步一步地去打印值，然后一步一步地去跟踪定位。（当然方法你用 "),e("code",[t._v("console.log")]),t._v(" 还是用 "),e("code",[t._v("debugger")]),t._v(" 都是无所谓，各种方法各有各的好处。）")]),t._v(" "),e("h2",{attrs:{id:"_3-阅读源码前所需要的步骤"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-阅读源码前所需要的步骤"}},[t._v("#")]),t._v(" 3. 阅读源码前所需要的步骤")]),t._v(" "),e("h3",{attrs:{id:"_3-1-拉代码"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-拉代码"}},[t._v("#")]),t._v(" 3.1.拉代码")]),t._v(" "),e("h4",{attrs:{id:"_3-1-1-拉取到本地"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-1-拉取到本地"}},[t._v("#")]),t._v(" 3.1.1 拉取到本地")]),t._v(" "),e("p",[t._v("很多人可能在这个步骤就有问题，github 一般来讲都比较慢, 很容易出现超时等问题。")]),t._v(" "),e("p",[e("code",[t._v("error: RPC failed; HTTP 504 curl 22 The requested URL returned error: 504 Gateway Time-out")])]),t._v(" "),e("p",[t._v("因为一般源码库经过长期的迭代，都是一个巨无霸的存在，所以你不要"),e("code",[t._v("clone")]),t._v("全部的代码，只需要指定获取最新的一次 "),e("code",[t._v("commit")]),t._v(" 即可，通过指定 "),e("code",[t._v("--depth=1")]),t._v("就可以达到这个效果。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("git clone --depth=1 xxxx\n")])])]),e("p",[t._v("如果你只需要看某个版本，或者某个分支，可以像下面这样指定。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("git clone -b xxx --depth=1 xxxx\n")])])]),e("h4",{attrs:{id:"_3-1-2-在线查看"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-2-在线查看"}},[t._v("#")]),t._v(" 3.1.2 在线查看")]),t._v(" "),e("p",[t._v("如果你看的源码库不太复杂，你也可以选择在线查看, 当然不是 "),e("code",[t._v("github")]),t._v(" 上面，那样太慢了。可以装一个叫做 "),e("code",[t._v("Gitpod Online IDE")]),t._v("的插件。")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufengh.com/blog/image-20200420232349711.png",alt:"image-20200420232349711"}})]),t._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufengh.com/blog/image-20200420232418856.png",alt:"image-20200420232418856"}})]),t._v(" "),e("p",[t._v("然后会在 clone 的地方多出一个小按钮，点击后。")]),t._v(" "),e("h3",{attrs:{id:"_3-2-看贡献指南"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-看贡献指南"}},[t._v("#")]),t._v(" 3.2.看贡献指南")]),t._v(" "),e("p",[t._v("阅读前当前是拉取项目")]),t._v(" "),e("p",[t._v("需要注意 --depth")]),t._v(" "),e("p",[t._v("安装依赖")]),t._v(" "),e("p",[t._v("npm 和 yarn 是不一样的，需要特别注意")]),t._v(" "),e("h2",{attrs:{id:"_4-如何阅读源码以element-ui为例"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-如何阅读源码以element-ui为例"}},[t._v("#")]),t._v(" 4.如何阅读源码以element-ui为例")]),t._v(" "),e("h3",{attrs:{id:"_4-1-快速起步"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-快速起步"}},[t._v("#")]),t._v(" 4.1 快速起步")]),t._v(" "),e("p",[t._v("首先来看 "),e("code",[t._v("package.json")])]),t._v(" "),e("div",{staticClass:"language-json extra-class"},[e("pre",{pre:!0,attrs:{class:"language-json"}},[e("code",[e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"scripts"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t...\n    "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"bootstrap"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"yarn || npm i"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"build:file"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"dev"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"dev:play"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"dist"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"test"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ BABEL_ENV=test karma start test/unit/karma.conf.js --single-run"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   \t...\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n")])])]),e("p",[t._v("吧啦吧啦，有一堆的命令，但是我们不需要知道所有的，我们只需要知道怎么让这个项目跑起来，哦，常用的不就是")]),t._v(" "),e("h3",{attrs:{id:"_4-2-调试代码"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-调试代码"}},[t._v("#")]),t._v(" 4.2 调试代码")]),t._v(" "),e("h3",{attrs:{id:"_4-3-目的驱动"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-3-目的驱动"}},[t._v("#")]),t._v(" 4.3 目的驱动")]),t._v(" "),e("h3",{attrs:{id:"_4-4-了解生态"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-4-了解生态"}},[t._v("#")]),t._v(" 4.4 了解生态")]),t._v(" "),e("p",[t._v("首先我们需要让这个项目跑起来")]),t._v(" "),e("p",[t._v("目录结构输出 "),e("code",[t._v('tree -L 2 ./ -I "node_modules|types"')]),t._v(" 省去了一些不重要的部分。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("├── build // 构建相关的脚本\n├── components.json  // 映射json，用于按需加载的包\n├── examples     // 使用示例\n├── package.json  \n├── packages \n│   ├── ...componments // 组件\n│   ├── theme-chalk    // 组件样式\n├── src\t\t\t\t\t\t\t //公共模块\n│   ├── directives\n│   ├── index.js\n│   ├── locale\n│   ├── mixins\n│   ├── transitions \n│   └── utils\t\t\t\t\n├── test\t\t\t // 测试用例\n│   ├── ssr\n│   └── unit\n")])])]),e("p",[t._v("框架")]),t._v(" "),e("p",[t._v("看 package.json -> 看 script 脚本 ->")]),t._v(" "),e("p",[t._v("5.参考")]),t._v(" "),e("p",[t._v("https://www.zhihu.com/question/19940741/answer/64032790")])])}),[],!1,null,null,null);s.default=n.exports}}]);