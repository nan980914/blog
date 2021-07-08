# Vue3.0 script-setup最新定稿及改动(2021.07)

## 从`setup` -> `script setup`

在vue3中的composition API里，有一个全新的`setup`函数。在创建组件之前被执行，可以替代vue2.x中的beforeCreate和created。具体相关知识点可参考：[Setup](!https://vue3js.cn/docs/zh/guide/composition-api-setup.html)。

在`setup`中定义的数据和函数等，需要return出来才能在模板里使用。

而script-setup是vue3新的语法糖，直接在script标签上添加`setup`属性，就可以直接在模板中使用数据，不需要再return出来。

而组件的挂载也不需要引入进来后再放到components选项中注册即可使用。

```javascript
<script lang="ts" setup>
  import HelloWorld from "@/components/HelloWorld.vue";
</script>
```

## `<script setup>`最终定稿及一些改动

尤大在6月底更新`<script setup>`的最新状态。

" 在数月的测试和修改之后，`<script setup>`定稿。目前已经实施了以下更改，并将在3.1.3体现。 

我们计划在接下来的几天内合并此RFC，最后在3.2中将把`<Script Setup>`脱离实验状态。“

以下就是此次的一些改动。

### 废除`useContext` 变为 `useSlots ` + `useAttrs`

`useContext`这个API被新的 `useSlots `和`useAttrs`所取代。在使用`<script setup>`的时候，"context"的概念不是特别清晰。

暴露出使用`slots`和`attr`的专用方法更加清晰易懂。这两种方法是运行时方法，也可以在任何Composition API函数内使用。

之前我们可以从`useContext`这个API中获取到一些上下文信息，比如expose、attrs和slots等。在`useContext`被废弃后，将用新增的`defineExpose`，`useSlots`，`useAttrs `来替代。

```javascript
<script lang="ts" setup>
  import { useSlots, useAttrs } from 'vue'

  const slots = useSlots()
  const attrs = useAttrs()
</script>
```

### 新增`defineExpose`

在`<script setup>`模式下，因为函数里所有数据都会默认帮我们return出来给模板使用，不会暴露到组件外。所有在通过模板refs访问子组件时，父组件无法获取到子组件里的数据。想要使用的数据需要在子组件里显示暴露出来，才能在父组件里拿到。

之前是从`useContext`导出`expose`函数来完成这个操作，这次`useContext`被废除后，新增了一个`defineExpose`来替代。

```javascript
<script lang="ts" setup>
	import { defineExpose } from "vue";

  const childmsg = ref<String>("child msg!")
  const open = () => {console.log('open')}
  const close = () => {console.log('close')}
  
  // 明确组件暴露出去的公共接口
  defineExpose({
    childmsg,
    open,
    close
  })
</script>
```

### `defineEmit` 改名为 `defineEmits`

`defineEmit`改名为`defineEmits`，这将与对应的option名称`emits`保持对齐。

其用法和之前相比没有改变。

```javascript
<script lang="ts" setup>
  const emit = defineEmits(['change'])
  const clickEvent = () => {
    emit('change','change params')
  }
</script>
```

### 移除 `<template>` 上的`inherit-attrs`属性

如果需要添加一些额外的option，可以使用一个简单`<script>`块。

```javascript
<script lang="ts">
  export default {
    name: 'HelloWorld',
    inheritAttrs: false,
    customOptions: {}
  }
</script>
<script lang="ts" setup>
  ...
</script>
```

### 新增`withDefaults`

在之前用TS的类型注解对defineProps里的pros进行类型约束时无法指定默认值，所以这次新增了`withDefaults`来实现这一功能。

```javascript
<script lang="ts" setup>
  interface Props {
    msg?: string
    age?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    msg: 'hello',
    age: 18
  })
</script>
```

### 顶级的await使用

可以在`<script setup>`中使用顶级await。生成的setup函数将成为async setup。

```javascript
<script lang="ts" setup>
   const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```



## 参考资料

[vuejs/rfcs-`<script setup>`](!https://github.com/vuejs/rfcs/pull/227)

[vuejs/rfcs/active-rfcs/0040-script-setup.md](!https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md)

