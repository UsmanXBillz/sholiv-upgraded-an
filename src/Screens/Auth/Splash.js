import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Images, Metrix, NavigationService } from '../../Config';
import gstyles from '../../styles';
import { ScreenTopImage } from '../../Components';
// import LottieView from 'lottie-react-native';

const Splash = () => {
    return (
        <TouchableOpacity
            onPress={() => NavigationService.navigate('OnBoarding')}
            style={[gstyles.container, gstyles.justifyAlignCenter]}>
            {/* Background animation */}
            {/* <LottieView
                source={require("../../assets/animation.json")}
                style={{width: "100%", height: "100%"}}
                autoPlay
                loop
                />
         */}
            <View style={[gstyles.justifyAlignCenter, gstyles.marginVertical30]}>
                <ScreenTopImage image={Images.logo} size={270} rounded={false} />
            </View>
        </TouchableOpacity>
    )
}

export default Splash

const styles = StyleSheet.create({

})

