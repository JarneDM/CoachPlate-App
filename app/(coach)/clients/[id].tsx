import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { Target, TriangleAlert, NotebookPen, CalendarDays, Bot, Pencil, ArrowLeft } from "lucide-react-native";
import { useClientById } from "@/hooks/coach/useClientById";
import MacroCard from "@/components/coach/clients/MacroCard";
import styles from "./[id].styles";

function DetailClient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, loading } = useClientById(id);

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
              <TouchableOpacity style={styles.editIconBtn} activeOpacity={0.7}>
                <Pencil size={16} color="#9ca3af" />
              </TouchableOpacity>
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
          {client.preferences ? (
            <Text style={styles.preferencesText}>{client.preferences}</Text>
          ) : (
            <Text style={styles.emptyText}>No preferences or notes</Text>
          )}
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
