import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Metrix} from '../Config';
import { fonts, translateWithOpenAI } from '../Config/Helper';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';



const TranslationComponent = ({item, isOutgoing}) => {
    const [translation,setTranslation] = useState('');
    const selectedLanguage = useSelector(state => state?.AuthReducer?.language);
    const {t} = useTranslation()

  const handleTranslation = async (text) => {
    if(!translation){
        const translatedText = await translateWithOpenAI(text, selectedLanguage); // Call the translate function
        if(translatedText){
            setTranslation(translatedText);
        }
    }else{
        setTranslation('');
    }
  };


  return (
    <View>
        <Text allowFontScaling={false}
            style={[
            styles.seeTranslation,
            {color: isOutgoing ? Colors.white : Colors.black},
            ]}>
            {translation}
        </Text>
        <TouchableOpacity
        onPress={() => handleTranslation(item?.text)}>
        <Text allowFontScaling={false}
            style={[
            styles.seeTranslation,
            {color: isOutgoing ? Colors.white : Colors.black},
            ]}>
            {!translation ? 'SEE TRANSLATION' : 'HIDE TRANSLATION'}
        </Text>
        </TouchableOpacity>
    </View>

  );

};

export default TranslationComponent;

const styles = StyleSheet.create({
  seeTranslation: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratRegular,
    paddingVertical: 2,
  },
});
