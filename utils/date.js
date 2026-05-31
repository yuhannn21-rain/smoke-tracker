function pad(value) {
  return value < 10 ? '0' + value : '' + value
}

function formatDate(date) {
  var target = date || new Date()
  return [
    target.getFullYear(),
    pad(target.getMonth() + 1),
    pad(target.getDate())
  ].join('-')
}

function formatTime(timestamp) {
  var target = new Date(timestamp)
  return pad(target.getHours()) + ':' + pad(target.getMinutes())
}

function shiftDate(dateText, offsetDays) {
  var parts = dateText.split('-').map(function (part) {
    return Number(part)
  })
  var target = new Date(parts[0], parts[1] - 1, parts[2])
  target.setDate(target.getDate() + offsetDays)
  return formatDate(target)
}

function dateLabel(dateText) {
  var today = formatDate()
  if (dateText === today) return '今天'
  if (dateText === shiftDate(today, -1)) return '昨天'
  return dateText
}

module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  shiftDate: shiftDate,
  dateLabel: dateLabel
}
