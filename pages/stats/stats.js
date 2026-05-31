var storage = require('../../utils/storage')

Page({
  data: {
    rangeDays: 7,
    summary: {
      total: 0,
      average: 0,
      overTargetDays: 0,
      estimatedCost: '0.00',
      target: 10,
      daily: []
    },
    compareText: '今天和昨天持平'
  },

  onShow: function () {
    this.refresh()
  },

  switchRange: function (event) {
    var rangeDays = Number(event.currentTarget.dataset.range)
    this.setData({
      rangeDays: rangeDays
    })
    this.refresh()
  },

  refresh: function () {
    var summary = storage.getStats(this.data.rangeDays)
    summary.estimatedCost = summary.estimatedCost.toFixed(2)

    this.setData({
      summary: summary,
      compareText: this.getCompareText(summary.deltaFromYesterday)
    })
  },

  getCompareText: function (delta) {
    if (delta > 0) return '今天比昨天多 ' + delta + ' 支'
    if (delta < 0) return '今天比昨天少 ' + Math.abs(delta) + ' 支'
    return '今天和昨天持平'
  }
})
