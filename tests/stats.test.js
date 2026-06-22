var assert = require('assert')
var stats = require('../utils/stats')

var records = [
  { id: '1', timestamp: 1, date: '2026-05-28' },
  { id: '2', timestamp: 2, date: '2026-05-28' },
  { id: '3', timestamp: 3, date: '2026-05-27' },
  { id: '4', timestamp: 4, date: '2026-05-26' },
  { id: '5', timestamp: 5, date: '2026-05-26' },
  { id: '6', timestamp: 6, date: '2026-05-26' }
]

var result = stats.buildStats(records, {
  dailyTarget: 2,
  pricePerPack: 20,
  sticksPerPack: 10,
  reminderEnabled: false,
  reminderTimes: []
}, 7, '2026-05-28')

assert.strictEqual(result.total, 6)
assert.strictEqual(result.todayCount, 2)
assert.strictEqual(result.yesterdayCount, 1)
assert.strictEqual(result.deltaFromYesterday, 1)
assert.strictEqual(result.overTargetDays, 1)
assert.strictEqual(result.estimatedCost, 12)
assert.strictEqual(result.daily.length, 7)

var todayRecords = stats.getRecordsByDate(records, '2026-05-28')
assert.strictEqual(todayRecords.length, 2)

console.log('stats tests passed')
