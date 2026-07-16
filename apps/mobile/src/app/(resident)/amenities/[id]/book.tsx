import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { HorizontalCalendar } from "@/components/ui/horizontal-calendar";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { Modal } from "@/components/ui/modal";

interface TimeSlot {
  id: string;
  label: string;
  isBooked: boolean;
}

const MOCK_SLOTS: TimeSlot[] = [
  { id: "1", label: "06:00 AM – 09:00 AM", isBooked: false },
  { id: "2", label: "09:00 AM – 12:00 PM", isBooked: false },
  { id: "3", label: "12:00 PM – 03:00 PM", isBooked: true },
  { id: "4", label: "03:00 PM – 06:00 PM", isBooked: false },
  { id: "5", label: "06:00 PM – 09:00 PM", isBooked: false },
];

export default function BookAmenityScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleContinue = () => {
    if (!selectedSlot) return;
    setConfirmVisible(true);
  };

  const executeBooking = () => {
    setConfirmVisible(false);
    const slotLabel = MOCK_SLOTS.find((s) => s.id === selectedSlot)?.label || "";
    router.push({
      pathname: "/(resident)/amenities/[id]/confirm",
      params: {
        id,
        name,
        date: selectedDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        time: slotLabel,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={`Book ${name || "Amenity"}`} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Horizontal Calendar */}
        <HorizontalCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.slotsContainer}>
            {MOCK_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  disabled={slot.isBooked}
                  onPress={() => setSelectedSlot(slot.id)}
                  style={[
                    styles.slotButton,
                    slot.isBooked && styles.bookedSlot,
                    isSelected && styles.selectedSlot,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.slotText,
                      slot.isBooked && styles.bookedSlotText,
                      isSelected && styles.selectedSlotText,
                    ]}
                  >
                    {slot.label}
                  </Text>
                  {isSelected && <View style={styles.selectedDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pricing & CTA */}
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <Text style={styles.priceValue}>₹500</Text>
          </View>
          <Button
            onPress={handleContinue}
            disabled={!selectedSlot}
            style={styles.continueButton}
          >
            Continue
          </Button>
        </View>
      </ScrollView>

      <Modal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        title="Confirm Booking"
        description={`Are you sure you want to book ${name || "this amenity"} for ₹500?`}
        confirmLabel="Confirm Booking"
        cancelLabel="Cancel"
        onConfirm={executeBooking}
        confirmVariant="primary"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  slotsContainer: {
    gap: theme.spacing.sm,
  },
  slotButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
  },
  bookedSlot: {
    backgroundColor: theme.colors.surfaceSecondary,
    opacity: 0.5,
  },
  selectedSlot: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  slotText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  bookedSlotText: {
    color: theme.colors.textMuted,
    textDecorationLine: "line-through",
  },
  selectedSlotText: {
    color: theme.colors.text,
  },
  selectedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primaryDark,
  },
  priceContainer: {
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  continueButton: {
    height: 52,
  },
});
