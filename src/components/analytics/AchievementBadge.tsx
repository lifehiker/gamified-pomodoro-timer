interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { key: "first_pomodoro", title: "First Focus", description: "Complete your first Pomodoro", icon: "&#127813;", unlocked: false },
  { key: "five_day_streak", title: "On Fire", description: "5-day streak", icon: "&#128293;", unlocked: false },
  { key: "ten_sessions", title: "Getting Serious", description: "Complete 10 sessions", icon: "&#9889;", unlocked: false },
  { key: "hundred_sessions", title: "Centurion", description: "Complete 100 sessions", icon: "&#128175;", unlocked: false },
  { key: "level_10", title: "Veteran", description: "Reach level 10", icon: "&#127942;", unlocked: false },
  { key: "early_bird", title: "Early Bird", description: "Complete a session before 8am", icon: "&#127749;", unlocked: false },
];

interface AchievementBadgeProps {
  achievements?: Achievement[];
}

export function AchievementBadges({ achievements = ACHIEVEMENTS }: AchievementBadgeProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {achievements.map((achievement) => (
        <div key={achievement.key} className={"flex items-center gap-3 p-3 rounded-lg border transition-all " + (achievement.unlocked ? "bg-neon-green/10 border-neon-green/30" : "bg-[#0d0d20] border-[#1a1a2e] opacity-40")}>
          <div className="text-2xl" dangerouslySetInnerHTML={{ __html: achievement.icon }} />
          <div>
            <div className={"font-mono text-xs font-bold " + (achievement.unlocked ? "text-neon-green" : "text-gray-500")}>{achievement.title}</div>
            <div className="font-mono text-[10px] text-gray-600">{achievement.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
