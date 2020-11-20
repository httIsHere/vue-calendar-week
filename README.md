<!--
 * @Author: httishere
 * @Date: 2020-11-16 14:27:34
 * @LastEditTime: 2020-11-20 16:22:23
 * @LastEditors: Please set LastEditors
 * @Description: README
 * @FilePath: /vue-calendar-week/README.md
-->
# vue-calendar-week

> A Vue.js Component

为用户提供周日历日程表设计，用户可通过自由拖动选区建立日程事件。

### Calendar props

|    属性     | 说明                                                       |     类型      | 默认值 |
| :---------: | :--------------------------------------------------------- | :-----------: | :----: |
| granularity | 单位时间间隔颗粒度，需要可平分 1 个小时，如：10，30，15 等 | Number/String |   30   |
|    data     | 显示的结构化数据，表示日程表记录，具体格式见后文           |     Array     |   []   |
| start-date  | 必填，开始日期，本日程表目前以周为单位进行设计             |    String     |   -    |
|  unit-time  | 日程表单位时间，整数，以小时为单位                         | Number/String |   1    |
| start-time  | 日程表单位开始时间，目前仅支持整点，24 小时制              | Number/String |   0    |
|  end-time   | 日程表单位结束时间，目前仅支持整点，24 小时制              | Number/String |   24   |

---

### Calendar events

|   事件名    | 说明                           | 返回值                                           |
| :---------: | :----------------------------- | :----------------------------------------------- |
| on-selected | 拖动选取时间段单元格完成时触发 | `object`，选中的资源对象，内容包括时间段和日期等 |

---

### Calendar slot

|    名称     | 说明                         |
| :---------: | :--------------------------- |
|    item     | 日程项，可自定义设置日程内容 |
| contextMenu | 右键菜单                     |

#### data

> 结构化记录描述数据对象，是 data 内的一项

|    属性    | 说明                  |  类型  | 默认值 |
| :--------: | :-------------------- | :----: | :----: |
|     id     | 日程记录主键          | String |   -    |
|    date    | 日程日期，YY/MM/DD    | String |   -    |
| start_time | 日程开始时间点，hh:mm | String |   -    |
|  end_time  | 日程结束时间点，hh:mm | String |   -    |
|  content   | 日程内容              | String |   -    |


### 设计

提供一个整体表格的二维数组，根据granularity和unit-time。


日程记录record，关于渲染的内容：

```json
{
    id: '', 
    start_time: '', 
    end_time: '', 
    content: ''
}
```