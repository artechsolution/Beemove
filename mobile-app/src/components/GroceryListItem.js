import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import CustomText from "./CustomText";
import CustomTextInput from "./CustomTextInput";
import { Spacer } from "./Spacer";
import AddlButton from "./AddlButton";
import { verticalScale } from "react-native-size-matters";
import { images } from "../../assets/images";
import { colors } from "../../Utils/Colors";

const { height, width } = Dimensions.get("window");

const GroceryListItem = ({ placeholder, label, index, gList, setGList }) => {
  // const [gList, setGList] = useState([1]);
  const [product, setProduct] = useState({
    name: "",
    qty: "",
  });
  useEffect(() => {
    // gList[index]=product;
    // 1. Make a shallow copy of the items
    let items = [...gList];
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[index] };
    // 3. Replace the property the whole object you're intested in
    item = product;
    // 4. Put it back into our array. N.B. we *are* mutating the array here,
    //    but that's why we made a copy first
    items[index] = item;
    // 5. Set the state to our new copy
    setGList([...items]);
  }, [product]);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <CustomTextInput
        onChangeText={(v) => {
          setProduct({ ...product, name: v });
        }}
        //   withLabel={item?.withLabel}
        value={product.name}
        placeholder={placeholder}
        fontSize={12}
        paddingLeft={20}
        // paddingTop={10}
        placeholderTextColor={"#9C9C9C"}
        fontFamily={"Roboto-Light"}
        width={width / 1.52}
      />
      <CustomTextInput
        onChangeText={(v) => {
          setProduct({ ...product, qty: v });
        }}
        //   withLabel={item?.withLabel}
        // value={product.qty}
        placeholder={"qty"}
        fontSize={12}
        //   paddingLeft={20}
        // paddingTop={10}
        keyboardType={"numeric"}
        placeholderTextColor={"#9C9C9C"}
        fontFamily={"Roboto-Light"}
        width={width / 7}
      />
      <Spacer width={1} />
    </View>
  );
};

export default GroceryListItem;
