/*
 * @Author: your name
 * @Date: 2020-11-16 15:56:34
 * @LastEditTime: 2020-11-16 16:06:25
 * @LastEditors: Please set LastEditors
 * @Description: 组件暴露
 * @FilePath: /vue-calendar-week/src/plugins/index.js
 */

import Calendar from './week-calendar/index.vue';

const components = { // use 'install' function to install components
    install(Vue) {
        Vue.component('WeekCalendar', Calendar);
    }
}

if(typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(components);
}

export default components;