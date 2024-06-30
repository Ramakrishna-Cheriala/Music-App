import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/constants/tokens";
import { StackScreenWithSearchBar } from "@/constants/layout";

const FavoritesScreenLayout = () => {
  return (
    <View className={`flex-1 bg-${colors.background}`}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTransparent: false,
            headerTitle: "Favorites",
            headerTitleStyle: {
              fontSize: 40,
              fontWeight: "bold",
            },
          }}
        />
      </Stack>
    </View>
  );
};

export default FavoritesScreenLayout;
