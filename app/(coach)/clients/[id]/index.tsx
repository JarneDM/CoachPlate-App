import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { Target, TriangleAlert, NotebookPen, CalendarDays, Bot, Pencil, ArrowLeft, UserRound } from "lucide-react-native";
import { useGetClientByIdQueryOptions } from "@/lib/query-options/coach/clients"
import { GENDER_LABELS, ACTIVITY_LABELS } from "@/utils/client";
import MacroCard from "@/components/coach/clients/MacroCard";
import styles from "./index.styles";
import { useQuery } from "@tanstack/react-query"

function calcBmi(weight: number | null, height: number | null): string | null {
  if (!weight || !height) return null;
  return (weight / Math.pow(height / 100, 2)).toFixed(1);
}

function calcAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday = today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  return beforeBirthday ? age - 1 : age;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function DetailClient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: client, isLoading: loading } = useQuery(useGetClientByIdQueryOptions(id))

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Client not found.</Text>
      </View>
    );
  }

  const bmi = calcBmi(client.weight_kg, client.height_cm);
  const age = calcAge(client.birth_date);
  const hasMacros = client.calories_goal || client.protein_goal || client.carbs_goal || client.fat_goal;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={18} color="#374151" />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{client.full_name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.headerInfo}>
              <View style={styles.headerText}>
                <Text style={styles.clientName} numberOfLines={1}>{client.full_name}</Text>
                {client.email ? <Text style={styles.clientEmail} numberOfLines={1}>{client.email}</Text> : null}
                {client.goal ? (
                  <View style={styles.goalBadge}>
                    <Text style={styles.goalBadgeText}>{client.goal}</Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => router.push(`/(coach)/clients/${id}/edit`)} style={styles.editIconBtn} activeOpacity={0.7}>
                <Pencil size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.statGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{client.weight_kg != null ? `${client.weight_kg}` : "—"}</Text>
              <Text style={styles.statLabel}>Weight (kg)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{client.height_cm != null ? `${client.height_cm}` : "—"}</Text>
              <Text style={styles.statLabel}>Height (cm)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{bmi ?? "—"}</Text>
              <Text style={styles.statLabel}>BMI</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{age != null ? `${age}` : "—"}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={14} color="#6b7280" />
            <Text style={styles.sectionTitle}>Macro goals</Text>
          </View>
          {hasMacros ? (
            <View style={styles.macroGrid}>
              <View style={styles.macroGridItem}>
                <MacroCard label="Calories" value={client.calories_goal} unit="kcal" color="orange" />
              </View>
              <View style={styles.macroGridItem}>
                <MacroCard label="Protein" value={client.protein_goal} unit="g" color="blue" />
              </View>
              <View style={styles.macroGridItem}>
                <MacroCard label="Carbs" value={client.carbs_goal} unit="g" color="yellow" />
              </View>
              <View style={styles.macroGridItem}>
                <MacroCard label="Fats" value={client.fat_goal} unit="g" color="red" />
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>No macro goals set yet</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TriangleAlert size={14} color="#6b7280" />
            <Text style={styles.sectionTitle}>Allergies & intolerances</Text>
          </View>
          {client.allergies && client.allergies.length > 0 ? (
            <View style={styles.allergyList}>
              {client.allergies.map((allergy) => (
                <View key={allergy} style={styles.allergyTag}>
                  <Text style={styles.allergyTagText}>{allergy}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No allergies registered</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <NotebookPen size={14} color="#6b7280" />
            <Text style={styles.sectionTitle}>Preferences & notes</Text>
          </View>
          {client.preferences || client.notes ? (
            <>
              {client.preferences ? (
                <View style={styles.notesBlock}>
                  <Text style={styles.notesBlockLabel}>Preferences</Text>
                  <Text style={styles.preferencesText}>{client.preferences}</Text>
                </View>
              ) : null}
              {client.notes ? (
                <View style={styles.notesBlock}>
                  <Text style={styles.notesBlockLabel}>Notes</Text>
                  <Text style={styles.preferencesText}>{client.notes}</Text>
                </View>
              ) : null}
            </>
          ) : (
            <Text style={styles.emptyText}>No preferences or notes</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserRound size={14} color="#6b7280" />
            <Text style={styles.sectionTitle}>Personal info</Text>
          </View>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{client.gender ? GENDER_LABELS[client.gender] : "—"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of birth</Text>
              <Text style={styles.infoValue}>{client.birth_date ? formatDate(client.birth_date) : "—"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Activity level</Text>
              <Text style={styles.infoValue}>{client.active ? (ACTIVITY_LABELS[client.active] ?? "—") : "—"}</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Added on</Text>
              <Text style={styles.infoValue}>{formatDate(client.created_at)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CalendarDays size={14} color="#6b7280" />
            <Text style={styles.sectionTitle}>Quick actions</Text>
          </View>
          <View style={styles.actionButtonRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/(coach)/meal-plans/new?client=${id}` as any)}>
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionButton}>
                <CalendarDays size={16} color="#ffffff" />
                <Text style={styles.actionButtonText}>New meal plan</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/(coach)/meal-plans/new/ai?client=${id}` as any)}>
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionButton}>
                <Bot size={16} color="#ffffff" />
                <Text style={styles.actionButtonText}>Generate AI meal plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default DetailClient;
