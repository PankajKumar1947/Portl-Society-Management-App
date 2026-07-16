import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { theme } from "../../constants";

export interface DateItem {
  date: Date;
  dayLabel: string;
  dayNum: string;
  isToday: boolean;
}

export interface HorizontalCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({
  selectedDate,
  onDateChange,
}) => {
  // Generate 7 days starting from today
  const days: DateItem[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
    const dayNum = String(d.getDate());
    const isToday = i === 0;
    return { date: d, dayLabel, dayNum, isToday };
  });

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.monthHeader}>
        {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {days.map((item, index) => {
          const isSelected = isSameDay(item.date, selectedDate);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDateChange(item.date)}
              style={[
                styles.dayButton,
                isSelected && styles.selectedDayButton,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayLabel, isSelected && styles.selectedText]}>
                {item.dayLabel}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.selectedText]}>
                {item.dayNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: theme.spacing.sm,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  container: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  dayButton: {
    width: 60,
    height: 72,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  dayNum: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  selectedText: {
    color: theme.colors.text,
  },
});

export default HorizontalCalendar;
