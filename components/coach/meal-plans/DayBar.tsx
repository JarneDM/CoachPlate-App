import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DAY_NAMES } from "@/constants/meal-plan";
import type { Day } from "@/types/meal-plan";

type DayTotals = { calories: number; protein: number; carbs: number; fat: number };

export function DayBar({
  days,
  selectedDayIndex,
  onSelectDay,
  getDayTotals,
}: {
  days: Day[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  getDayTotals: (day: Day) => DayTotals;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dayBar}
      contentContainerStyle={styles.dayBarContent}
    >
      {days.map((day, index) => {
        const active = index === selectedDayIndex;
        const t = getDayTotals(day);
        const hasFood = t.calories > 0;
        return (
          <TouchableOpacity
            key={day.id}
            onPress={() => onSelectDay(index)}
            style={[styles.dayTab, active && styles.dayTabActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayTabLabel, active && styles.dayTabLabelActive]}>
              {DAY_NAMES[day.day_number - 1]}
            </Text>
            {day.date && (
              <Text style={[styles.dayTabDate, active && styles.dayTabDateActive]}>
                {new Date(day.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </Text>
            )}
            {hasFood && <View style={[styles.dayDot, active && styles.dayDotActive]} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dayBar: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    flexGrow: 0,
  },
  dayBarContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  dayTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 52,
  },
  dayTabActive: { backgroundColor: "#f0fdf4" },
  dayTabLabel: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  dayTabLabelActive: { color: "#15803d" },
  dayTabDate: { fontSize: 10, color: "#d1d5db", marginTop: 2 },
  dayTabDateActive: { color: "#86efac" },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
    marginTop: 4,
  },
  dayDotActive: { backgroundColor: "#16a34a" },
});
