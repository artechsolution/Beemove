import {
  scale,
  ScaledSheet,
  verticalScale,
  moderateScale,
} from "react-native-size-matters";
import { Platform, View } from "react-native";
import { colors } from "./Colors";
const commonStyles = ScaledSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor:colors.white
  },
  container1:{
    flexDirection: "column",
    flex: 1,
    backgroundColor:colors.gray1,
    paddingHorizontal:scale(30)

  },
  container2:{
    flexDirection: "column",
    flex: 1,
    backgroundColor:"white",
    paddingHorizontal:scale(30)

  },
  rowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowSpacerBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  rowMain: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  padding: {
    paddingHorizontal: 20,
  },

  justify: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
  iconContainer: {
    width: moderateScale(25),
    height: verticalScale(25),
  },
  img: {
    width: "100%",
    height: "100%",
  },

  containerCenter: {
    justifyContent: "center",
    alignItems: "center",
  },

  IosPadding: {
    flex: 1,
    paddingTop: Platform.OS == "ios" ? verticalScale(40) : 5,
    paddingHorizontal: moderateScale(15),
  },
  PH10: {
    paddingHorizontal: scale(10),
  },
  PH20: {
    paddingHorizontal: scale(20),
  },
  PH30: {
    paddingHorizontal: scale(30),
  },
  PH40: {
    paddingHorizontal: scale(40),
  },
});

export default commonStyles;
