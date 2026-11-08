export const MOCK_STATS = {
  characterQuota: {
    used: 84250,
    total: 100000,
    percentage: 84.25,
    resetsInDays: 12
  },
  audioHours: {
    totalMinutes: 1104, // 18.4 hours
    formattedHours: "18.4 hrs",
    trend: "+2.8 hrs this week"
  },
  voices: {
    presetCount: 8,
    customCount: 2,
    cloningPending: 1,
    totalSlots: 15
  },
  storage: {
    usedBytes: 1503238553, // ~1.4 GB
    formattedUsed: "1.4 GB",
    totalBytes: 10737418240, // 10 GB
    formattedTotal: "10 GB",
    percentage: 14.0
  },
  recentActivity: [
    { type: "generated", title: "Q3 Earnings Keynote Opening Statement", time: "2 hours ago", voice: "Marcus Sterling" },
    { type: "cloned", title: "Dr. Raymond Vance Model v1.2", time: "Yesterday", voice: "Custom Model" },
    { type: "generated", title: "Deep Work Meditation Guide - Chapter 4", time: "2 days ago", voice: "Soren Lindqvist" },
    { type: "exported", title: "The Clockwork Manor Audio Pack", time: "4 days ago", voice: "Evelyn Harper" },
  ]
};
