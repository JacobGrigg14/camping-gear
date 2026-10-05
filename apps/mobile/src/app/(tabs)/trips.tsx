import Ionicons from "@expo/vector-icons/Ionicons";
import { checklistTemplates } from "@basecamp/shared";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { NamePrompt } from "@/components/NamePrompt";
import { T } from "@/components/T";
import { requireAuth, useAuth } from "@/store/auth";
import { useTrips, type Trip } from "@/store/trips";
import { colors, fonts, radius, space } from "@/theme";

type Starting = { templateId?: string; defaultName: string };

export default function TripsScreen() {
  const user = useAuth((s) => s.user);
  const trips = useTrips((s) => s.trips);
  const createTrip = useTrips((s) => s.createTrip);
  const load = useTrips((s) => s.load);
  const [starting, setStarting] = useState<Starting | null>(null);

  // Pick up changes made on the website or another device.
  useFocusEffect(
    useCallback(() => {
      if (user) load();
    }, [user, load]),
  );

  const start = (choice: Starting) => {
    if (requireAuth()) setStarting(choice);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.md, paddingBottom: space.xxl }}>
      {trips.length > 0 && (
        <>
          <T variant="h2">Your trips</T>
          {trips.map((t) => (
            <TripRow key={t.id} trip={t} />
          ))}
        </>
      )}

      <T variant="h2" style={{ marginTop: trips.length ? space.lg : 0 }}>
        Start a packing list
      </T>
      <T variant="small">
        Pick a template and we'll fill in the essentials, with gear picks for each item.
        {!user && " Sign in to save your trips. They sync with the website."}
      </T>
      {checklistTemplates.map((tpl) => {
        const count = tpl.sections.reduce((n, s) => n + s.items.length, 0);
        return (
          <Pressable
            key={tpl.id}
            onPress={() => start({ templateId: tpl.id, defaultName: tpl.name })}
            style={({ pressed }) => [styles.template, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
          >
            <View style={{ flex: 1, gap: 2 }}>
              <T variant="h3">{tpl.name}</T>
              <T variant="small">{tpl.description}</T>
              <T variant="caption">{count} items</T>
            </View>
            <Ionicons name="add-circle" size={28} color={colors.ember500} />
          </Pressable>
        );
      })}
      <Pressable
        onPress={() => start({ defaultName: "" })}
        style={({ pressed }) => [styles.template, styles.blank, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
      >
        <T style={{ flex: 1, fontFamily: fonts.semibold, color: colors.forest700 }}>Start from scratch</T>
        <Ionicons name="add" size={22} color={colors.forest700} />
      </Pressable>

      <NamePrompt
        visible={starting !== null}
        title="Name your trip"
        placeholder="e.g. Yosemite, June"
        initialValue={starting?.defaultName}
        submitLabel="Create"
        onCancel={() => setStarting(null)}
        onSubmit={async (name) => {
          const templateId = starting?.templateId;
          setStarting(null);
          const id = await createTrip(name, templateId);
          if (id) router.push(`/trip/${id}`);
        }}
      />
    </ScrollView>
  );
}

function TripRow({ trip }: { trip: Trip }) {
  const done = trip.items.filter((i) => i.checked).length;
  const total = trip.items.length;
  return (
    <Link href={`/trip/${trip.id}`} asChild>
      <Pressable style={styles.trip}>
        <View style={{ flex: 1, gap: space.xs }}>
          <T variant="h3">{trip.name}</T>
          <T variant="caption">
            {done} of {total} packed
          </T>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: total ? `${(done / total) * 100}%` : "0%" }]} />
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.bark300} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  template: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.canvas200,
    padding: space.lg,
  },
  blank: { backgroundColor: "transparent", borderStyle: "dashed", borderColor: colors.forest300 },
  trip: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.forest500,
    padding: space.lg,
  },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.canvas200, overflow: "hidden" },
  progressFill: { height: 6, backgroundColor: colors.forest500 },
});
