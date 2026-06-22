var storage = require('../../utils/storage')
var dateUtils = require('../../utils/date')

Page({
  data: {
    selectedDate: '',
    dateLabel: '',
    isToday: true,
    records: []
  },

  onShow: function () {
    var selectedDate = this.data.selectedDate || dateUtils.formatDate()
    this.loadDate(selectedDate)
  },

  goPreviousDay: function () {
    this.loadDate(dateUtils.shiftDate(this.data.selectedDate, -1))
  },

  goNextDay: function () {
    if (this.data.isToday) return
    this.loadDate(dateUtils.shiftDate(this.data.selectedDate, 1))
  },

  loadDate: function (dateText) {
    var records = storage.getRecordsByDate(dateText).map(function (record) {
      return Object.assign({}, record, {
        time: dateUtils.formatTime(record.timestamp)
      })
    })

    this.setData({
      selectedDate: dateText,
      dateLabel: dateUtils.dateLabel(dateText),
      isToday: dateText === dateUtils.formatDate(),
      records: records
    })
  },

  confirmDelete: function (event) {
    var id = event.currentTarget.dataset.id
    var self = this

    wx.showModal({
      title: '删除这条记录？',
      content: '删除后当天统计会同步更新。',
      confirmText: '删除',
      confirmColor: '#cc5b49',
      success: function (result) {
        if (!result.confirm) return
        storage.deleteSmokeRecord(id)
        wx.showToast({
          title: '已删除',
          icon: 'success'
        })
        self.loadDate(self.data.selectedDate)
      }
    })
  }
})
