var storage = require('../../utils/storage')

Page({
  data: {
    form: {
      dailyTarget: 10,
      pricePerPack: 25,
      sticksPerPack: 20,
      reminderEnabled: false,
      reminderTimes: []
    },
    reminderTimesText: ''
  },

  onShow: function () {
    this.loadSettings()
  },

  loadSettings: function () {
    var settings = storage.getSettings()
    this.setData({
      form: settings,
      reminderTimesText: settings.reminderTimes.join(', ')
    })
  },

  handleInput: function (event) {
    var field = event.currentTarget.dataset.field
    var value = event.detail.value
    var form = Object.assign({}, this.data.form)
    form[field] = value
    this.setData({
      form: form
    })
  },

  handleReminderSwitch: function (event) {
    var form = Object.assign({}, this.data.form, {
      reminderEnabled: event.detail.value
    })
    this.setData({
      form: form
    })
  },

  handleReminderTimes: function (event) {
    this.setData({
      reminderTimesText: event.detail.value
    })
  },

  saveSettings: function () {
    var form = this.data.form
    var reminderTimes = this.data.reminderTimesText.split(',')
      .map(function (item) {
        return item.trim()
      })
      .filter(Boolean)

    storage.updateSettings({
      dailyTarget: Number(form.dailyTarget),
      pricePerPack: Number(form.pricePerPack),
      sticksPerPack: Number(form.sticksPerPack),
      reminderEnabled: Boolean(form.reminderEnabled),
      reminderTimes: reminderTimes
    })

    wx.showToast({
      title: '已保存',
      icon: 'success'
    })
    this.loadSettings()
  },

  confirmClear: function () {
    var self = this

    wx.showModal({
      title: '清除全部数据？',
      content: '所有记录和设置都会被删除。',
      confirmText: '清除',
      confirmColor: '#cc5b49',
      success: function (result) {
        if (!result.confirm) return
        storage.clearAllData()
        wx.showToast({
          title: '已清除',
          icon: 'success'
        })
        self.loadSettings()
      }
    })
  }
})
