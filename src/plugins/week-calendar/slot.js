/*
 * @Author: your name
 * @Date: 2020-12-01 10:49:23
 * @LastEditTime: 2020-12-01 11:08:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-calendar-week/src/plugins/week-calendar/slot.js
 */
export default {
    name: 'CalendarSlot',
    functional: true,
    inject: ['calendarRoot'],
    props: {
        item: Object,
    },
    render: (h, ctx) => {
        return h('div',{
            class: 'slot-item'
        }, ctx.injections.calendarRoot.$scopedSlots['default']({
            item: ctx.props.item
        }));
    }
};