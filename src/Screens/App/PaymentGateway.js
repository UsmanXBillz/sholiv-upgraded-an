import React, { useState } from 'react';
import { Text, View, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Header, TextField } from '../../Components';
import { AppData, Colors, Icons, Images, Metrix, NavigationService } from '../../Config';
import { ToastError, expiry_format, fonts } from '../../Config/Helper';
import gstyles from '../../styles';
import Toast from 'react-native-toast-message';


const PaymentGateway = () => {

    const [selectedFilter, setSelectedFilter] = useState('Per View');
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [securityCode, setSecurityCode] = useState('');

    const handleFilterSelect = (filter) => setSelectedFilter(filter);

    const renderItem = () => (
        <View style={styles.paymentCardItem}>
            <Image source={Images.paymentCard} resizeMethod='contain' />
        </View>
    );

    const handleSecurityCodeChange = (text) => {
        const numericText = text.replace(/\D/g, '');
        const limitedText = numericText.slice(0, 4);
        setSecurityCode(limitedText);
    };

    const handleExpiryDate = (text) => {
        setExpirationDate(expiry_format(text));
    }

    const confirmPayment = () => {
        // if (!name || !cardNumber || !expirationDate || !securityCode) {
        //     return Toast.show(ToastError('All Fields are required'));
        // }
        NavigationService.navigate('SuccessfulPayment')

    }

    return (
        <View style={gstyles.container}>
            <Header
                back={true}
                title={'Payment Gateway'}
                isIcon={true}
                isImage={true}
                image={Images.paymentGateway}
                onLeftIconPress={() => NavigationService.navigate('RecentTransactions')}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.paymentCardContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[1, 2]}
                        renderItem={renderItem}
                    />
                </View>
                <View style={gstyles.centeredAlignedRow}>
                    <View style={styles.filterContainer}>
                        {['Per View', 'Monthly'].map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.filterButton,
                                    selectedFilter === filter && styles.selectedFilter
                                ]}
                                onPress={() => handleFilterSelect(filter)}
                            >
                                <Text allowFontScaling={false} style={[
                                    styles.filterLabel,
                                    selectedFilter === filter && styles.selectedFilterText
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View>

                </View>
                <View style={[gstyles.marginTop30, gstyles.marginBottom20]}>
                    <View style={gstyles.marginVertical15}>
                        <TextField
                            value={name}
                            placeholder={'Chaz Mad'}
                            label='Name on Card'
                            secureTextEntry={false}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={gstyles.marginVertical15}>
                        <TextField
                            value={cardNumber}
                            placeholder={'*** *** ***'}
                            label='Card Number'
                            secureTextEntry={false}
                            onChangeText={(text) => setCardNumber(text)}
                        />

                    </View>
                    <View style={gstyles.marginVertical15}>

                        <View style={gstyles.spacedBetweenRow}>
                            <View style={{ width: '48%' }}>
                                <TextField
                                    value={expirationDate}
                                    placeholder={'MM/YY'}
                                    label='Expiration Date'
                                    secureTextEntry={false}
                                    onChangeText={handleExpiryDate}
                                    keyboardType='number-pad'
                                />
                            </View>
                            <View style={{ width: '48%' }}>
                                <TextField
                                    value={securityCode}
                                    placeholder={'1241'}
                                    label='Security Code'
                                    secureTextEntry={false}
                                    onChangeText={handleSecurityCodeChange}
                                    keyboardType='number-pad'
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={gstyles.marginVertical20}>
                    <Button buttonText='Confirm Payment' onPress={confirmPayment} />
                </View>
            </ScrollView>
        </View>
    );
};

export default PaymentGateway;

const styles = StyleSheet.create({
    paymentCardContainer: {
        marginLeft: Metrix.HorizontalSize(10),
        marginVertical: Metrix.VerticalSize(40),
    },
    paymentCardItem: {
        marginLeft: Metrix.HorizontalSize(20),
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.blue,
        width: '62%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Metrix.VerticalSize(6),
        borderRadius: 30,
    },
    filterButton: {
        paddingVertical: Metrix.VerticalSize(6),
        paddingHorizontal: Metrix.HorizontalSize(18),
        borderRadius: 20,
    },
    filterLabel: {
        color: Colors.white,
        fontFamily: fonts.MontserratBold,
        fontSize: Metrix.customFontSize(14),
    },
    selectedFilter: {
        backgroundColor: Colors.white,
    },
    selectedFilterText: {
        color: Colors.black,
    },
});
