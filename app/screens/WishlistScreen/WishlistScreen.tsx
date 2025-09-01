import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Linking, RefreshControl } from 'react-native';
import styles from './WishlistScreen.styles';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { WishlistItem } from '../../types';
import useWishlist from '../../hooks/useWishlist';
import WishlistItemCard from '../../components/WishlistItemCard/WishlistItemCard';
import { COLORS, SIZES } from '../../constants/theme';
import AddItemModal from '../../components/AddItemModal/AddItemModal';

const WishlistScreen = () => {
  const { wishlist, loading, error, addItem, removeItem, refreshWishlist } = useWishlist();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [urlToAddFromLink, setUrlToAddFromLink] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleDeepLink = useCallback((event: { url: string }) => {
    const url = event.url;
    // Url that starts with "centscape://add?url=";
    const match = url.match(/centscape:\/\/add\?url=([^&]+)/);
    if (match && match[1]) {
      const decodedUrl = decodeURIComponent(match[1]);
      setModalVisible(true);
      setUrlToAddFromLink(decodedUrl);
    }
  }, []);

  useEffect(() => {
    // Listen for incoming links
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check for initial URL
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });
    
    return () => subscription.remove();
  }, [handleDeepLink]);
  
  const handleAddItem = async (url: string) => {
    setIsAdding(true);
    try {
      await addItem(url);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add item.');
    } finally {
      setIsAdding(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshWishlist();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const closeModal = () => {
    setModalVisible(false);
    setUrlToAddFromLink(null);
  }

  return (
    <View style={styles.container}>
      {wishlist.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Your wishlist is empty.</Text>
          <Text style={styles.emptySubText}>Tap the '+' button to add an item.</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WishlistItemCard item={item} onRemove={removeItem} />}
          contentContainerStyle={{ padding: SIZES.padding }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add item to your Centscape Wishlist" 
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <AddItemModal
        visible={isModalVisible}
        onClose={closeModal}
        onAdd={handleAddItem}
        isAdding={isAdding}
        initialUrl={urlToAddFromLink}
      />
    </View>
  );
};
  
export default WishlistScreen;
