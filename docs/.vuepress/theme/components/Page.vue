<template>
  <main class="page">
    <slot name="top" />

    <div :class="{ 'theme-default-content': true, lock: isLock }">
      <Content />
    </div>
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'


export default {
  data () {
    return {
      lock: false,
      code: ''
    }
  },
  async mounted () {
    
  },
  computed: {
    isLock () {
      return this.lock ? Math.random() > 0.01 : false
      /* return false */
    }
  },
  components: { PageEdit, PageNav },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

.content-lock
  display none
  text-align center
  padding 2rem
  font-size 1em

  p
    line-height 1.2em

  span
    color #3eaf7c
    font-weight 600
    cursor pointer

.theme-default-content.lock
  .content__default
    > :nth-last-child(3)
      opacity .5

    > :nth-last-child(2)
      opacity .2

    > :nth-last-child(-n+1)
      display none

  .content-lock
    display block

.theme-default-content:not(.custom) div.content__default
  margin-top 0
</style>
