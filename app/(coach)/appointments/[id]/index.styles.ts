import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#d1d5db",
    textAlign: "center",
    paddingVertical: 8,
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#16a34a",
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  clientName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  appointmentType: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
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

  notesText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
});

export default styles;
