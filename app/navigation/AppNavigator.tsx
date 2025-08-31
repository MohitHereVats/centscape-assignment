import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WishlistScreen from "../screens/WishlistScreen/WishlistScreen";

export type RootStackParamList = {
  Wishlist: { newItemUrl?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{ title: "My Wishlist" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
