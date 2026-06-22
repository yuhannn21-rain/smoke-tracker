export type SmokeRecord = {
  id: string
  timestamp: number
  date: string
  note?: string
}

export type UserSettings = {
  dailyTarget: number
  pricePerPack: number
  sticksPerPack: number
  reminderEnabled: boolean
  reminderTimes: string[]
}

export type SmokeStats = {
  rangeDays: 7 | 30
  target: number
  total: number
  average: number
  overTargetDays: number
  estimatedCost: number
  todayCount: number
  yesterdayCount: number
  deltaFromYesterday: number
  daily: Array<{
    date: string
    label: string
    count: number
    percent: number
    overTarget: boolean
  }>
}
