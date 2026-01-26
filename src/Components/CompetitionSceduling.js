import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Colors, Metrix} from '../Config';
import {fonts} from '../Config/Helper';

const CompetitionScheduling = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) => {
  const {t} = useTranslation();

  const [isScheduled, setIsScheduled] = useState(true);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const toggleScheduled = () => {
    setIsScheduled(!isScheduled);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const handleCancel = () => {
    setDatePickerVisible(false);
    setTimePickerVisible(false);
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const handleDateConfirm = date => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  // Handle Time Selection
  const handleTimeConfirm = time => {
    setSelectedTime(time);
    setTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Scheduled Checkbox (Pre-selected) */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          title="Scheduled"
          checked={isScheduled}
          onPress={toggleScheduled}
          containerStyle={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: 0,
          }}
          textStyle={{color: Colors.white}}
        />
        <Text allowFontScaling={false} style={styles.selected}>{t('SCHEDULE')}</Text>

        <View style={styles.scheduleContainer}>
          <TouchableOpacity onPress={showDatePicker} style={styles.button}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              {selectedDate
                ? `Date: ${selectedDate.toLocaleDateString()}`
                : 'Select Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={showTimePicker} style={styles.button}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              {selectedTime
                ? `Time: ${selectedTime.toLocaleTimeString()}`
                : 'Select Time'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Time Picker Modals */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleCancel}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Metrix.VerticalSize(20),
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  button: {
    marginBottom: Metrix.VerticalSize(12),
    paddingVertical: Metrix.VerticalSize(6),
    paddingHorizontal: 20,
    backgroundColor: Colors.blue,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: fonts.Regular,
    fontSize: Metrix.customFontSize(16),
    color: Colors.white,
  },
});

export default CompetitionScheduling;
