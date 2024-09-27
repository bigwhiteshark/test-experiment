<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
//import {logN, logB, logS} from './utils'
//import logger from './es/index.js'
import logger from 'easy-style-log'
import Log from './logger/index'

console.log(Log)

Log.log('数据','http://www.baidu.com/api', {name: '张三', age: 20})

//logB.primary('接口','http://www.baidu.com/api', 1, 2, 3);

 logger.bg("#000000").title('信息').log({name: '张三', age: 20})
logger.bg("#000000").title('信息').log({name: '张三', age: 20})
logger.bg('#00ff00').title('接口').log('http://www.baidu.com/api',{name: '张三', age: 20}) 

// console.log(logger)
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
