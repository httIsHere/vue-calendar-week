<!--
 * @Author: your name
 * @Date: 2020-11-16 15:34:48
 * @LastEditTime: 2020-12-02 11:36:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-calendar-week/src/App.vue
-->
<template>
  <div id="app">
    <div class="container">
      <calendar
        ref="myCalendar"
        :granularity="10"
        :start-time="8"
        :end-time="22"
        start-date="2020/11/30"
        :data="list"
        :readonly="false"
        @on-selected="onSelected"
        @on-contextmenu="onContextMenu"
      >
      <!-- <template slot="thead"  slot-scope="slotProps">
        <div class="slot-thead">{{slotProps.item}}</div>
      </template> -->
        <template slot-scope="slotProps" >
          <div class="slot-item">{{slotProps.item}}</div>
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
          date: '2020-12-03',
          start_time: '08:50',
          end_time: '10:50',
          content: '000'
        }
      ],
    };
  },
  mounted() {
    const _this = this;
    // setTimeout(() => {
    //   _this.list.push(
    //     {
    //       id: 0,
    //       date: "2020/11/29",
    //       start_time: "10:20",
    //       end_time: "11:10",
    //       content: "上课呢",
    //     });
    // }, 2000)
  },
  methods: {
    onSelected(data) {
      console.log(data);
      // alert('success');
    },
    onContextMenu(row, data, event) {
      console.log(row, data, event);
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
.slot-thead {
  height: 50px;
  line-height: 50px;
}
</style>
