var dateUtils = require('./date')

var DEFAULT_SETTINGS = {
  dailyTarget: 10,
  pricePerPack: 25,
  sticksPerPack: 20,
  reminderEnabled: false,
  reminderTimes: ['09:00', '15:00', '21:00']
}

function normalizeSettings(settings) {
  var source = settings || {}
  var dailyTarget = Number(source.dailyTarget)
  var pricePerPack = Number(source.pricePerPack)
  var sticksPerPack = Number(source.sticksPerPack)

  return {
    dailyTarget: dailyTarget > 0 ? dailyTarget : DEFAULT_SETTINGS.dailyTarget,
    pricePerPack: pricePerPack >= 0 ? pricePerPack : DEFAULT_SETTINGS.pricePerPack,
    sticksPerPack: sticksPerPack > 0 ? sticksPerPack : DEFAULT_SETTINGS.sticksPerPack,
    reminderEnabled: Boolean(source.reminderEnabled),
    reminderTimes: Array.isArray(source.reminderTimes) && source.reminderTimes.length
      ? source.reminderTimes
      : DEFAULT_SETTINGS.reminderTimes
  }
}

function countByDate(records) {
  return (records || []).reduce(function (result, record) {
    if (!record || !record.date) return result
    result[record.date] = (result[record.date] || 0) + 1
    return result
  }, {})
}

function getRecordsByDate(records, dateText) {
  return (records || []).filter(function (record) {
    return record.date === dateText
  })
}

function buildDailySeries(records, rangeDays, todayText) {
  var counts = countByDate(records)
  var daily = []

  for (var index = rangeDays - 1; index >= 0; index -= 1) {
    var date = dateUtils.shiftDate(todayText, -index)
    daily.push({
      date: date,
      label: date.slice(5),
      count: counts[date] || 0
    })
  }

  return daily
}

function buildStats(records, settings, rangeDays, todayText) {
  var safeRange = rangeDays === 30 ? 30 : 7
  var safeSettings = normalizeSettings(settings)
  var today = todayText || dateUtils.formatDate()
  var daily = buildDailySeries(records, safeRange, today)
  var total = daily.reduce(function (sum, item) {
    return sum + item.count
  }, 0)
  var todayCount = daily.length ? daily[daily.length - 1].count : 0
  var yesterdayText = dateUtils.shiftDate(today, -1)
  var yesterdayCount = getRecordsByDate(records, yesterdayText).length
  var estimatedCost = safeSettings.sticksPerPack
    ? total / safeSettings.sticksPerPack * safeSettings.pricePerPack
    : 0
  var maxCount = daily.reduce(function (max, item) {
    return Math.max(max, item.count)
  }, safeSettings.dailyTarget)

  return {
    rangeDays: safeRange,
    target: safeSettings.dailyTarget,
    total: total,
    average: Number((total / safeRange).toFixed(1)),
    overTargetDays: daily.filter(function (item) {
      return item.count > safeSettings.dailyTarget
    }).length,
    estimatedCost: Number(estimatedCost.toFixed(2)),
    daily: daily.map(function (item) {
      return {
        date: item.date,
        label: item.label,
        count: item.count,
        percent: maxCount ? Math.round(item.count / maxCount * 100) : 0,
        overTarget: item.count > safeSettings.dailyTarget
      }
    }),
    todayCount: todayCount,
    yesterdayCount: yesterdayCount,
    deltaFromYesterday: todayCount - yesterdayCount
  }
}

module.exports = {
  DEFAULT_SETTINGS: DEFAULT_SETTINGS,
  normalizeSettings: normalizeSettings,
  countByDate: countByDate,
  getRecordsByDate: getRecordsByDate,
  buildStats: buildStats
}
