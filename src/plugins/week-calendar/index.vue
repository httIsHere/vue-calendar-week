<!--
 * @Author: httishere
 * @Date: 2020-11-16 15:46:08
 * @LastEditTime: 2020-11-18 11:58:00
 * @LastEditors: Please set LastEditors
 * @Description: a week calendar ui
 * @FilePath: /vue-calendar-week/src/plugins/calendar/Index.Vue
-->
<template>
  <div class="component-box component-calendar" onselectstart="return false">
    <table class="calendar-table" cellspacing="0" cellpadding="0">
      <tr class="calendar-table__tr calendar-table__th">
        <td
          class="calendar-table__td calendar-table__th-d calendar-table__td-null"
        >
          /
        </td>
        <td
          class="calendar-table__td calendar-table__th-d"
          v-for="item in columns"
          :key="item"
        >
          {{ item }}
        </td>
      </tr>
      <tr class="calendar-table__tr" v-for="r of rows.length" :key="r">
        <template v-if="(r - 1) % unitNum === 0">
          <td
            class="calendar-table__td calendar-table__td-span"
            :rowspan="unitNum"
            v-html="
              `${rows[r - 1].split('-')[0]}<br> - <br>${
                rows[r - 1].split('-')[1]
              }`
            "
          ></td>
        </template>
        <!-- main -->
        <td
          :class="[
            'calendar-table__td',
            (r - 1) % unitNum === 0 ? 'calendar-table__td-top' : '',
            is_rowspan &&
            select_cells.col === index &&
            select_cells.start_row < r &&
            select_cells.start_row + select_cells.over_rows >= r
              ? 'disNone'
              : '',
            select_cells.col === index &&
            select_cells.start_row <= r &&
            select_cells.start_row + select_cells.over_rows >= r
              ? 'selected-cell-span'
              : '',
          ]"
          :rowspan="
            is_rowspan &&
            select_cells.col === index &&
            select_cells.start_row === r
              ? select_cells.over_rows + 1
              : false
          "
          v-for="(item, index) in columns"
          :key="index"
          @mousedown="onTableMouseDown($event, r, index)"
          @mouseover="onTableMouseOver($event, r, index)"
          @mouseup="onTableMouseUp($event, r, index)"
          @contextmenu.prevent="onContextMenu($event, r, index)"
        >
          <template
            v-if="
              select_cells.col === index &&
              select_cells.start_row === r
            "
            >
            <!-- Selected time period -->
            {{select_period}}
            </template>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import util from "../../util";
export default {
  props: {
    granularity: {
      type: [String, Number],
      default: 30,
    }, // 日程表时间颗粒度
    startDate: {
      type: String,
      required: true,
    }, // 日程表开始日期
    startTime: {
      type: [String, Number],
      default: 0,
    }, // 日程表行开始时间
    endTime: {
      type: [String, Number],
      default: 24,
    }, // 日程表行结束时间
    unitTime: {
      type: [String, Number],
      default: 1,
    }, // 单位时间
    data: {
        type: Array,
        default: []
    }, // 日程表
  },
  data() {
    return {
      is_mousedown: false,
      is_mouseup: false,
      select_cells: { col: -1, start_row: -1, over_rows: 0, end_row: -1 },
      is_rowspan: false,
    };
  },
  computed: {
    // ^ Description of table columns
    columns: function () {
      let arr = util.getDatesArray(this.startDate, 7);
      return arr;
    },
    // ^ Unit particle number
    unitNum: function () {
      try {
        if (60 % this.granularity !== 0) {
          throw "Bad 'granularuty', check whether the parameters 'granularity' meet the parameter requirements.";
        }
        return Math.floor((60 * this.unitTime) / this.granularity);
      } catch (e) {
        console.error(e);
      }
    },
    rows: function () {
      let _start = parseInt(this.startTime);
      let _end = parseInt(this.endTime);
      let row_num = ((_end - _start) / this.unitTime) * this.unitNum;
      let arr = new Array(row_num);
      for (let i = 0; i < (_end - _start) / this.unitTime; i++) {
          let start_hour = i * parseInt(this.unitTime) + _start;
        arr[i * this.unitNum] = `${util.formatHourWithInt(start_hour)}-${util.formatHourWithInt(
          parseInt(start_hour) + parseInt(this.unitTime)
        )}`;
      }
      return arr;
    },
    // ^ Selected time period
    select_period: function () {
        let { start_row, over_rows } = this.select_cells;
        let _start = parseInt(this.startTime);
        let start_hour = _start + Math.floor((start_row - 1) / this.unitNum);
        let start_time = start_hour * 60 + (start_row - 1) % this.unitNum * this.granularity;
        let end_time = start_time + (over_rows + 1) * this.granularity;
        return `${util.formatTimeWithMinutes(start_time)}-${util.formatTimeWithMinutes(end_time)}`;
    }
  },

  methods: {
    onTableMouseDown(e, row, col) {
      if(e.button !== 0) return;
      this.is_rowspan = false;
      if (this.is_mousedown) {
        // cancel selected
      } else {
        this.is_mousedown = true;
        this.select_cells = {
          col,
          start_row: row,
          over_rows: 0,
        };
      }
    },
    onTableMouseOver(e, row, col) {
      if (
        this.is_mousedown &&
        this.select_cells.col === col &&
        this.select_cells.start_row <= row
      ) {
        let over_rows = row - this.select_cells.start_row;
        this.select_cells.over_rows = over_rows;
      }
    },
    onTableMouseUp(e, row, col) {
      if (this.is_mousedown) {
        let over_rows = row - this.select_cells.start_row;
        this.select_cells.end_row = row;
        this.select_cells.over_rows = over_rows;
        this.is_mousedown = false;
        // ! Merges cells
        this.is_rowspan = true;
        this.$emit("on-selected");
      }
    },
    // Right-click the cell
    onContextMenu() {
        // ^ Determine whether there is a schedule in the current cell
    }
  },
};
</script>
<style lang="less" scoped>
td {
  width: 100px;
  height: 20px;
  text-align: center;
  cursor: pointer;
}
.disNone {
  display: none;
}
.calendar-table {
  border: 1px solid #eeeeee;
  &__tr {
  }
  &__td {
    border-left: 1px solid #eeeeee;
    &-top {
      border-top: 1px solid #eeeeee;
    }
    &-span {
      border-top: 1px solid #eeeeee;
      border-left: none;
    }
    &-null {
      border-left: none;
    }
    &.selected-cell-span {
      background: lightblue;
    }
  }
}
</style>