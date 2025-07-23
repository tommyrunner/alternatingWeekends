/**
 * 大小周休息日助手 - 弹窗逻辑
 * @fileoverview Chrome插件弹窗页面的主要逻辑，用于显示大小周休息日安排
 * @author Tommy Runner
 * @version 1.0.0
 */

// DOM 元素
const firstSingleWeekInput = document.getElementById('firstSingleWeek');
const saveSettingsBtn = document.getElementById('saveSettings');
const currentMonthSpan = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const calendarGrid = document.getElementById('calendarGrid');
const selectedDateSpan = document.getElementById('selectedDate');
const lunarDateSpan = document.getElementById('lunarDate');

// 当前显示的月份和选中的日期
let currentDate = new Date();
let selectedDate = new Date();

/**
 * 简化的农历转换函数
 * @description 将公历日期转换为农历日期显示
 * @param {Date} date - 需要转换的公历日期
 * @returns {string} 格式化的农历日期字符串，如"农历2024年腊月初八"
 * @example
 * // 返回 "农历2024年腊月初八"
 * toLunar(new Date(2024, 11, 8))
 */
function toLunar(date) {
    const lunarMonths = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
    const lunarDays = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
        "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
        "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
    
    // 简化的农历计算（基于2000年基准）
    const baseDate = new Date(2000, 0, 6);
    const daysDiff = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
    
    if (daysDiff < -3650) return "农历日期";
    
    const lunarYear = 2000 + Math.floor(Math.abs(daysDiff) / 365);
    const yearDay = Math.abs(daysDiff) % 365;
    const lunarMonth = Math.floor(yearDay / 30) + 1;
    const lunarDay = (yearDay % 30) + 1;
    
    const monthStr = lunarMonths[Math.min(lunarMonth - 1, 11)] + "月";
    const dayStr = lunarDays[Math.min(lunarDay - 1, 29)];
    
    return `农历${lunarYear}年${monthStr}${dayStr}`;
}

/**
 * 计算两个日期间的周数差
 * @description 计算目标日期与设定的第一个单休周周一的周数差值
 * @param {Date} date - 目标日期
 * @returns {number} 周数差，正数表示目标日期在基准日期之后
 * @example
 * // 如果基准日期是2024-12-16（周一），目标日期是2024-12-23（周一）
 * // 返回 1
 * calculateWeeksDiff(new Date(2024, 11, 23))
 */
function calculateWeeksDiff(date) {
    const firstWeek = firstSingleWeekInput.value || '2024-12-16';
    const firstWeekMonday = new Date(firstWeek);
    const dayOfWeek = date.getDay();
    
    // 计算当前日期所在周的周一
    const currentWeekMonday = new Date(date);
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    currentWeekMonday.setDate(date.getDate() - daysSinceMonday);
    
    // 计算周数差
    const timeDiff = currentWeekMonday.getTime() - firstWeekMonday.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return Math.floor(daysDiff / 7);
}

/**
 * 判断指定周数差对应的周是否为双休周
 * @description 根据大小周轮换规律判断是否为双休周（周六日休息）
 * @param {number} weeksDiff - 与基准周的周数差
 * @returns {boolean} true表示双休周，false表示单休周
 * @example
 * // 第0周为双休周，返回true
 * isDoubleRestWeek(0)
 * // 第1周为单休周，返回false  
 * isDoubleRestWeek(1)
 */
function isDoubleRestWeek(weeksDiff) {
    const normalizedWeeksDiff = ((weeksDiff % 2) + 2) % 2;
    return normalizedWeeksDiff === 0; // 第0周为双休周
}

// 初始化
document.addEventListener('DOMContentLoaded', async function() {
    await loadSettings();
    updateSelectedDateInfo();
    renderCalendar();
    bindEvents();
});

/**
 * 更新选中日期信息显示
 * @description 更新页面上显示的选中日期和对应的农历信息
 * @returns {void}
 */
function updateSelectedDateInfo() {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (isToday) {
        selectedDateSpan.textContent = `今天 ${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`;
    } else {
        selectedDateSpan.textContent = `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`;
    }
    
    lunarDateSpan.textContent = toLunar(selectedDate);
}

/**
 * 绑定事件监听器
 * @description 为页面元素绑定相应的事件处理函数
 * @returns {void}
 */
