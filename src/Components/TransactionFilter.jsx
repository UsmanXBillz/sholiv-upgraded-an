import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Icons, Images, Metrix} from '../Config';
import DropdownComponent from './DropdownComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import gstyles from '../styles';
import Button from './Button';
import {filterObject, isEndDateBeforeStartDate} from '../Config/Helper';

const paymentType = [
  {id: '1', value: 1, label: 'Subscription'},
  {id: '2', value: 2, label: 'Message'},
  {id: '3', value: 3, label: 'Live Stream'},
  {id: '4', value: 4, label: 'Bundle'},
  {id: '5', value: 5, label: 'Live Stream Gift'},
  {id: '6', value: 6, label: 'Competition'},
  {id: '7', value: 7, label: 'Post Bundle'},
  {id: '10', value: 10, label: 'Boost your profile'},
  {id: '11', value: 4, label: 'Gold Package'},
  {id: '9', value: 9, label: 'VIP Package'},
];

// 1: 'SUBSCRIPTION_RENEWAL',
// 2: 'MESSAGES_PURCHASE',
// 3: 'LIVE_STREAM_ACCESS',
// 10: 'BOOST_YOUR_PROFILE',
// 5: 'LIVE_STREAM_GIFT',
// 6: 'Competition',
// 7: 'Post Bundle',
// 4: 'Gold Package',
// 9: 'VIP Package',

const earningType = [
  {id: '1', value: 1, label: 'Subscribe to Artist'},
  {id: '2', value: 2, label: 'Live Stream'},
  {id: '3', value: 3, label: 'Live Stream Gift'},
  {id: '4', value: 4, label: 'Message'},
];

const formatDate = str => {
  return str;
};

const formatDisplayDate = dateString => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

const initialFilter = {
  payment_type: null,
  earning_type: null,
  start_date: undefined,
  end_date: undefined,
};

const TransactionFilter = ({
  isVisible,
  closeModal,
  onSave,
  clearFilter,
  filters,
  isEarning = false,
  isFan = true,
}) => {
  const {t} = useTranslation();

  const [isStartDatePicker, setIsStartDatePicker] = useState(false);
  const [isEndDatePicker, setIsEndDatePicker] = useState(false);

  const [filterState, setFilterState] = useState(initialFilter);

  useEffect(() => {
    console.log(filters);
    setFilterState(filters);
  }, [filters]);

  const onClearFilter = () => {
    clearFilter();
    onSave(initialFilter);
    setFilterState(initialFilter);
    closeModal();
  };

  const openStartDateModal = () => setIsStartDatePicker(true);
  const openEndDateModal = () => setIsEndDatePicker(true);

  const selectCategory = val => {
    setFilterState(p => ({
      ...p,
      [isEarning ? 'earning_type' : 'payment_type']: val.value,
    }));
  };

  const handleStartDateConfirm = date => {
    setFilterState(p => ({...p, start_date: formatDate(date)}));
    setIsStartDatePicker(false);
  };

  const handleEndDateConfirm = date => {
    if (isEndDateBeforeStartDate(filterState.end_date, date)) {
      return null;
    }
    setFilterState(p => ({...p, end_date: formatDate(date)}));
    setIsEndDatePicker(false);
  };

  const handleCancel = () => {
    setIsStartDatePicker(false);
    setIsEndDatePicker(false);
  };

  const handleOnSave = () => {
    const vals = filterObject(filterState);
    onSave(vals);
    closeModal();
  };

  return (
    <Modal
      style={styles.modal}
      visible={isVisible}
      animationType="slide"
      transparent>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.headerContainer}>
            <Text allowFontScaling={false} style={styles.heading}>
              Filter {!isFan && `${isEarning ? '(Earning)' : '(Transactions)'}`}
            </Text>
            <Icons.Entypo
              name="cross"
              color="white"
              onPress={closeModal}
              size={Metrix.FontLarge}
            />
          </View>
          <View style={styles.filterContainer}>
            <DropdownComponent
              //   label={t('TYPE')}
              data={isEarning ? earningType : paymentType}
              onChange={item => selectCategory(item)}
              selectedValue={
                filterState?.payment_type || filterState.earning_type
              }
              placeholder={`Select ${
                isEarning ? 'earning' : 'transaction'
              } type`}
              style={{borderWidth: 1, borderColor: Colors.blue}}
            />
            <TouchableOpacity
              onPress={openStartDateModal}
              style={styles.dateRow}>
              <Text allowFontScaling={false} style={gstyles.labelStyle}>Start Date:</Text>
              <Text allowFontScaling={false} style={styles.dateTextStyle}>
                {!filterState?.start_date
                  ? 'Select Start Date'
                  : formatDisplayDate(filterState?.start_date)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openEndDateModal} style={styles.dateRow}>
              <Text allowFontScaling={false} style={gstyles.labelStyle}>End Date:</Text>
              <Text allowFontScaling={false} style={styles.dateTextStyle}>
                {!filterState?.end_date
                  ? 'Select End Date'
                  : formatDisplayDate(filterState?.end_date)}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <Button
              buttonText="Clear"
              btnStyle={{width: '45%'}}
              onPress={onClearFilter}
            />
            <Button
              buttonText="Save"
              btnStyle={{width: '45%'}}
              onPress={handleOnSave}
            />
          </View>
        </View>
      </View>
      {/* Modals */}
      <DateTimePickerModal
        key={'start_date'}
        isVisible={isStartDatePicker}
        mode="date"
        date={filterState.start_date || new Date()}
        onConfirm={handleStartDateConfirm}
        onCancel={handleCancel}
      />
      <DateTimePickerModal
        key={'end_date'}
        isVisible={isEndDatePicker}
        date={filterState.end_date || new Date()}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={handleCancel}
        minimumDate={filterState.start_date || new Date()}
        disabled={!filterState.start_date}
        maximumDate={new Date()}
      />
    </Modal>
  );
};

export default TransactionFilter;

const styles = StyleSheet.create({
  modal: {height: '100%', width: '100%'},
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    height: '40%',
    width: '90%',
    backgroundColor: Colors.carbonBlack,
    borderRadius: 10,
    padding: Metrix.HorizontalSize(10),
    justifyContent: 'center',
  },
  heading: {
    color: 'white',
    fontSize: Metrix.FontLarge,
    fontWeight: 'semibold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterContainer: {
    gap: 10,
    flexDirection: 'column',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: Metrix.VerticalSize(40),
  },
  dateTextStyle: {
    color: 'white',
    fontWeight: 'semibold',
    fontSize: Metrix.FontSmall,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
});
