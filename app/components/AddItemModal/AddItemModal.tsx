import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "./AddItemModal.styles";

interface Props {
    visible: boolean;
    onClose: () => void;
    onAdd: (url: string) => void;
    isAdding: boolean;
    initialUrl?: string | null;
}

const AddItemModal = ({ visible, onClose, onAdd, isAdding, initialUrl }: Props) => {
   const [url, setUrl] = useState("");

   useEffect(() => {
     if (initialUrl) {
       setUrl(initialUrl);
     }
   }, [initialUrl]);

   const handleAdd = () => {
     if(url.trim()) {
       onAdd(url);
       setUrl("");
     }
   };

   return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Item</Text>
          <Text style={styles.modalSubTitle}>Paste the product URL below.</Text>
          
          <TextInput
            style={styles.input}
            placeholder="https://..."
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, styles.addButton, isAdding && styles.buttonDisabled]}
            onPress={handleAdd}
            disabled={isAdding}
            accessibilityLabel="Add this item to the wishlist" 
          >
            {isAdding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Item</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={onClose}
            accessibilityLabel="Close this modal" 
          >
            <Text style={[styles.buttonText, styles.closeButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddItemModal;
