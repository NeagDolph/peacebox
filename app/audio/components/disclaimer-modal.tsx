import * as React from 'react';
import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';
import {Pressable, StyleSheet, View} from "react-native";
import {colors} from "../../config/colors";
import PropTypes from "prop-types";
import IconIonicons from "react-native-vector-icons/Ionicons";

const DisclaimerModal = (props) => {
  const hideModal = () => props.setDisclaimerVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
    <Provider>
      <Portal>
        <Modal visible={props.disclaimerVisible} onDismiss={hideModal} contentContainerStyle={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            I have made many attempts to contact the original creator of these tapes (Richard L. Johnson) and the
            publisher (GATEWAYS MIND TOOLS, INC.) but have been unable to contact Richard L. Johnson, Gateways, or any entity
            associated with The Biogram System or related healing programs.
            {"\n\n"}
            After finding and utilizing these tapes for great personal benefit, I feel it is my duty to allow
            as many people as possible to benefit from the power of The Biogram System. I do not, nor will I ever
            receive any monetary gain from the distribution of The Biogram System from now until the indefinite future.
            {"\n\n"}
            If you own the copyright over these audio tapes and would like to request removal, please contact me at
            contact@peacebox.app and I would be happy to comply.
          </Text>
          <Pressable style={styles.exitButton} onPress={hideModal} hitSlop={20}>
            <IconIonicons name="close-circle-outline" size={28} color={colors.primary}/>
          </Pressable>
        </Modal>
      </Portal>
    </Provider>
  );
};

DisclaimerModal.propTypes = {
  disclaimerVisible: PropTypes.bool,
  setDisclaimerVisible: PropTypes.func
}

const styles = StyleSheet.create({
  exitButton: {
    position: "absolute",
    top: 18,
    right: 15
  },
  disclaimerText: {
    fontFamily: "Avenir",
    color: colors.text,
    fontSize: 15
  },
  disclaimer: {
    backgroundColor: colors.background2,
    padding: 20,
    paddingBottom: 30,
    margin: 10,
    borderRadius: 8,
  },
  disclaimerTitle: {
    paddingBottom: 15,
    fontSize: 20,
    fontFamily: "Avenir",
    color: colors.primary
  }
})

export default DisclaimerModal;
