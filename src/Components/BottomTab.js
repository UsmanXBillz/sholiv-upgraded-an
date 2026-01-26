import React from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { Colors, Icons, Images, Metrix, NavigationService } from '../Config';
import { fonts } from '../Config/Helper';
import { AppData } from '../Config';
import { Home, Explore, EditProfile, ChatListing, UserProfile } from '../Screens';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const tabs = [
  {
    id: '1',
    name: 'Home',
    icon: 'home-outline',
    position: 'LEFT',
    component: Home,
  },
  {
    id: '2',
    name: 'Explore',
    position: 'LEFT',
    icon: 'settings-outline',
    component: Explore,
  },
  {
    id: '3',
    name: 'Chat',
    position: 'RIGHT',
    icon: 'settings-outline',
    component: ChatListing,
  },
  {
    id: '5',
    name: 'Profile',
    position: 'RIGHT',
    icon: 'settings-outline',
    component: UserProfile,
  },
];

const { iconRenderer } = AppData;

export default function BottomTabs() {
  const FanTab = createBottomTabNavigator();
  const user = useSelector(state => state?.AuthReducer?.user);

  // Render tab bar item
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}>
        {iconRenderer[routeName](routeName == selectedTab)}
        <Text allowFontScaling={false}
          style={[
            styles.tabText,
            {
              color:
                selectedTab == routeName ? Colors.blue : Colors.white,
            },
          ]}>
          {routeName}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render centered circle component
  const renderCenteredCircle = () => {
    return (
      <Animated.View style={styles.btnCircleUp}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => NavigationService.navigate('StartLive')}>
          <Icons.Feather
            name="video"
            color={Colors.white}
            size={Metrix.customFontSize(26)}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Conditionally render bottom tabs based on isArtist
  if (user?.user_role == 2) {
    return (
      <FanTab.Navigator
        tabBar={(props) => {
          return (
            <View style={styles.bottomTabContainer}>
              {props.state.routes.map((val, index) => (

                <TouchableOpacity
                  hitSlop={{ bottom: 30, left: 20, right: 20, top: 0 }}
                  key={index.toString()}
                  onPress={() => {
                    props.navigation.navigate(val.name);
                  }}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: Metrix.HorizontalSize(20),
                  }}
                >
                  {iconRenderer[val?.name](props.state.index == index)}
                  <Text allowFontScaling={false} style={{ ...styles.tabTextStyle, color: props.state.index == index ? Colors.blue : Colors.white }}>{val?.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        }}
        screenOptions={() => ({
          headerShown: false,
          unmountOnBlur: true,
          keyboardHidesTabBar: true,
        })}
      >

        {
          tabs?.map(val => (
            <FanTab.Screen
              key={val?.id}
              name={val?.name}
              component={val?.component}
            />
          ))
        }
      </FanTab.Navigator>
    );
  } else {
    return (
      <CurvedBottomBar.Navigator
        type="DOWN"
        shadowStyle={styles.shawdow}
        height={Metrix.VerticalSize(Platform.OS === 'ios' ? 60 : 80)}
        initialRouteName="Home"
        circleWidth={65}
        bgColor={Colors.inputBg}
        screenOptions={{ headerShown: false }}
        borderTopLeftRight
        renderCircle={renderCenteredCircle}
        tabBar={renderTabBar}>
        {tabs.map(val => (
          <CurvedBottomBar.Screen
            key={val?.id}
            name={val?.name}
            position={val?.position}
            component={val?.component}
          />
        ))}
      
      </CurvedBottomBar.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  shawdow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  btnCircleUp: {
    width: Metrix.HorizontalSize(55),
    height: Metrix.HorizontalSize(55),
    borderRadius: Metrix.VerticalSize(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    bottom: Metrix.VerticalSize(32),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(10),
    marginTop: Metrix.VerticalSize(6),
  },
  bottomTabContainer: {
    height: Metrix.VerticalSize(84),
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.carbonBlack,
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabTextStyle: {
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(10),
    marginTop: Metrix.VerticalSize(6),
  },
});
