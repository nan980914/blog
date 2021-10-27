# 多彩日志在部署系统的探索

## Travis CI

前段时间在使用 Travis CI 的时候发现它的部署日志包含了很多带色彩的日志。

<img src="https://s3.qiufeng.blue/nan/image-20210921230617642.png" alt="image-20210921230617642" style="zoom: 33%;" />

![image-20211014184326176](https://s3.qiufeng.blue/nan/image-20211014184326176.png)

这些彩色的日志非常有助于我们定位问题。

## Arthur

<img src="https://s3.qiufeng.blue/nan/image-20210923010032566.png" alt="image-20210923010032566" />

![image-20210923011214230](https://s3.qiufeng.blue/nan/image-20210923011214230.png)

可以看出Arthur应该是用了特征识别关键字来做的色彩。

识别到warning就会添加黄色，识别到error就会添加红色。而不是与终端输出的一致，丢失了很多色彩，其实对我们日志的排查不是很友好。

我们知道，我们在使用命令行终端的时候也会带有这样的色彩。

对此就产生了好奇，Travis CI上的彩色日志是怎么能够做到和终端一模一样的呢？肯定不是通过对关键字词特征识别来做的。

进行了查询后，查到了一个关键词，它就是 **ANSI escape sequences**。

> ANSI转义序列是带内信令的标准，用于控制终端和终端仿真器上的光标位置，颜色和一些其他选项。 
>  --维基百科 

通俗地讲，就是那些在终端输出彩色的文字中包含了一些转义序列字符，只不过我们看不到，被终端进行了解析。然后终端将这些字符解析成了我们现在看到的形形色色多彩的日志（包括一些颜色、下划线、粗体等）。

例如，我们在终端进行`npm` 的安装，`git` 分支的切换，包括运行报错的时候都能看到。


![image-20211014184232041](https://s3.qiufeng.blue/nan/image-20211014184232041.png)


正是有了这些色彩，让我们的调试工作效率大大提高，一眼便能看到哪些命令出错了，以及如何解决的方案。

现在我们要做的就是**如何将这些色彩日志输出到浏览器端**。而进行这个步骤之前，我们得先知道，这些ANSI转义序列的形态是什么样子的？

根据wiki我们可以知道 ANSI 转义序列可以操作很多功能，例如光标位置、颜色、下划线和其他选项。下面我们就 **颜色部分** 来进行讲解。

## ANSI 转义序列

ANSI 转义序列 也是跟随着终端的发展而发展，颜色的规范也是随着设备的不同有所区别。例如在早期的设备只支持 3 / 4 Bit ，支持的颜色分别为 8 / 16 种。

ANSI 转义序列大多数以 ESC 和'['开头嵌入到文本中，终端会查找并解释为命令，而不是字符串。

ESC 的 ANSI 值为 27 ，8进制表示为 `\033` ，16进制表示为 `\u001B`。

### 3/4 bit

原始规格只有 8/16 种颜色。

比如`ESC[30;47m` 它是以 `ESC[` 开头  `m` 结束，中间为code码，以分号进行分割。

color 取值为30-37，background 取值为 40-47。例如 :

```bash
echo -e "\u001B[31m hello"
```

（如果想要清除颜色就需要使用 `ESC [39;49m`（某些终端不支持） 或者`ESC[0m`  ）

后来的终端增加了直接指定 90-97 和 100-107 的“明亮”颜色的能力。

效果如下：

<img src="https://s3.qiufeng.blue/nan/image-20210921174410142.png" alt="image-20210921174410142" style="zoom: 200%;" />

以下是其色彩对照表：
![image-20211014184200551](https://s3.qiufeng.blue/nan/image-20211014184200551.png)

### 8-bit

后来由于256色在显卡上很常见，因此添加了转义序列以从预定义的256种颜色中进行选择，也就是说在原来的书写方式上增加了新的一位来代表更多的颜色。

```bash
ESC[ 38;5;<n> m // 设置字体颜色
ESC[ 48;5;<n> m // 设置背景颜色
    0-7:  standard colors (as in ESC [ 30–37 m)
    8-15:  high intensity colors (as in ESC [ 90–97 m)
    16-231:  6 × 6 × 6 cube (216 colors): 16 + 36 × r + 6 × g + b (0 ≤ r, g, b ≤ 5)
   232-255:  grayscale from black to white in 24 steps
```

在支持更多色彩的终端中，例如:

```shell
echo -e "\u001B[38;5;11m hello"
```

代表输出黄色字体。

```bash
echo -e "\u001B[48;5;14;38;5;13m hello"
```
代表输出蓝色背景，粉红色字体。

<img src="https://s3.qiufeng.blue/nan/image-20210921174615899.png" alt="image-20210921174615899" style="zoom:150%;" />

以下是其色彩对照表：

![image-20210921172716951](https://s3.qiufeng.blue/nan/image-20210921172716951.png)

### 24-bit

再往后发展就是支持 24 位真彩的显卡，Xterm， KDE 的Konsole，以及所有基于 libvte 的终端（包括GNOME终端）支持24位前景和背景颜色设置。

```bash
ESC[ 38;2;<r>;<g>;<b>m // 前景色
ESC[ 48;2;<r>;<g>;<b>m // 背景色
```

例如：

```bash
echo -e "\u001B[38;2;100;228;75m hello"
```

输出绿色的字体代表 rgb(100,228,75)。

<img src="https://s3.qiufeng.blue/nan/image-20210921174726034.png" alt="image-20210921174726034" style="zoom:150%;" />

## 解析工具

我们知道了转义的规范后，那么我们需要将 ANSI 字符进行解析。

由于规范比较多，因此我们先调研一下在 js 中常用的色彩库，来进行一个小小的探索。

由于 3 / 4bit 的兼容性更好，大多数工具(如chalk)会采用这 8 / 16 色来做高亮，因此我们先实现一个 8 / 16 色的解析。

这里参考了 **ansiparse ** 这个解析库：

 核心思路为：

![image-20210921145604751](https://s3.qiufeng.blue/blog/image-20210921145604751.png)

<img src="https://s3.qiufeng.blue/nan/image-20210921184324429.png" alt="image-20210921184324429" style="zoom: 50%;" />

```javascript
const ansiparse = require('ansiparse')

const ansiStr = "\u001B[34mHello \u001B[39m World \u001B[31m! \u001B[39m"

const json = ansiparse(ansiStr)
console.log(json)

// json输出如下：
[
  { foreground: 'blue', text: 'Hello ' },
  { text: ' World ' },
  { foreground: 'red', text: '! ' }
]
```

然后我们可以写一个函数来遍历上面解析得到的 JSON数组，输出 HTML。

```js
function createHtml(ansiList, wrap = '') {
    let html = '';
    for (let i = 0; i < ansiList.length; i++) {
        const htmlFrame = ansiList[i];

        const {background = '', text, foreground = ''} = htmlFrame;
        if(background && foreground) {
            if(text.includes('\n')) {
                html += wrap;
                continue;
            }
            html += fontBgCode(text, foreground, background);
            continue;
        }
        if (background || foreground) {
            const color = background ? `bg-${background}` : foreground;
            let textColor = bgCode(text, color);

            textColor = textColor.replace(/\n/g, wrap);
            
            html += textColor;
            continue;
        }
        if (text.includes('\n')) {
            const textColor = text.replace(/\n/g, wrap);
            html += textColor;
            continue;
        }
        html += singleCode(text);
    }
    html += ''
    return html;
}

function fontBgCode(value, color, bgColor) {
    return `<span class="${color} bg-${bgColor}">${value}</span>`
}

function bgCode(value, color) {
    return `<span class="${color}">${value}</span>`
}

function singleCode(value) {
    return `<span>${value}</span>`
}

```

使用示例如下：

```javascript
const str = "\u001B[34mHello \u001B[39m World \u001B[31m! \u001B[39m";

console.log(createHtml(parseAnsi(str)));

// <span class="blue">Hello</span><span> World</span><span class="red">!</span>

```

## 部署实战

有了上面的部分我们就来用一个简单的demo实际演示一下部署日志吧！

```bash
// 项目目录结构
demo
 |- package.json
 |- index.html
 |- webpack.config.js
 |- /src
   |- index.js
index.js
build.sh
```

我们在 `index.js`  中启动一个 build 脚本，来模拟一下我们真实的部署场景。

```js
// index.js
const { spawn } = require('child_process');
const cmd = spawn('sh', ['build.sh']);

cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cmd.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```shell
// build.sh

cd demo

npx webpack
```

我们在终端尝试一下，控制台输入  `node index.js`

![image-20210921160948218](https://s3.qiufeng.blue/blog/image-20210921160948218.png)

发现在输出的日志中，并没有看到对应的色彩。

为什么从 child_process 为什么无法输出色彩，而我们如果在终端中直接打包项目却能够输出色彩呢？

### Why？

第一反应就是去查找根源，也就是使用频率最高的几个色彩输出的库。

>以简单的方式给控制台的输出标记颜色。

https://github.com/Marak/colors.js

https://github.com/chalk/chalk

在看了webpack-cli的源码后，查到它是用了colorette作为色彩输出库的。

那么我们就来查看一下colorette的源码一探究竟。

在入口文件的开头就看到一个变量**isColorSupported**来判断是否支持色彩输出。

https://github.com/jorgebucaran/colorette/blob/main/index.js#L17

```javascript
// colorette/index.js
import * as tty from "tty"

const env = process.env || {}
const argv = process.argv || []

const isDisabled = "NO_COLOR" in env || argv.includes("--no-color")

const isForced = "FORCE_COLOR" in env || argv.includes("--color")
const isWindows = process.platform === "win32"
const isCompatibleTerminal = tty && tty.isatty && tty.isatty(1) && env.TERM && env.TERM !== "dumb"
const isCI = "CI" in env && ("GITHUB_ACTIONS" in env || "GITLAB_CI" in env || "CIRCLECI" in env)

export const isColorSupported = !isDisabled && (isForced || isWindows || isCompatibleTerminal || isCI)
```

可以看到这种工具判断了很多条件，来对我们的输出流进行处理。

在以上条件成立下，才会输出 ANSI 日志。在不满足以上情况的条件下，就会切换输出更容易解析的方式。

> const isWindows = process.platform === "win32"
>
> 参考：https://stackoverflow.com/questions/8683895/how-do-i-determine-the-current-operating-system-with-node-js

>dumb: "哑终端" 
>
>**哑终端**指不能执行诸如“删行”、“清屏”或“控制光标位置”的一些特殊ANSI转义序列的计算机终端
>
>参考：https://zh.wikipedia.org/wiki/%E5%93%91%E7%BB%88%E7%AB%AF

也就是说我们的 `child_process` 的输出流关闭了终端模式(TTY)，上面的四种情况都不满足。所以我们得不到带有 ANSI 的色彩日志。

### How？

我们可以显示传入环境变量 `FORCE_COLOR=1` 或者命令带上参数 ` --color` 强制启动颜色来解决这个问题。

![image-20211014180103404](https://s3.qiufeng.blue/nan/image-20211014180103404.png)

这样我们就拿到了带有 ANSI 颜色信息的输出文本，最终解析得到 HTML。

```html
<div>asset <span class="green">main.js</span><span> 132 bytes </span><span class="yellow">[compared for emit]</span><span> </span><span class="green">[minimized]</span> (name: main)</div><div><span>./src/index.js</span><span> 289 bytes </span><span class="yellow">[built]</span><span> </span><span class="yellow">[code generated]</span></div><div></div><div><span class="yellow">WARNING</span><span> in </span>configuration</div><div>The <span class="red">'mode' option has not been set</span>, webpack will fallback to 'production' for this value.</div><div><span class="green">Set 'mode' option to 'development' or 'production'</span> to enable defaults for each environment.</div><div>You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/</div><div></div><div>webpack 5.53.0 compiled with <span class="yellow">1 warning</span> in 201 ms</div><div></div>
```

然后就可以在浏览器中展示我们彩色的输出日志了，与在终端里输出的一致。

![image-20211014175942686](https://s3.qiufeng.blue/nan/image-20211014175942686.png)

## 结语

这样我们就完成了从将终端的彩色日志搬到我们的浏览器。

##  参考

https://www.twilio.com/blog/guide-node-js-logging

https://github.com/jorgebucaran/colorette/blob/main/index.js#L17

https://en.wikipedia.org/wiki/ANSI_escape_code#Colors

https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences

https://stackoverflow.com/questions/15011478/ansi-questions-x1b25h-and-x1be

https://bluesock.org/~willg/dev/ansi.html

https://www.cnblogs.com/gamesky/archive/2012/07/28/2613264.html

https://github.com/mmalecki/ansiparse


