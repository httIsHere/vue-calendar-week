/*
 * @Author: httishere
 * @Date: 2020-11-17 16:50:48
 * @LastEditTime: 2020-11-24 09:56:25
 * @LastEditors: Please set LastEditors
 * @Description: 工具方法
 * @FilePath: /vue-calendar-week/src/util.js
 */

// ^ Get time period date array(bad English)
const getDatesArray = (startDate, days = 0) => {
    if(!startDate) return null;
    startDate = startDate.replace(new RegExp("-", "gm"), "/");
    if(!days) return [startDate];
    let arr = new Array(days);
    let _start = new Date(startDate);
    for(let i = 0; i < days; i++) {
        let cur = _start.getTime() + 24 * 60 * 60 * 1000 * i;
        let _day = new Date(cur).getDay();
        cur = formatDateOnlyDate(cur);
        arr[i] = {date: cur, day: _day};
    }
    return arr;
}

// ^ Format date
const formatDateOnlyDate = date => {
    // Whether the parameter is a date object
    date = date instanceof Date ? date : new Date(date);
    let fullYear = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${fullYear}/${month}/${day}`;
}

// ^ Format the time point according to an integer
const formatHourWithInt = hour => {
    return hour >= 10 ? `${hour}:00` : `0${hour}:00`;
}
// ^ Format the time point according to minutes
const formatTimeWithMinutes = minutes => {
    let _hour = Math.floor(minutes / 60);
    let _minutes = Math.floor(minutes % 60);
    _hour = _hour >= 10 ? _hour : `0${_hour}`;
    _minutes = _minutes >= 10 ? _minutes : `0${_minutes}`;
    return `${_hour}:${_minutes}`;
}

export default {
    getDatesArray,
    formatDateOnlyDate,
    formatHourWithInt,
    formatTimeWithMinutes
}