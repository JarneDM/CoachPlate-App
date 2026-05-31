import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },

  header: {
    gap: 16,
  },
  backBtn: {
    padding: 4,
    alignSelf: "flex-start",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    minWidth: 0,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  editIconBtn: {
    padding: 4,
    marginLeft: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#15803d",
  },
  clientName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  clientEmail: {
    fontSize: 13,
    color: "#9ca3af",
  },
  goalBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#f0fdf4",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  goalBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16a34a",
  },

  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    width: "47%",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
  },

  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  macroGridItem: {
    width: "48%",
  },

  allergyList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  allergyTag: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  allergyTagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ef4444",
  },

  notesBlock: {
    gap: 4,
  },
  notesBlockLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  preferencesText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
  },

  infoList: {
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    paddingLeft: 16,
  },

  emptyText: {
    fontSize: 13,
    color: "#d1d5db",
    textAlign: "center",
    paddingVertical: 8,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  actionButtonRow: {
    gap: 10,
  },
});

export default styles;
