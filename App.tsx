import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getMovies } from "./src/api";
import Backdrop, { ITEM_SIZE } from "./src/components/Backdrop";
import Genres from "./src/components/Genres";
import Loading from "./src/components/Loading";
import Rating from "./src/components/Rating";
import { Movie } from "./src/types";

const { width } = Dimensions.get("window");

const SPACING = 10;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;

const App: React.FC = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [movies, setMovies] = useState<Partial<Movie>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      setMovies([{ key: "empty-left" }, ...movies, { key: "empty-right" }]);
    };

    if (movies.length === 0) {
      fetchData().then();
    }
  }, [movies]);

  if (movies.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Backdrop movies={movies} scrollX={scrollX} />
      <StatusBar hidden />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key as string}
        contentContainerStyle={{
          alignItems: "center",
        }}
        horizontal
        data={movies}
        snapToInterval={ITEM_SIZE}
        snapToAlignment="start"
        decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
        renderToHardwareTextureAndroid
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: "clamp",
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 34,
                  transform: [{ translateY }],
                }}
              >
                <Image
                  source={{ uri: item.poster }}
                  style={styles.posterImage}
                />
                <Text style={{ fontSize: 24 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Rating rating={item.rating as number} />
                <Genres genres={item.genres as string[]} />
                <Text style={{ fontSize: 12 }} numberOfLines={3}>
                  {item.description}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});

export default App;
