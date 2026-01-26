import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import gstyles from '../styles'
import { ConditionalData, Images, Metrix } from '../Config';
import { fonts, formatAmount } from '../Config/Helper';
import { useDispatch, useSelector } from 'react-redux';
import { ArtistMiddleware } from '../Redux/Middlewares';
import { useTranslation } from 'react-i18next';

// type 1 for monthly 2 for weekly

const IncomeGenerate = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [selectedFilter, setSelectedFilter] = useState('Monthly');
    const [totalIncome, setTotalIncome] = useState(0);
    const [income, setIncome] = useState(0);


    useEffect(() => {
        getEarnings();
    }, [])

    const getEarnings = () => {
        const cb = data => {
            const earning_total = data?.total_earning === undefined ? 0 : data?.total_earning
            setTotalIncome(earning_total);
            setIncome( data?.earning[0]?.amount ?? 0);
        }
        dispatch(ArtistMiddleware.GetEarnings({ cb, type: ConditionalData.earningFilter[selectedFilter] }))
    }


    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        const cb = data => {
            const earning_total = data?.earning[0]?.amount ?? 0 ;
            setIncome(earning_total);
        }
        dispatch(ArtistMiddleware.GetEarnings({ cb, type: ConditionalData.earningFilter[filter] }))

    }

    return (
        <View>
            <Text allowFontScaling={false} style={gstyles.sectionTitle}>{t('INCOME_GENERATE')}</Text>
            <View style={styles.incomeContainer}>
                <View style={styles.totalIncomeRow}>
                    <View>
                        <Text allowFontScaling={false} style={gstyles.incomeLabel}>{t('TOTAL_INCOME')}</Text>
                        <Text allowFontScaling={false} style={gstyles.incomeAmount}>${formatAmount(totalIncome) ?? '0.00'}</Text>
                        {/* {totalIncome && ( */}
                        <Text allowFontScaling={false} style={gstyles.incomeLabel}>{ConditionalData.earningFilter[selectedFilter] == 1 ? t('MONTHLY') : t('WEEKLY')} {t('INCOME')} ${formatAmount(income)}</Text>
                        {/* )} */}
                    </View>
                    <Image source={Images.dashboardGraph} style={styles.graphImage} />
                </View>
                <View style={styles.filterContainer}>
                    {[t('MONTHLY'), t('WEEKLY')]?.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterButton, selectedFilter === filter && styles.selectedFilter]}
                            onPress={() => handleFilterSelect(filter)}>
                            <Text allowFontScaling={false} style={[styles.filterLabel, selectedFilter === filter && styles.selectedFilterText]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default IncomeGenerate

const styles = StyleSheet.create({

    incomeContainer: {
        height: Metrix.VerticalSize(170),
        backgroundColor: Colors.blue,
        borderRadius: 10,
        paddingVertical: Metrix.VerticalSize(20),
        paddingHorizontal: Metrix.HorizontalSize(20),
    },
    graphImage: {
        width: Metrix.HorizontalSize(80),
        height: Metrix.VerticalSize(80),
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Metrix.VerticalSize(30),
    },
    filterButton: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    filterLabel: {
        color: Colors.white,
        fontFamily: fonts.RubikRegular,
        fontSize: Metrix.customFontSize(14),
    },
    selectedFilter: {
        backgroundColor: Colors.white,
    },
    selectedFilterText: {
        color: Colors.black,
    },
    totalIncomeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        width: "100%",
    },
})