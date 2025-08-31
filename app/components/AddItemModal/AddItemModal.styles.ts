import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "../../constants/theme";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: SIZES.radius * 2,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.text,
  },
  modalSubTitle: {
    marginBottom: 15,
    textAlign: "center",
    color: COLORS.textSecondary,
  },
  input: {
    height: 44,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    borderRadius: SIZES.radius,
    padding: 12,
    elevation: 2,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  closeButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButtonText: {
    color: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
  },
});

export default styles;
