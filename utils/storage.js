var dateUtils = require('./date')
var stats = require('./stats')

var RECORDS_KEY = 'smoke_records'
var SETTINGS_KEY = 'user_settings'

function readKey(key, fallback) {
  try {
    var value = wx.getStorageSync(key)
    return value || fallback
  } catch (error) {
    return fallback
  }
}

function writeKey(key, value) {
  wx.setStorageSync(key, value)
}

function getAllRecords() {
  var records = readKey(RECORDS_KEY, [])
  return Array.isArray(records) ? records : []
}

function saveRecords(records) {
  writeKey(RECORDS_KEY, Array.isArray(records) ? records : [])
}

function addSmokeRecord(note) {
  var now = new Date()
  var record = {
    id: String(now.getTime()) + '-' + Math.random().toString(16).slice(2),
    timestamp: now.getTime(),
    date: dateUtils.formatDate(now)
  }

  if (note) {
    record.note = note
  }

  var records = getAllRecords()
  records.push(record)
  saveRecords(records)
  return record
}

function deleteSmokeRecord(id) {
  var records = getAllRecords().filter(function (record) {
    return record.id !== id
  })
  saveRecords(records)
}

function getRecordsByDate(dateText) {
  return stats.getRecordsByDate(getAllRecords(), dateText).sort(function (a, b) {
    return b.timestamp - a.timestamp
  })
}

function getSettings() {
  return stats.normalizeSettings(readKey(SETTINGS_KEY, stats.DEFAULT_SETTINGS))
}

function updateSettings(settings) {
  var nextSettings = stats.normalizeSettings(Object.assign({}, getSettings(), settings || {}))
  writeKey(SETTINGS_KEY, nextSettings)
  return nextSettings
}

function getStats(rangeDays) {
  return stats.buildStats(getAllRecords(), getSettings(), rangeDays)
}

function clearAllData() {
  wx.removeStorageSync(RECORDS_KEY)
  wx.removeStorageSync(SETTINGS_KEY)
}

module.exports = {
  RECORDS_KEY: RECORDS_KEY,
  SETTINGS_KEY: SETTINGS_KEY,
  addSmokeRecord: addSmokeRecord,
  deleteSmokeRecord: deleteSmokeRecord,
  getRecordsByDate: getRecordsByDate,
  getAllRecords: getAllRecords,
  getSettings: getSettings,
  updateSettings: updateSettings,
  getStats: getStats,
  clearAllData: clearAllData
}
