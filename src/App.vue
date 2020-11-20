<!--
 * @Author: your name
 * @Date: 2020-11-16 15:34:48
 * @LastEditTime: 2020-11-20 16:36:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-calendar-week/src/App.vue
-->
<template>
  <div id="app">
    <div class="container">
      <calendar
        :unit-time="1"
        :granularity="10"
        :start-time="8"
        :end-time="22"
        start-date="2020/11/16"
        :data="list"
        @on-selected="onSelected"
      >
        <template slot="item" slot-scope="slotProps" >
          <div class="slot-item">{{slotProps.item.time}}<br>{{slotProps.item.content}}</div>
        </template>
      </calendar>
    </div>
  </div>
</template>

<script>
import Calendar from "./plugins/week-calendar/index";
export default {
  name: "app",
  components: { Calendar },
  data() {
    return {
      list: [
        {
          id: 0,
          date: "2020/11/19",
          start_time: "10:20",
          end_time: "11:10",
          content: "上课呢",
        },
        {
          id: 1,
          date: "2020/11/17",
          start_time: "10:50",
          end_time: "11:30",
          content: "上课呢",
        },
        {
          id: 2,
          date: "2020/11/22",
          start_time: "14:30",
          end_time: "15:50",
          content: "上课呢",
        },
      ],
    };
  },
  methods: {
    onSelected() {
      // alert('success');
    },
  },
};
</script>

<style>
body {
  -moz-user-select: none;
}
.container {
  width: 800px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
