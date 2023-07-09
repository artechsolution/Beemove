import {
    Animated,
    Button,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    View,
  } from "react-native";
  import React, { useRef } from "react";
  
  const { height, width } = Dimensions.get("window");
  
  const DraggableSheet = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const lastGesture = useRef(0);
    const dragThreshold = 50;
    const springAnimation = (direction) => {
      lastGesture.current = direction === "down" ? 0 : height / 10 - height / 1.5;
      Animated.spring(animatedValue, {
        toValue: lastGesture.current,
        useNativeDriver: true,
      }).start();
    };
  
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          console.log("grant", lastGesture.current);
          animatedValue.setOffset(lastGesture.current);
        },
        onPanResponderMove: (e, gesture) => {
          console.log("move", gesture.dy);
          animatedValue.setValue(gesture.dy);
        },
        onPanResponderRelease: (e, gesture) => {
          console.log("release", gesture.dy);
          animatedValue.flattenOffset();
          // lastGesture.current += gesture.dy;
          // if (lastGesture.current < height / 10 - height / 1.5) {
          //   lastGesture.current = height / 10 - height / 1.5;
          // } else if (lastGesture.current > 0) {
          //   lastGesture.current = 0;
          // }
  
          if (gesture.dy > 0) {
            if (gesture.dy <= dragThreshold) {
              springAnimation("up");
            } else {
              springAnimation("down");
            }
          } else {
            if (gesture.dy >= -dragThreshold) {
              springAnimation("down");
            } else {
              springAnimation("up");
            }
          }
        },
      })
    ).current;
  
    const bottomSheetAnimatedValue = {
      transform: [
        {
          translateY: animatedValue.interpolate({
            inputRange: [height / 10 - height / 1.5, 0],
            outputRange: [height / 10 - height / 1.5, 0],
            extrapolate: "clamp",
          }),
        },
      ],
    };
  
    return (
      <View style={styles.container}>
        <Button title="Click Me" />
        <Animated.View style={[styles.bottomSheet, bottomSheetAnimatedValue]}>
          <View style={styles.draggableArea} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>
        </Animated.View>
      </View>
    );
  };
  
  export default DraggableSheet;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    bottomSheet: {
      position: "absolute",
      bottom: height / 10 - height / 1.5,
      backgroundColor: "#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      width: width,
      height: height / 1.5,
  
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
  
      elevation: 24,
    },
    dragHandle: {
      height: 8,
      backgroundColor: "#aaa",
      borderRadius: 10,
      width: 100,
    },
    draggableArea: {
      // backgroundColor:"red",
      height: 50,
      width: 150,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  