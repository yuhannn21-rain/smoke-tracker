var storage = require('../../utils/storage')
var dateUtils = require('../../utils/date')

Page({
  data: {
    todayDate: '',
    todayCount: 0,
    dailyTarget: 10,
    remainingText: '10 支',
    statusText: '',
    statusClass: 'safe',
    progressPercent: 0,
    deltaText: '持平',
    todayCost: '0.00',
    weeklyAverage: 0,
    weeklyMessage: ''
  },

  onShow: function () {
    this.refresh()
  },

  handleAddRecord: function () {
    storage.addSmokeRecord()
    wx.vibrateShort({ type: 'light' })
    wx.showToast({
      title: '已记录',
      icon: 'success'
    })
    this.refresh()
  },

  refresh: function () {
    var settings = storage.getSettings()
    var sevenDayStats = storage.getStats(7)
    var today = dateUtils.formatDate()
    var todayCount = sevenDayStats.todayCount
    var target = settings.dailyTarget
    var remaining = target - todayCount
    var progressPercent = Math.min(Math.round(todayCount / target * 100), 100)
    var status = this.getStatus(todayCount, target)
    var todayCost = settings.sticksPerPack
      ? todayCount / settings.sticksPerPack * settings.pricePerPack
      : 0

    this.setData({
      todayDate: today,
      todayCount: todayCount,
      dailyTarget: target,
      remainingText: remaining > 0 ? remaining + ' 支' : '0 支',
      statusText: status.text,
      statusClass: status.className,
      progressPercent: progressPercent,
      deltaText: this.getDeltaText(sevenDayStats.deltaFromYesterday),
      todayCost: todayCost.toFixed(2),
      weeklyAverage: sevenDayStats.average,
      weeklyMessage: this.getWeeklyMessage(sevenDayStats.average, target)
    })
  },

  getStatus: function (todayCount, target) {
    if (todayCount < target) {
      return {
        className: 'safe',
        text: '还在目标内'
      }
    }

    if (todayCount === target) {
      return {
        className: 'warn',
        text: '已达今日目标'
      }
    }

    return {
      className: 'over',
      text: '已超出 ' + (todayCount - target) + ' 支'
    }
  },

  getDeltaText: function (delta) {
    if (delta > 0) return '多 ' + delta + ' 支'
    if (delta < 0) return '少 ' + Math.abs(delta) + ' 支'
    return '持平'
  },

  getWeeklyMessage: function (average, target) {
    if (average <= target) return '近一周平均值仍在目标内。'
    return '近一周平均值高于当前目标。'
  }
})
