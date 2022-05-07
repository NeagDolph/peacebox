import React from 'react';

import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PageHeader from "../../components/header";
const packageJson = require('../../../package.json');
import {colors} from "../../config/colors";

const credits = [
  "Design and Development: Neil Agrawal",
  "Icons and Images: VectorsLab, PK.: unsplash.com: loading.io",
  "Voiceovers: Michael Thigpen",
]


const AboutPage = ({navigation}) => {

  const renderCredits = () => {
    return credits.map(credit => {
      const title = credit.split(": ")[0]
      const content = credit.split(": ").slice(1);

      return (
        <View style={styles.infoContainer} key={title}>
          <Text style={styles.creditTitle}>{title}</Text>
          {content.map(text => <Text style={styles.credit} key={text}>{text}</Text>)}
        </View>
      )
    })

  }

  return (
    <>
      <PageHeader title="About" inlineTitle={true} settingsButton={false}/>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <Text style={styles.title}>PeaceBox</Text>
        <Text style={styles.subtitle}>Version {packageJson.version}</Text>
        <View style={styles.credits}>
          <Text style={styles.sectionTitle}>Credits</Text>
          {renderCredits()}
        </View>
        <View style={styles.contact}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.sectionSubtitle}>Don't hesitate to contact us with any suggestions or concerns. We're looking for as much feedback as we can get!</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.creditTitle}>Email</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:contact@peacebox.app`).catch(console.log)}>
              <Text style={[styles.credit, {color: "#0074cc"}]}>contact@peacebox.app</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  contact: {
    paddingVertical: 12
  },
  credits: {
    paddingVertical: 12
  },
  sectionTitle: {
    fontSize: 30,
    color: colors.black,
    fontFamily: "Futura",
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.text,
    fontFamily: "Avenir",
    fontWeight: "500",
    marginTop: 5,
    marginBottom: 5,
  },
  infoContainer: {
    marginVertical: 8
  },
  creditTitle: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: "Avenir",

    fontWeight: "500",
  },
  credit: {
    fontSize: 18,
    fontFamily: "Helvetica",
    color: colors.text
  },

  container: {
    paddingHorizontal: 40,
    paddingVertical: 25,
    // justifyContent: "center"
  },
  title: {
    fontSize: 55,
    color: colors.black,
    fontFamily: "Futura",
    // textAlign: "center",
    fontWeight: "900"
  },
  subtitle: {
    fontSize: 22,
    color: colors.primary,
    fontFamily: "Avenir",
    // textAlign: "center"
  }
})

export default AboutPage;
