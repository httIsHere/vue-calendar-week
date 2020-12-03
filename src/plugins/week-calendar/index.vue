<!--
 * @Author: httishere
 * @Date: 2020-11-16 15:46:08
 * @LastEditTime: 2020-12-03 15:59:29
 * @LastEditors: Please set LastEditors
 * @Description: a week calendar ui
 * @FilePath: /vue-calendar-week/src/plugins/calendar/Index.Vue
-->
<template>
  <div class="component-box component-calendar" onselectstart="return false">
    <table class="calendar-table" cellspacing="0" cellpadding="0">
      <tr class="calendar-table__tr calendar-table__th" v-if="hasHeader">
        <td
          class="calendar-table__td calendar-table__th-d calendar-table__td-null"
        ></td>
        <td
          class="calendar-table__td calendar-table__th-d"
          v-for="item in columns"
          :key="item.week"
        >
          <slot name="thead" :item="item">
            {{ week_day[item.day] }}<br />{{ item.date }}
          </slot>
        </td>
      </tr>
      <tr class="calendar-table__tr" v-for="(item, r) in rows" :key="r">
        <template v-if="r % unitNum === 0">
          <td
            class="calendar-table__td calendar-table__td-span"
            :rowspan="unitNum"
          >
            <span class="time">{{ rows[r] }}</span>
            <span
              class="time time-bottom"
              v-if="needBottomTime && r === rows.length - unitNum"
              >{{ endTime | formatHourWithInt }}</span
            >
          </td>
        </template>
        <!-- main -->
        <td
          :class="[
            'calendar-table__td',
            r % unitNum === 0 ? 'calendar-table__td-top' : '',
            r === rows.length - 1 ? 'calendar-table__td-bottom' : '',
            data_list && data_list[index][r] && data_list[index][r].is_passed
              ? 'disabled'
              : '',
            data_list &&
            data_list[index][r] &&
            data_list[index][r].has_record &&
            data_list[index][r].start_row === r
              ? `calendar-table__td-record calendar-table__td-record-${data_list[index][r].over_rows}`
              : '',
            is_rowspan &&
            select_cells.col === index &&
            select_cells.start_row < r &&
            select_cells.start_row + select_cells.over_rows >= r
              ? 'disNone'
              : data_list &&
                data_list[index][r] &&
                data_list[index][r].has_record &&
                data_list[index][r].start_row !== r
              ? 'disNone'
              : '',
            select_cells.col === index &&
            (select_cells.over_rows >= 0
              ? select_cells.start_row <= r &&
                select_cells.start_row + select_cells.over_rows >= r
              : select_cells.start_row >= r &&
                select_cells.start_row + select_cells.over_rows <= r)
              ? 'selected-cell-span'
              : '',
          ]"
          :rowspan="
            is_rowspan &&
            select_cells.col === index &&
            select_cells.start_row === r
              ? select_cells.over_rows + 1
              : data_list &&
                data_list[index][r] &&
                data_list[index][r].has_record &&
                data_list[index][r].start_row === r
              ? data_list[index][r].over_rows
              : false
          "
          v-for="(item, index) in columns"
          :key="index"
          @mousedown="onTableMouseDown($event, r, index)"
          @mouseover="onTableMouseOver($event, r, index)"
          @mouseup="onTableMouseUp($event, r, index)"
          @contextmenu.prevent="onContextMenu($event, r, index)"
        >
          <div
            class="item-default"
            v-if="select_cells.col === index && select_cells.start_row === r"
          >
            <!-- Selected time period -->
            {{ select_period }}
          </div>
          <!-- Schedule main content -->
          <template
            v-if="
              data_list &&
              data_list[index][r] &&
              data_list[index][r].has_record &&
              data_list[index][r].start_row === r
            "
          >
            <calendar-slot :item="data_list[index][r]">
              {{ data_list[index][r].time }}<br />{{
                data_list[index][r].content
              }}
            </calendar-slot>
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import util from "../../util";
import CalendarSlot from "./slot";
export default {
  name: "CalendarByWeek",
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
      validator: function (value) {
        return value % 1 === 0;
      },
    }, // 日程表行开始时间
    endTime: {
      type: [String, Number],
      default: 24,
      validator: function (value) {
        return value % 1 === 0;
      },
    }, // 日程表行结束时间
    unitTime: {
      type: [String, Number],
      default: 1,
    }, // 单位时间
    data: {
      type: Array,
      default: [],
    }, // 日程表
    readonly: {
      type: Boolean,
      default: false,
    }, // 日程表操作状态
    disabledTime: {
      type: Function,
      default: function (time) {
        // * Whether the current time period is disabled
        let currentTime = new Date().getTime();
        let start_time = new Date(time).getTime();
        return currentTime >= start_time;
      },
    },
    needBottomTime: {
      type: Boolean,
      default: false,
    }, // 是否需要底部结束时间
    toastMessage: {
      type: Object,
      default() {
        return {
          disabledTime: "该时间段不可安排日程",
          timeConflict: "存在时间冲突，请重新安排",
        };
      },
    },
    hasHeader: {
      type: Boolean,
      default: true,
    },
  },
  components: { CalendarSlot },
  provide() {
    return {
      calendarRoot: this,
    };
  },
  data() {
    return {
      is_mousedown: false,
      is_mouseup: false,
      select_cells: { col: -1, start_row: -1, over_rows: 0, end_row: -1 },
      is_rowspan: false,
      data_list: null,
      week_day: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      click_start: null,
      click_end: null,
    };
  },
  filters: {
    formatHourWithInt: function (hour) {
      return hour >= 10 ? `${hour}:00` : `0${hour}:00`;
    },
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
      try {
        if ((_end - _start) % this.unitTime !== 0) {
          throw "Bad 'unit time";
        } else {
          let row_num = ((_end - _start) / this.unitTime) * this.unitNum;
          let arr = new Array(row_num);
          for (let i = 0; i < (_end - _start) / this.unitTime; i++) {
            let start_hour = i * parseInt(this.unitTime) + _start;
            arr[i * this.unitNum] = `${util.formatHourWithInt(start_hour)}`;
          }
          return arr;
        }
      } catch (e) {
        console.error(e);
      }
    },
    // ^ Selected time period
    select_period: function () {
      let { start_row, over_rows } = this.select_cells;
      if (start_row < 0) return "";
      let _start = parseInt(this.startTime);
      let start_hour = _start + Math.floor(start_row / this.unitNum);
      let start_time =
        start_hour * 60 + (start_row % this.unitNum) * this.granularity;
      let end_time = start_time + (over_rows + 1) * this.granularity;
      return `${util.formatTimeWithMinutes(
        start_time
      )}-${util.formatTimeWithMinutes(end_time)}`;
    },
  },
  mounted() {
    this.initTableArray();
    this.initRecordList(this.data);
  },
  methods: {
    // TODO: Reset current selection
    resetSelection() {
      this.select_cells = { col: -1, start_row: -1, over_rows: 0, end_row: -1 };
      this.is_mousedown = false;
    },
    onTableMouseDown(e, row, col) {
      if (this.readonly) return;
      // TODO: Whether there is a schedule
      if (
        this.data_list[col][row] &&
        (this.data_list[col][row].has_record ||
          this.data_list[col][row].is_passed)
      ) {
        return this.$emit("on-error", this.toastMessage.disabledTime);
      }
      // TODO: Is it currently selected
      if (
        col === this.select_cells.col &&
        row >= this.select_cells.start_row &&
        row <= this.select_cells.end_row
      )
        return;
      if (e.button !== 0) return;
      this.is_rowspan = false;
      if (this.is_mousedown) {
        // cancel selected
      } else {
        this.click_start = new Date().getTime();
        this.is_mousedown = true;
        this.select_cells = {
          col,
          start_row: row,
          over_rows: 0,
        };
      }
    },
    onTableMouseOver(e, row, col) {
      if (!this.is_mousedown) return;
      if (this.data_list[col][row] && this.data_list[col][row].has_record) {
        this.$emit("on-error", this.toastMessage.timeConflict);
        return this.resetSelection();
      } else if (
        this.data_list[col][row] &&
        this.data_list[col][row].is_passed
      ) {
        this.$emit("on-error", this.toastMessage.disabledTime);
        return this.resetSelection();
      }
      if (this.is_mousedown && this.select_cells.col === col) {
        // if (this.select_cells.start_row <= row) {
        let over_rows = row - this.select_cells.start_row;
        this.select_cells.over_rows = over_rows;
        // }
      }
    },
    onTableMouseUp(e, row, col) {
      if (this.is_mousedown) {
        let over_rows = row - this.select_cells.start_row;
        console.log(this.select_cells);
        // & Click a grid to select a time unit by default
        if (over_rows === 0) {
          this.click_end = new Date().getTime();
          if (this.click_end - this.click_start > 300) return;
          let start_row = Math.floor(row / this.unitNum) * this.unitNum;
          over_rows = this.unitNum - 1;
          this.select_cells.start_row = start_row;
        }
        // & Select up
        if (over_rows < 0) {
          this.select_cells.start_row = row;
          over_rows = -over_rows;
        }
        // ^ Determine whether there is a schedule in this range
        let flag = false, start_row = this.select_cells.start_row;
        for (let i = start_row; i <= start_row + over_rows; i++) {
          if (this.data_list[col][i] && this.data_list[col][i].has_record) {
            flag = true;
            this.$emit("on-error", this.toastMessage.timeConflict);
            this.resetSelection();
            break;
          } else if (
            this.data_list[col][i] &&
            this.data_list[col][i].is_passed
          ) {
            flag = true;
            this.$emit("on-error", this.toastMessage.disabledTime);
            this.resetSelection();
            break;
          }
        }
        if (flag) return;
        this.select_cells.end_row = this.select_cells.start_row + over_rows;
        this.select_cells.over_rows = over_rows;
        this.is_mousedown = false;
        // ! Merges cells
        this.is_rowspan = true;
        this.onSelected();
      }
    },
    // Right-click the cell
    onContextMenu(e, row, col) {
      // ^ Determine whether there is a schedule in the current cell
      if (this.data_list[col][row] && this.data_list[col][row].has_record) {
        this.$emit("on-contextmenu", row, this.data_list[col][row], e);
      }
    },
    // ^ Initialize the record list
    initTableArray() {
      const _this = this;
      let data_list = new Array();
      for (let i in _this.columns) {
        data_list[i] = new Array();
        for (let j = 0; j < _this.rows.length; j++) {
          // * Whether the current time period is disabled
          let _date = _this.columns[i].date;
          let _start = util.formatTimeWithMinutes(
            parseInt(_this.startTime) * 60 + j * _this.granularity
          );
          let is_passed = _this.disabledTime(`${_date} ${_start}`);
          data_list[i][j] = {
            is_passed,
          };
        }
      }
      _this.data_list = data_list;
    },
    initRecordList(list) {
      const _this = this;
      _this.cancelSelect();
      let _arr = [];
      this.initTableArray();
      let data_list = JSON.parse(JSON.stringify(_this.data_list));
      if (list) {
        list.forEach((item) => {
          let date = item.date.replace(new RegExp("-", "gm"), "/");
          let date_col = _this.columns.findIndex(
            (col) => new Date(col.date).getTime() === new Date(date).getTime()
          );
          if (date_col < 0) return;
          let start_time =
            parseInt(item.start_time.split(":")[0]) * 60 +
            parseInt(item.start_time.split(":")[1]);
          let end_time =
            parseInt(item.end_time.split(":")[0]) * 60 +
            parseInt(item.end_time.split(":")[1]);
          let start_row =
            (start_time - parseInt(_this.startTime) * 60) / _this.granularity;
          let over_rows = (end_time - start_time) / _this.granularity;
          let record_item = {
            has_record: true,
            is_before_created: true, // The generated schedule record, not added this time
            date_col,
            start_row,
            over_rows,
            content: item.content,
            time: `${item.start_time}-${item.end_time}`,
          };
          _arr.push(record_item);
          data_list[date_col][start_row] = Object.assign(
            data_list[date_col][start_row],
            record_item,
            item
          );
          for (let j = start_row + 1; j < start_row + over_rows; j++) {
            data_list[date_col][j].has_record = true;
          }
        });
      }
      _this.data_list = data_list;
    },
    // * Clear the current options and expose outward
    cancelSelect() {
      this.resetSelection();
    },
    onSelected() {
      if (this.readonly) return;
      let d = this.columns[this.select_cells.col].date;
      let s = this.select_period.split("-")[0];
      let e = this.select_period.split("-")[1];
      this.$emit("on-selected", {
        date: d,
        start_time: s,
        end_time: e,
      });
    },
  },
  watch: {
    data: {
      handler: function (newValue, oldValue) {
        // & Processing schedule records
        this.initRecordList(newValue);
      },
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
td {
  width: 100px;
  height: 20px;
  text-align: center;
  cursor: pointer;
  line-height: 1;
  // overflow: hidden;
}
.disNone {
  display: none;
}
.calendar-table {
  // border: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  &__tr {
  }
  &__th-d {
    border-top: 1px solid #eeeeee;
    height: 50px;
    background: rgba(102, 153, 204, 0.8);
    color: #ffffff;
  }
  &__td {
    border-left: 1px solid #eeeeee;
    font-size: 12px;
    &.disabled {
      background: #fafafa;
    }
    &-top {
      border-top: 1px solid #eeeeee;
    }
    &-bottom {
      border-bottom: 1px solid #eeeeee;
    }
    &-span {
      border-top: none;
      border-left: none;
      vertical-align: top;
      position: relative;
      .time {
        display: block;
        margin-top: -8px;
        &-bottom {
          position: absolute;
          bottom: -8px;
          width: 100%;
          text-align: center;
        }
      }
    }
    &-null {
      border-left: none;
      border-top: none;
      background: unset;
    }
    &.selected-cell-span {
      background: rgba(153, 204, 255, 0.3);
      padding-top: 5px;
      box-sizing: border-box;
    }
    &-record {
      background: rgba(153, 204, 255, 0.1);
    }
  }
  .slot-item {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 5px;
  }
  .item-default {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    // padding: 10px 5px;
  }
}
</style>