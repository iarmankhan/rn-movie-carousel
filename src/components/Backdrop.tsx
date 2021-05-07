import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  View,
} from "react-native";

import { Movie } from "../types";

const { width, height } = Dimensions.get("window");

const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const BACKDROP_HEIGHT = height * 0.65;

interface BackdropProps {
  movies: Partial<Movie>[];
  scrollX: any;
}

const Backdrop: React.FC<BackdropProps> = ({ movies, scrollX }) => {
  return (
    <View style={{ position: "absolute", width, height: BACKDROP_HEIGHT }}>
      <FlatList
        data={movies.reverse()}
        keyExtractor={(item) => item.key + "-backdrop"}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) return null;

          const inputRange = [(index - 3) * ITEM_SIZE, (index - 2) * ITEM_SIZE];

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-width, 0],
          });

          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: "absolute",
                width: translateX,
                height,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: item.backdrop }}
                style={{ width, height: BACKDROP_HEIGHT, position: "absolute" }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "white"]}
        style={{
          width,
          height: BACKDROP_HEIGHT,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};

export default Backdrop;
