import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { WishlistItem } from "../../types";
import * as Haptics from "expo-haptics";
import styles from "./WishlistItemCard.styles";

interface Props {
  item: WishlistItem;
  onRemove: (id: string) => void;
}

const WishlistItemCard = ({ item, onRemove }: Props) => {
  const handleRemove = () => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            onRemove(item.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };
  const formattedDate = new Date(item.createdAt).toLocaleDateString();

  return (
    <View style={styles.card}>
      <Image
        source={
          item.image
            ? { uri: item.image }
            : require("../../assets/favicon.png")
        }
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title || "No Title"}
        </Text>
        <Text style={styles.domain}>{item.sourceDomain}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>
            {item.price ? `${item.currency || "$"}${item.price}` : "N/A"}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WishlistItemCard;
