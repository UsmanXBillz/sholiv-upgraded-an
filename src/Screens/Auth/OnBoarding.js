import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Button, ScreenTopImage } from '../../Components';
import { AppData, Colors, Images, Metrix, NavigationService } from '../../Config';
import { fonts } from '../../Config/Helper';
import gstyles from '../../styles';

const listLeft = [
    { id: '1', image: Images.alexa, name: 'Alexa' },
    { id: '1', image: Images.jackson, name: 'Jackson' },
    { id: '1', image: Images.sofia, name: 'Sophia' }
];

const listCenter = [
    { id: '1', image: Images.ethan, name: 'Ethan' },
    { id: '1', image: Images.avatarone, name: 'Evelyn' }
];

const listRight = [
    { id: '1', image: Images.mia, name: 'Ethan' },
    { id: '1', image: Images.amelia, name: 'Amelia' },
    { id: '1', image: Images.ava, name: 'Ava' }
];

const OnboardingCard = ({item}) => (
    <View style={styles.imageContainer}>
        <ScreenTopImage image={item?.image} size={70} style={gstyles.marginVertical20} />
        <Text allowFontScaling={false} style={styles.name}>{item?.name}</Text>
    </View>
);

const OnBoarding = () => {
    return (
        <ScrollView style={gstyles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
                <View style={styles.rowContainer}>
                    <View>
                        {listLeft.map(( item, index) => <OnboardingCard key={index} item={item} />)}
                    </View>
                    <View style={styles.centerColumn}>
                        {listCenter.map((item, index) => <OnboardingCard key={index} item={item}  />)}
                    </View>
                    <View>
                        {listRight.map((item, index) => <OnboardingCard key={index}  item={item} />)}
                    </View>
                </View>
                <View style={[gstyles.marginTop10, gstyles.marginBottom50]}>
                    <Text allowFontScaling={false} style={styles.title}>Discover more. Sign up now!</Text>
                    <Text allowFontScaling={false} style={styles.description}>
                        Elevate your experience. Join now for exclusive content and live interactions!
                    </Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.signUpBtn}>
                            <Button
                                buttonText='Sign Up'
                                onPress={() => NavigationService.navigate('Signup')}
                                btnStyle={{ paddingVertical: Metrix.VerticalSize(12) }}
                            />
                        </View>
                        <View style={styles.signInBtn}>
                            <Button
                                buttonText='Sign In'
                                onPress={() => NavigationService.navigate('Login')}
                                btnStyle={{ paddingVertical: Metrix.VerticalSize(12) }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default OnBoarding;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        marginTop: Metrix.VerticalSize(60)
    },
    centerColumn: {
        marginTop: Metrix.VerticalSize(100),
        marginHorizontal: Metrix.HorizontalSize(30)
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: Metrix.VerticalSize(20),
    },
    title: {
        fontSize: Metrix.customFontSize(38),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white
    },
    description: {
        fontSize: Metrix.customFontSize(18),
        fontFamily: fonts.RubikLight,
        color: Colors.white,
        marginVertical: Metrix.VerticalSize(20)
    },
    signInBtn: {
        width: '40%',
        marginLeft: Metrix.HorizontalSize(10)
    },
    signUpBtn: {
        width: '40%'
    },
    name: {
        fontSize: Metrix.customFontSize(18),
        fontFamily: fonts.MontserratMedium,
        color: Colors.white,
    },
    imageContainer: {
        backgroundColor: Colors.carbonBlack,
        alignItems: 'center',
        borderRadius: 16,
        width: Metrix.HorizontalSize(100),
        height: Metrix.VerticalSize(160),
        marginBottom: Metrix.VerticalSize(40)
    }
});
