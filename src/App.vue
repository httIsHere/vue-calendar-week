<template>
  <div id="app">
    <div class="container">
      <calendar
        :unit-time="1"
        :granularity="10"
        :start-time="8"
        :end-time="22"
        start-date="2020/11/16"
        @on-selected="onSelected"
      />
    </div>
  </div>
</template>

<script>
import Calendar from "./plugins/week-calendar/index";
export default {
  name: "app",
  components: { Calendar },
  data() {
    return {};
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
