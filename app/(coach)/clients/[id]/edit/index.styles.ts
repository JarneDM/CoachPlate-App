import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  backBtn: {
    padding: 4,
    alignSelf: "flex-start",
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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },

  fieldGroup: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  fieldFlex: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#111827",
  },
  inputFocused: {
    borderColor: "#16a34a",
    backgroundColor: "#ffffff",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },

  footer: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  saveButtonWrapper: {
    flex: 2,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