function bindEvents() {
    saveSettingsBtn.addEventListener('click', saveSettings);
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

/**
 * 保存设置到Chrome存储
 * @description 将用户设置的第一个单休周日期保存到Chrome同步存储中
 * @async
 * @returns {Promise<void>}
 * @throws {Error} 当保存失败时抛出错误
 */
async function saveSettings() {
    const firstSingleWeek = firstSingleWeekInput.value;
    
    if (!firstSingleWeek) {
        alert('请选择第一个双休周的周一日期！');
        return;
    }
    
    const selectedDate = new Date(firstSingleWeek);
    
    // 验证选择的日期是否为周一
    if (selectedDate.getDay() !== 1) {
        alert('请选择一个周一作为第一个双休周的开始日期！');
        return;
    }
    
    try {
        await chrome.storage.sync.set({
            firstSingleWeek: firstSingleWeek
        });
        
        alert('设置保存成功！');
        renderCalendar();
    } catch (error) {
        console.error('保存设置失败:', error);
        alert('保存设置失败，请重试！');
    }
}

/**
 * 从Chrome存储加载设置
 * @description 从Chrome同步存储中读取用户之前保存的设置
 * @async  
 * @returns {Promise<void>}
 * @throws {Error} 当读取失败时抛出错误
 */
async function loadSettings() {
    try {
        const result = await chrome.storage.sync.get(['firstSingleWeek']);
        if (result.firstSingleWeek) {
            firstSingleWeekInput.value = result.firstSingleWeek;
        } else {
            // 设置默认日期：2024-12-16（周一）- 第一个双休周
            firstSingleWeekInput.value = '2024-12-16';
        }
    } catch (error) {
        console.error('加载设置失败:', error);
        // 出错时也设置默认值
        firstSingleWeekInput.value = '2024-12-16';
    }
}

/**
 * 渲染日历
 * @description 根据当前显示月份渲染完整的日历界面，包括休息日标记
 * @returns {void}
 */
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 更新月份显示
    currentMonthSpan.textContent = `${year}年${month + 1}月`;
    
    // 清空日历网格
    calendarGrid.innerHTML = '';
    
    // 添加星期标题（周一到周日）
    const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
    weekDays.forEach(day => {
        const headerCell = document.createElement('div');
        headerCell.className = 'calendar-header';
        headerCell.textContent = day;
        calendarGrid.appendChild(headerCell);
    });
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // 调整为周一开始（0=周日，1=周一...6=周六）
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // 周日变为6，其他减1
    const daysInMonth = lastDay.getDate();
    
    // 添加上个月的日期（如果需要）
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const dayElement = createDayElement(
            daysInPrevMonth - i,
            new Date(year, month - 1, daysInPrevMonth - i),
            true
        );
        calendarGrid.appendChild(dayElement);
    }
    
    // 添加当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDateObj = new Date(year, month, day);
        const dayElement = createDayElement(day, currentDateObj, false);
        calendarGrid.appendChild(dayElement);
    }
    
    // 添加下个月的日期（如果需要填满网格）
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells + 7; // 6行 * 7列 = 42个单元格，减去标题行
    
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(
            day,
            new Date(year, month + 1, day),
            true
        );
        calendarGrid.appendChild(dayElement);
    }
}

/**
 * 创建日期元素
 * @description 创建单个日期的DOM元素，包含相应的样式类和事件处理
 * @param {number} day - 日期数字（1-31）
 * @param {Date} dateObj - 对应的日期对象
 * @param {boolean} isOtherMonth - 是否为非当前显示月份的日期
 * @returns {HTMLElement} 创建的日期DOM元素
 */
function createDayElement(day, dateObj, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    // 检查是否为今天
    const today = new Date();
    if (dateObj.toDateString() === today.toDateString()) {
        dayElement.classList.add('today');
    }
    
    // 检查是否为选中日期
    if (dateObj.toDateString() === selectedDate.toDateString()) {
        dayElement.classList.add('selected');
    }
    
    // 检查休息日类型
    const restType = getRestDayType(dateObj);
    if (restType) {
        dayElement.classList.add(restType);
    } else {
        dayElement.classList.add('work-day');
    }
    
    // 添加点击事件
    dayElement.addEventListener('click', () => {
        // 移除之前选中的元素的selected类
        const previousSelected = calendarGrid.querySelector('.calendar-day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // 更新选中日期
        selectedDate = new Date(dateObj);
        updateSelectedDateInfo();
        
        // 给当前元素添加selected类
        dayElement.classList.add('selected');
    });
    
    return dayElement;
}

/**
 * 获取休息日类型
 * @description 根据日期判断是否为休息日以及休息日类型
 * @param {Date} date - 要判断的日期
 * @returns {string|null} 返回休息日类型CSS类名或null
 *   - 'single-rest-day': 单休日（周日）
 *   - 'double-rest-day': 双休日（周六或周日）  
 *   - null: 工作日
 * @example
 * // 双休周的周六，返回 'double-rest-day'
 * getRestDayType(new Date(2024, 11, 21)) 
 * // 单休周的周一，返回 null
 * getRestDayType(new Date(2024, 11, 23))
 */
function getRestDayType(date) {
    const weeksDiff = calculateWeeksDiff(date);
    const dayOfWeek = date.getDay();
    const isDoubleWeek = isDoubleRestWeek(weeksDiff);
    
    if (isDoubleWeek) {
        // 双休周：周六周日休息
        return (dayOfWeek === 0 || dayOfWeek === 6) ? 'double-rest-day' : null;
    } else {
        // 单休周：只有周日休息
        return dayOfWeek === 0 ? 'single-rest-day' : null;
    }
}

/**
 * 获取日期所在周的类型描述
 * @description 返回指定日期所在周的类型描述文字
 * @param {Date} date - 要查询的日期
 * @returns {string} 周类型描述，如"双休周（周六日休息）"或"单休周（周日休息）"
 * @example
 * // 返回 "双休周（周六日休息）"
 * getWeekTypeDescription(new Date(2024, 11, 21))
 */
function getWeekTypeDescription(date) {
    const weeksDiff = calculateWeeksDiff(date);
    const isDoubleWeek = isDoubleRestWeek(weeksDiff);
    return isDoubleWeek ? '双休周（周六日休息）' : '单休周（周日休息）';
} 