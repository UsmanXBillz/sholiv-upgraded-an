import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Metrix} from '../Config';
import Button from './Button';

const DeleteModal = props => {
  const {isVisible, closeModal, onDelete, heading, detail} = props;
  return (
    <Modal transparent visible={isVisible}>
      <View style={styles.modal}>
        <View style={styles.container}>
          <Text allowFontScaling={false} style={styles.heading}>{heading}</Text>
          <Text allowFontScaling={false} style={styles.description}>{detail}</Text>
          <View style={styles.btnContainer}>
            <Button
              buttonText="Cancel"
              btnStyle={{width: '45%', backgroundColor: 'white'}}
              textStyle={{color: Colors.blue}}
              onPress={closeModal}
            />
            <Button
              buttonText="Ok"
              btnStyle={{width: '45%'}}
              onPress={onDelete}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  modal: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  container: {
    backgroundColor: Colors.black,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    // height: '30%',
    gap: 15,
  },
  heading: {
    color: Colors.blue,
    fontSize: Metrix.FontMedium,
    textAlign: 'center',
  },
  description: {
    color: Colors.white,
    fontSize: Metrix.FontSmall,
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
