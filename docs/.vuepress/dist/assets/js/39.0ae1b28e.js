(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{405:function(t,a,r){"use strict";r.r(a);var s=r(44),e=Object(s.a)({},(function(){var t=this,a=t.$createElement,r=t._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h1",{attrs:{id:"🎉喜大普奔-es2019登场"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#🎉喜大普奔-es2019登场"}},[t._v("#")]),t._v(" 🎉喜大普奔，ES2019登场")]),t._v(" "),r("p",[t._v("就在刚4个小时前，TC39将以下特性加入到了 ES2019 中。让我们来看看这些新的特性给我们带来了什么样的改变。")]),t._v(" "),r("p",[r("img",{attrs:{src:"https://user-gold-cdn.xitu.io/2019/1/30/1689cfe1dc0dc14c?w=1912&h=840&f=jpeg&s=209360",alt:"1548822100255.jpg"}})]),t._v(" "),r("h1",{attrs:{id:"es2019-新特性"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#es2019-新特性"}},[t._v("#")]),t._v(" ES2019 新特性:")]),t._v(" "),r("p",[t._v("➡️ Array#{flat,flatMap}")]),t._v(" "),r("p",[t._v("➡️ Object.fromEntries")]),t._v(" "),r("p",[t._v("➡️ String#{trimStart,trimEnd}")]),t._v(" "),r("p",[t._v("➡️ Symbol#description")]),t._v(" "),r("p",[t._v("➡️ try { } catch {} // optional binding")]),t._v(" "),r("p",[t._v("➡️ JSON ⊂ ECMAScript")]),t._v(" "),r("p",[t._v("➡️ well-formed JSON.stringify")]),t._v(" "),r("p",[t._v("➡️ stable Array#sort")]),t._v(" "),r("p",[t._v("➡️ revised Function#toString")]),t._v(" "),r("h2",{attrs:{id:"json-⊂-ecmascript-json-superset"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#json-⊂-ecmascript-json-superset"}},[t._v("#")]),t._v(" JSON ⊂ ECMAScript （JSON superset）")]),t._v(" "),r("p",[t._v("行分隔符（U + 2028）和段分隔符（U + 2029）符号现在允许在字符串文字中，与JSON匹配。 以前，这些符号在字符串文字中被视为行终止符，因此使用它们会导致SyntaxError异常。")]),t._v(" "),r("h2",{attrs:{id:"well-formed-json-stringify"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#well-formed-json-stringify"}},[t._v("#")]),t._v(" well-formed JSON.stringify")]),t._v(" "),r("p",[t._v("更加友好的 JSON.stringify （修复了对于一些超出范围的 unicode 展示\b错误的问题。）")]),t._v(" "),r("p",[t._v("如果输入 Unicode 格式但是超出范围的字符，在原先JSON.stringify返回格式错误的Unicode字符串：")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("JSON.stringify('\\uD800');\n// → '\"�\"'\n")])])]),r("p",[t._v("现在实现了一个改变JSON.stringify的"),r("a",{attrs:{href:"https://github.com/tc39/proposal-well-formed-stringify",target:"_blank",rel:"noopener noreferrer"}},[t._v("第3阶段提案"),r("OutboundLink")],1),t._v("，因此它为其输出转义序列，使其成为有效Unicode（并以UTF-8表示）：")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("JSON.stringify('\\uD800');\n// → '\"\\\\ud800\"'\n在 chrome 控制台输出的是 '\"\\ud800\"' ，但只是一个显示值， 真实值为'\"\\\\ud800\"'。\n\nJSON.stringify('\\uD800') === '\"\\\\ud800\"';\n// → true\n")])])]),r("h2",{attrs:{id:"stable-array-sort"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#stable-array-sort"}},[t._v("#")]),t._v(" stable Array#sort")]),t._v(" "),r("p",[t._v("在以前，sort 函数中，10个以上元素的数组 V8 使用不稳定的QuickSort（快排。现在，使用稳定的TimSort算法。）")]),t._v(" "),r("p",[t._v("TimSort算法: https://en.wikipedia.org/wiki/Timsort")]),t._v(" "),r("h2",{attrs:{id:"revised-function-tostring"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#revised-function-tostring"}},[t._v("#")]),t._v(" revised Function#toString")]),t._v(" "),r("p",[r("a",{attrs:{href:"https://tc39.github.io/Function-prototype-toString-revision/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Function.prototype.toString()"),r("OutboundLink")],1),t._v("现在返回精确字符，包括空格和注释。原先和现在的比较：")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("// Note the comment between the `function` keyword\n// and the function name, as well as the space following\n// the function name.\nfunction /* a comment */ foo () {}\n\n// Previously:\nfoo.toString();\n// → 'function foo() {}'\n//             ^ no comment\n//                ^ no space\n\n// Now:\nfoo.toString();\n// → 'function /* comment */ foo () {}'\n\n")])])]),r("h2",{attrs:{id:"array-flat-flatmap"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#array-flat-flatmap"}},[t._v("#")]),t._v(" Array #{flat, flatMap}")]),t._v(" "),r("p",[t._v("数组降维，递归地将数组展平到指定的深度，默认为1。")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("// Flatten one level:\nconst array = [1, [2, [3]]];\narray.flat();\n// → [1, 2, [3]]\n\n// Flatten recursively until the array contains no more nested arrays:\narray.flat(Infinity);\n// → [1, 2, 3]\n")])])]),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("[2, 3, 4].flatMap((x) => [x, x * 2]);\n// → [2, 4, 3, 6, 4, 8]\n")])])]),r("hr"),t._v(" "),r("p",[t._v("2019.1.31 更新")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v('[2, 3, [2]].flatMap((x) => x + 1);\n// [3, 4, "21"]\n')])])]),r("p",[t._v("刚刚看到有人对这个结果有疑问，以为是flatMap内部有什么操作。\n其实这个是 "),r("code",[t._v("addition-operator-plus（+）")]),t._v("的原因。 + 会通过 "),r("code",[t._v("toprimitive")]),t._v(' 把数组转化为基础类型String。所以就是 [2] + 1 转化为 "2" + 1 === "21"。下面是佐证：')]),t._v(" "),r("p",[t._v("https://tc39.github.io/ecma262/#sec-addition-operator-plus\nhttps://tc39.github.io/ecma262/#sec-toprimitive")]),t._v(" "),r("hr"),t._v(" "),r("h2",{attrs:{id:"object-fromentries"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#object-fromentries"}},[t._v("#")]),t._v(" Object.fromEntries")]),t._v(" "),r("p",[t._v("Object.fromEntries（Object.entries（object））≈ 对象")]),t._v(" "),r("p",[t._v("它类似于Lodash的_.fromPairs。")]),t._v(" "),r("p",[r("img",{attrs:{src:"https://user-gold-cdn.xitu.io/2019/1/30/1689cfaba49767a7?w=918&h=517&f=png&s=69354",alt:"DYEuv5nW0AA5qHz.png"}})]),t._v(" "),r("h2",{attrs:{id:"string-trimstart-trimend"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#string-trimstart-trimend"}},[t._v("#")]),t._v(" String#{trimStart,trimEnd}")]),t._v(" "),r("p",[t._v("前后的空白符可以指定一边去除。")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("const string = '  hello world  ';\nstring.trimStart();\n// → 'hello world  '\nstring.trimEnd();\n// → '  hello world'\nstring.trim();\n// → 'hello world'\n")])])]),r("h2",{attrs:{id:"symbol-prototype-description"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#symbol-prototype-description"}},[t._v("#")]),t._v(" Symbol.prototype.description")]),t._v(" "),r("p",[t._v("通过工厂函数Symbol（）创建符号时，您可以选择通过参数提供字符串作为描述：")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("const sym = Symbol('The description');\n")])])]),r("p",[t._v("以前，访问描述的唯一方法是将符号转换为字符串：")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("assert.equal(String(sym), 'Symbol(The description)');\n")])])]),r("p",[t._v("现在引入了getter Symbol.prototype.description以直接访问描述：")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("assert.equal(sym.description, 'The description');\n")])])]),r("h2",{attrs:{id:"try-catch"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#try-catch"}},[t._v("#")]),t._v(" try {} catch {}")]),t._v(" "),r("p",[t._v("现在try {} catch {} 有了更加简便的方法，变成了可选型。")]),t._v(" "),r("p",[t._v("在以前")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("try {} catch (e) {}\n")])])]),r("p",[t._v("现在")]),t._v(" "),r("p",[r("img",{attrs:{src:"https://user-gold-cdn.xitu.io/2019/1/30/1689cfaba4ba000c?w=1364&h=338&f=png&s=152974",alt:"try-catch.png"}})]),t._v(" "),r("h1",{attrs:{id:"更多提案"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#更多提案"}},[t._v("#")]),t._v(" 更多提案：")]),t._v(" "),r("p",[t._v("https://github.com/tc39/proposals/blob/master/finished-proposals.md")]),t._v(" "),r("h1",{attrs:{id:"更多请关注"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#更多请关注"}},[t._v("#")]),t._v(" 更多请关注")]),t._v(" "),r("p",[r("img",{attrs:{src:"https://user-gold-cdn.xitu.io/2019/1/24/1688055012ff10bc?w=500&h=500&f=png&s=19651",alt:""}})])])}),[],!1,null,null,null);a.default=e.exports}}]);