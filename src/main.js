/*
 * @Author: your name
 * @Date: 2020-11-16 15:34:48
 * @LastEditTime: 2020-11-23 10:43:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-calendar-week/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import "vue2-toast/lib/toast.css";
import Toast from "vue2-toast";


Vue.use(Toast, {
  type: "center",
  duration: 2000,
  wordWrap: true,
});

new Vue({
  el: '#app',
  render: h => h(App)
})
