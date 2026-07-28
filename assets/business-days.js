/**
 * Business Days Calculator - Core Engine
 * Pure JavaScript, no dependencies.
 * Calculates dates excluding weekends and public holidays.
 * Supports US federal holidays and UK bank holidays.
 */

/* ---------- Low-level date helpers ---------- */

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function isWeekend(date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// Nth occurrence of a weekday in a month. weekday: 0=Sun .. 6=Sat
function nthWeekday(year, month, weekday, n) {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(year, month, day);
}

// Last occurrence of a weekday in a month
function lastWeekday(year, month, weekday) {
  const lastDay = new Date(year, month + 1, 0);
  const offset = (lastDay.getDay() - weekday + 7) % 7;
  return new Date(year, month, lastDay.getDate() - offset);
}

// Easter Sunday (Gregorian) via the Anonymous Gregorian algorithm
function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/* ---------- Holiday data ---------- */

function getUSHolidays(year) {
  return [
    { date: new Date(year, 0, 1),            name: "New Year's Day" },
    { date: nthWeekday(year, 0, 1, 3),       name: "Martin Luther King Jr. Day" },
    { date: nthWeekday(year, 1, 1, 3),       name: "Presidents' Day" },
    { date: lastWeekday(year, 4, 1),         name: "Memorial Day" },
    { date: new Date(year, 5, 19),           name: "Juneteenth" },
    { date: new Date(year, 6, 4),            name: "Independence Day" },
    { date: nthWeekday(year, 8, 1, 1),       name: "Labor Day" },
    { date: nthWeekday(year, 9, 1, 2),       name: "Columbus Day" },
    { date: new Date(year, 10, 11),          name: "Veterans Day" },
    { date: nthWeekday(year, 10, 4, 4),      name: "Thanksgiving Day" },
    { date: new Date(year, 11, 25),          name: "Christmas Day" }
  ];
}

function getUKHolidays(year) {
  const easter = easterSunday(year);
  return [
    { date: new Date(year, 0, 1),            name: "New Year's Day" },
    { date: addDays(easter, -2),             name: "Good Friday" },
    { date: addDays(easter, 1),              name: "Easter Monday" },
    { date: nthWeekday(year, 4, 1, 1),       name: "Early May Bank Holiday" },
    { date: lastWeekday(year, 4, 1),         name: "Spring Bank Holiday" },
    { date: lastWeekday(year, 7, 1),         name: "Summer Bank Holiday" },
    { date: new Date(year, 11, 25),          name: "Christmas Day" },
    { date: new Date(year, 11, 26),          name: "Boxing Day" }
  ];
}

function getCAHolidays(year) {
  const easter = easterSunday(year);
  return [
    { date: new Date(year, 0, 1),            name: "New Year's Day" },
    { date: nthWeekday(year, 1, 1, 3),       name: "Family Day" },
    { date: addDays(easter, -2),             name: "Good Friday" },
    { date: nthWeekday(year, 4, 1, -1),      name: "Victoria Day" },
    { date: new Date(year, 6, 1),            name: "Canada Day" },
    { date: nthWeekday(year, 7, 1, 1),       name: "Civic Holiday" },
    { date: nthWeekday(year, 8, 1, 1),       name: "Labour Day" },
    { date: nthWeekday(year, 9, 1, 2),       name: "Thanksgiving" },
    { date: new Date(year, 10, 11),          name: "Remembrance Day" },
    { date: new Date(year, 11, 25),          name: "Christmas Day" },
    { date: new Date(year, 11, 26),          name: "Boxing Day" }
  ];
}

function getAUHolidays(year) {
  const easter = easterSunday(year);
  return [
    { date: new Date(year, 0, 1),            name: "New Year's Day" },
    { date: new Date(year, 0, 26),           name: "Australia Day" },
    { date: addDays(easter, -2),             name: "Good Friday" },
    { date: addDays(easter, 1),              name: "Easter Monday" },
    { date: new Date(year, 3, 25),           name: "ANZAC Day" },
    { date: nthWeekday(year, 5, 1, 2),       name: "King's Birthday" },
    { date: nthWeekday(year, 9, 1, 1),       name: "Labour Day" },
    { date: new Date(year, 11, 25),          name: "Christmas Day" },
    { date: new Date(year, 11, 26),          name: "Boxing Day" }
  ];
}

function getHolidays(country, year) {
  if (country === "uk") return getUKHolidays(year);
  if (country === "ca") return getCAHolidays(year);
  if (country === "au") return getAUHolidays(year);
  return getUSHolidays(year);
}

function findHoliday(date, country) {
  const holidays = getHolidays(country, date.getFullYear());
  for (let i = 0; i < holidays.length; i++) {
    if (sameDay(holidays[i].date, date)) return holidays[i];
  }
  return null;
}

function isBusinessDay(date, country) {
  if (isWeekend(date)) return false;
  if (findHoliday(date, country)) return false;
  return true;
}

/* ---------- Core calculations ---------- */

/**
 * Add a number of business days to a start date.
 * The start date itself is not counted; counting begins the next calendar day.
 * @returns {{ resultDate: Date, skippedHolidays: Array, calendarDays: number }}
 */
function addBusinessDays(startDate, days, country) {
  country = country || "us";
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const date = new Date(start);
  const skipped = [];
  let counted = 0;

  if (days <= 0) {
    while (!isBusinessDay(date, country)) {
      const hol = findHoliday(date, country);
      if (hol) skipped.push({ date: new Date(date), name: hol.name });
      date.setDate(date.getDate() + 1);
    }
    return {
      resultDate: date,
      skippedHolidays: skipped,
      calendarDays: Math.round((date - start) / 86400000)
    };
  }

  while (counted < days) {
    date.setDate(date.getDate() + 1);
    if (isWeekend(date)) continue;
    const hol = findHoliday(date, country);
    if (hol) {
      skipped.push({ date: new Date(date), name: hol.name });
      continue;
    }
    counted++;
  }
  return {
    resultDate: date,
    skippedHolidays: skipped,
    calendarDays: Math.round((date - start) / 86400000)
  };
}

/**
 * Count business days between two dates (exclusive of the end date).
 */
function businessDaysBetween(start, end, country) {
  country = country || "us";
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  const stop = new Date(end);
  stop.setHours(0, 0, 0, 0);
  let count = 0;
  while (d < stop) {
    d.setDate(d.getDate() + 1);
    if (isBusinessDay(d, country)) count++;
  }
  return count;
}

/* ---------- Formatting ---------- */

var MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"];

function formatDate(date) {
  return WEEKDAYS[date.getDay()] + ", " + MONTHS[date.getMonth()] + " "
    + date.getDate() + ", " + date.getFullYear();
}

function formatDateShort(date) {
  return MONTHS_SHORT[date.getMonth()] + " " + date.getDate() + ", "
    + date.getFullYear();
}

function todayString() {
  return formatDate(new Date());
}

function toISODate(date) {
  var m = (date.getMonth() + 1);
  var d = date.getDate();
  return date.getFullYear() + "-"
    + (m < 10 ? "0" + m : m) + "-"
    + (d < 10 ? "0" + d : d);
}

/* ---------- Browser export ---------- */

if (typeof window !== "undefined") {
  window.BizDays = {
    addBusinessDays: addBusinessDays,
    businessDaysBetween: businessDaysBetween,
    isBusinessDay: isBusinessDay,
    findHoliday: findHoliday,
    getHolidays: getHolidays,
    getUSHolidays: getUSHolidays,
    getUKHolidays: getUKHolidays,
    getCAHolidays: getCAHolidays,
    getAUHolidays: getAUHolidays,
    formatDate: formatDate,
    formatDateShort: formatDateShort,
    todayString: todayString,
    toISODate: toISODate,
    sameDay: sameDay,
    isWeekend: isWeekend,
    WEEKDAYS: WEEKDAYS,
    MONTHS: MONTHS
  };
}
