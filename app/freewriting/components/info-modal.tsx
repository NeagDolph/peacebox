import * as React from 'react';
import {useRef, useState} from 'react';
import {Modal, Portal, Text} from 'react-native-paper';
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";


const modalContentWidth: number = Dimensions.get("window").width - 100

const InfoModal = (props) => {
  const {modalVisible, setModalVisible} = props;
  const [modalPage, setModalPage] = useState(0);

  const hideModal = () => {
    setModalVisible(false);
  }

  return (
    <Portal>
      <Modal propagateSwipe={true} visible={modalVisible} onDismiss={hideModal}
             contentContainerStyle={styles.container}>
        <ScrollView
          pinchGestureEnabled={false}
          bounces={false}
          horizontal={true}
          snapToInterval={modalContentWidth}
          pagingEnabled={true}
          // centerContent={true}
          disableScrollViewPanResponder={true}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
        >
          <View style={styles.modalPage}>
            <Text>hi</Text>
          </View>
          <View style={styles.modalPage}>
            <Text>hwllo</Text>
          </View>
          <View style={styles.modalPage}>
            <Text>heep</Text>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 10,
    top: -50,
    height: 200,
  },
  modalPage: {
    flex: 1,
    justifyContent: "center",
    width: modalContentWidth,
    alignItems: "center",
    height: "100%"


  }
})

export default InfoModal;
