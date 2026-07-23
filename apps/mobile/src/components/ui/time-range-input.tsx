import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useFormContext, useWatch } from "react-hook-form";
import { theme } from "@/constants";

function parseTime(timeStr: string): Date {
  const clean = (timeStr || "").trim();
  const [h = "08", m = "00"] = clean.split(":");
  const date = new Date();
  date.setHours(parseInt(h, 10) || 8, parseInt(m, 10) || 0, 0, 0);
  return date;
}

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatDisplay(date: Date): string {
  let h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, "0");
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${period}`;
}

interface TimeFieldProps {
  name: string;
}

function TimeField({ name }: TimeFieldProps) {
  const { control, setValue } = useFormContext();
  const value: string = useWatch({ control, name }) ?? "";
  const [showPicker, setShowPicker] = useState(false);
  const date = parseTime(value);

  const handleChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowPicker(false);
      }
      if (selectedDate) {
        setValue(name, formatTime(selectedDate));
      }
    },
    [name, setValue],
  );

  return (
    <View style={styles.timeField}>
      <TouchableOpacity
        style={styles.timeButton}
        activeOpacity={0.7}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.timeText}>{formatDisplay(date)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "clock"}
          onChange={handleChange}
          themeVariant="light"
        />
      )}
    </View>
  );
}

interface TimeRangeInputProps {
  openTimeName: string;
  closeTimeName: string;
}

export function TimeRangeInput({
  openTimeName,
  closeTimeName,
}: TimeRangeInputProps) {
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <TimeField name={openTimeName} />
      </View>
      <Text style={styles.dash}>–</Text>
      <View style={styles.inputWrap}>
        <TimeField name={closeTimeName} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  inputWrap: {
    flex: 1,
  },
  timeField: {},
  timeButton: {
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
  },
  timeText: {
    fontSize: 15,
    color: theme.colors.text,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  dash: {
    fontSize: 16,
    color: theme.colors.textMuted,
    marginBottom: 14,
  },
});
