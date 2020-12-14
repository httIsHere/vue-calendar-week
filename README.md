<!--
 * @Author: httishere
 * @Date: 2020-11-16 14:27:34
 * @LastEditTime: 2020-12-14 14:32:41
 * @LastEditors: Please set LastEditors
 * @Description: README
 * @FilePath: /vue-calendar-week/README.md
-->

# vue-calendar-by-week

> 为用户提供周日历日程表设计，用户可通过自由拖动选区建立日程事件。


## 使用

```bash
npm install vue-calendar-by-week
// 或者
yarn add vue-calendar-by-week
```

```js
// vue项目入口文件main.js内
import CalendarByWeek from "vue-calendar-by-week";
Vue.use(CalendarByWeek);
```

```html
<!-- 需要引入日程表的地方 -->
<CalendarByWeek
  ref="myCalendar"
  :granularity="10"
  :start-time="8"
  :end-time="22"
  start-date="2020/11/23"
  :data="list"
  :readonly="false"
  @on-selected="onSelected"
  @on-contextmenu="onContextMenu"
/>
```

### Calendar props

|       属性       | 说明                                                                                        |     类型      |        默认值        |
| :--------------: | :------------------------------------------------------------------------------------------ | :-----------: | :------------------: |
|   granularity    | 单位时间间隔颗粒度，需要可平分 1 个小时，如：10，30，15 等                                  | Number/String |          30          |
|       data       | 显示的结构化数据，表示日程表记录，具体格式见后文                                            |     Array     |          []          |
|    start-date    | 必填，开始日期，本日程表目前以周为单位进行设计，展示该日期往后一周的日历                    |    String     |          -           |
|    unit-time     | 日程表单位时间，整数，以小时为单位                                                          | Number/String |          1           |
|    start-time    | 日程表单位开始时间，目前仅支持整点，24 小时制                                               | Number/String |          0           |
|     end-time     | 日程表单位结束时间，目前仅支持整点，24 小时制                                               | Number/String |          24          |
|     readonly     | 日程表表格操作状态，为 true 时仅作展示使用                                                  |    Boolean    |         true         |
|  disabled-time   | 设置不可选择的时间段，函数，参数为当前时间段，需要返回 Boolean 是否禁用该时间段，具体见后文 |   Function    | 小于当前时间均不可选 |
| need-bottom-time | 底部结束时间                                                                                |    Boolean    |        false         |
|    has-header    | 是否显示表格头部                                                                            |    Boolean    |         true         |
|    space-line    | 单元格间隙横线粗细X（表示Xpx solid #eeeeee）                                                                              |    Number     |    0     |

---

### Calendar events

|     事件名     | 说明                           | 返回值                                           |
| :------------: | :----------------------------- | :----------------------------------------------- |
|  on-selected   | 拖动选取时间段单元格完成时触发 | `object`，选中的资源对象，内容包括时间段和日期等 |
| on-contextmenu | 日程记录右击事件               | `row`，`record`，`event`                         |
|    on-error    | 日程表格错误反馈               | msg                                              |

---

### Calendar methods

|    事件名    | 说明         | 参数 |
| :----------: | :----------- | :--- |
| cancelSelect | 清除当前选择 | 无   |

---

### Calendar slot

|    名称     | 说明                         | 属性                                         |
| :---------: | :--------------------------- | :------------------------------------------- |
|    thead    | 日历表格头部内容             | `item`，对象格式，`{date:'日期',day:'周几'}` |
|    item     | 日程项，可自定义设置日程内容 | `item`，日程条目，具体见下文`data`           |
| contextMenu | 右键菜单                     |

如：

```html
<!-- item -->
<template slot="item" slot-scope="slotProps">
  <div class="slot-item">
    {{slotProps.item.time}}<br />{{slotProps.item.content}}
  </div>
</template>
```

#### data

> 结构化记录描述数据对象，是 data 内的一项

|    属性    | 说明                  |  类型  | 默认值 |
| :--------: | :-------------------- | :----: | :----: |
|     id     | 日程记录主键          | String |   -    |
|    date    | 日程日期，YY/MM/DD    | String |   -    |
| start_time | 日程开始时间点，hh:mm | String |   -    |
|  end_time  | 日程结束时间点，hh:mm | String |   -    |
|  content   | 日程内容              | String |   -    |

---

#### disabled-time

> 设置不可选择的时间段，参数为当前时间段`time`，需要返回 Boolean 是否禁用该时间段，`time`（YYYY/MM/DD HH:mm:ss）表示当前时间颗粒的开始时间。

如：

```js
<template>
    <CalendarByWeek disabled-time="disabledTime" />
</template>
<script>
export default {
    data() {
        return {
            disabledTime: function(time) {
                let currentTime = new Date().getTime();
                let start_time = new Date(time).getTime();
                return currentTime < start_time;
            }
        }
    }
}
</script>

```

### 设计

提供一个整体表格的二维数组，根据 granularity 和 unit-time。

日程记录 record，关于渲染的内容：

```js
{
  "id": "",
  "start_time": "",
  "end_time": "",
  "content": ""
}
```
