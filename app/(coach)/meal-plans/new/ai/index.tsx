import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, ChefHat, ChevronDown, ChevronUp, RotateCcw, Save, Sparkles, User } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { clientsOptions } from "@/lib/query-options";
import { generateMealPlan, saveMealPlanFromAI } from "@/lib/api";
import { AlertModal } from "@/components/AlertModal";
import type { GeneratedPlan } from "@/lib/api/mealplan/mealplan";
import getWeekNumber from "utils/getWeekNumber";
import DayItem from "@/components/mealplan/DayItem";

type Step = "setup" | "generating" | "preview";

export default function GenerateMealPlan() {
  const { data: clients = [], isLoading: loadingClients } = useQuery(clientsOptions);

  const [step, setStep] = useState<Step>("setup");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [extraWishes, setExtraWishes] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [planName, setPlanName] = useState("");
  const [saving, setSaving] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step === "generating") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleGenerate = async () => {
    if (!selectedClient) {
      setAlert({ title: "No client selected", message: "Please select a client before generating a meal plan." });
      return;
    }
    setStep("generating");
    try {
      const plan = await generateMealPlan(selectedClient, extraWishes.trim() || undefined);
      setGeneratedPlan(plan);
      setPlanName(`${selectedClient.full_name} — Week ${getWeekNumber(new Date())}`);
      setStep("preview");
    } catch (e: any) {
      setStep("setup");
      setAlert({ title: "Generation failed", message: e?.message ?? "Something went wrong. Please try again." });
    }
  };

  const handleSave = async () => {
    if (!generatedPlan || !selectedClientId || !planName.trim()) return;
    setSaving(true);
    try {
      const planId = await saveMealPlanFromAI({ name: planName.trim(), clientId: selectedClientId, generatedPlan });
      router.replace(`/(coach)/meal-plans/${planId}` as any);
    } catch {
      setAlert({ title: "Save failed", message: "Could not save the meal plan. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <View style={styles.root}>
      <AlertModal visible={!!alert} title={alert?.title ?? ""} message={alert?.message ?? ""} onConfirm={() => setAlert(null)} />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => (step === "preview" ? setStep("setup") : router.back())}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>{step === "preview" ? "Review plan" : "Generate with AI"}</Text>
      </View>

      {step === "generating" && (
        <View style={styles.generating}>
          <View style={styles.generatingIcon}>
            <ChefHat size={26} color="#16a34a" />
          </View>
          <Text style={styles.generatingTitle}>Creating your meal plan…</Text>
          <Text style={styles.generatingHint}>This usually takes 1–2 minutes</Text>
          <Text style={styles.generatingTimer}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </Text>
        </View>
      )}

      {step === "preview" && generatedPlan && (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.nameInput}
              value={planName}
              onChangeText={setPlanName}
              placeholder="Plan name"
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity onPress={handleGenerate} style={styles.regenerateRow} activeOpacity={0.7}>
              <RotateCcw size={13} color="#9ca3af" />
              <Text style={styles.regenerateText}>Not happy? Regenerate</Text>
            </TouchableOpacity>

            <View style={styles.card}>
              {generatedPlan.days.map((day, i) => (
                <DayItem
                  key={day.day}
                  day={day}
                  isOpen={expandedDay === day.day}
                  isLast={i === generatedPlan.days.length - 1}
                  onToggle={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleSave} disabled={saving || !planName.trim()} activeOpacity={0.85} style={styles.actionBtn}>
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionGradient}>
                {saving ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Save size={16} color="#ffffff" />
                    <Text style={styles.actionText}>Save meal plan</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === "setup" && (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View>
              <Text style={styles.label}>Client</Text>
              {loadingClients ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator color="#16a34a" size="small" />
                </View>
              ) : clients.length === 0 ? (
                <View style={styles.emptyBox}>
                  <User size={20} color="#d1d5db" />
                  <Text style={styles.emptyText}>No clients yet</Text>
                </View>
              ) : (
                <View style={styles.card}>
                  {clients.map((client, i) => {
                    const selected = client.id === selectedClientId;
                    return (
                      <TouchableOpacity
                        key={client.id}
                        onPress={() => setSelectedClientId(client.id)}
                        style={[styles.clientRow, i < clients.length - 1 && styles.clientRowBorder, selected && styles.clientRowSelected]}
                        activeOpacity={0.6}
                      >
                        <View style={[styles.avatar, selected && styles.avatarSelected]}>
                          <Text style={[styles.avatarText, selected && styles.avatarTextSelected]}>
                            {client.full_name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.clientInfo}>
                          <Text style={[styles.clientName, selected && styles.clientNameSelected]}>{client.full_name}</Text>
                          {client.goal ? (
                            <Text style={styles.clientGoal} numberOfLines={1}>
                              {client.goal}
                            </Text>
                          ) : null}
                        </View>
                        {selected && <Check size={15} color="#16a34a" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            <View>
              <Text style={styles.label}>
                Extra wishes <Text style={styles.labelOptional}>(optional)</Text>
              </Text>
              <TextInput
                style={styles.textarea}
                placeholder="High protein, no gluten, avoid dairy…"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={extraWishes}
                onChangeText={setExtraWishes}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleGenerate} activeOpacity={0.85} style={styles.actionBtn}>
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionGradient}>
                <Sparkles size={16} color="#ffffff" />
                <Text style={styles.actionText}>Generate meal plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f9fafb" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: { padding: 2 },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },

  generating: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  generatingIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#f0fdf4",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  generatingTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  generatingHint: { fontSize: 13, color: "#9ca3af" },
  generatingTimer: { fontSize: 28, fontWeight: "700", color: "#16a34a", marginTop: 12, letterSpacing: 2 },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 20, paddingBottom: 32 },

  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 },
  labelOptional: { fontWeight: "400", color: "#9ca3af" },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },

  loadingBox: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 24,
    alignItems: "center",
    gap: 6,
  },
  emptyText: { fontSize: 13, color: "#9ca3af" },

  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  clientRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f9fafb" },
  clientRowSelected: { backgroundColor: "#f0fdf4" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSelected: { backgroundColor: "#dcfce7" },
  avatarText: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  avatarTextSelected: { color: "#15803d" },
  clientInfo: { flex: 1, minWidth: 0 },
  clientName: { fontSize: 14, fontWeight: "500", color: "#111827" },
  clientNameSelected: { color: "#15803d" },
  clientGoal: { fontSize: 12, color: "#9ca3af", marginTop: 1 },

  textarea: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 14,
    fontSize: 14,
    color: "#111827",
    minHeight: 88,
  },

  nameInput: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  regenerateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginTop: -8,
  },
  regenerateText: { fontSize: 12, color: "#9ca3af" },

  footer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 16,
  },
  actionBtn: { borderRadius: 12, overflow: "hidden" },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  actionText: { fontSize: 15, fontWeight: "600", color: "#ffffff" },
});
