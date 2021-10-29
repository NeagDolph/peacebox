import React from 'react';

import {ScrollView, StyleSheet, Text, View} from 'react-native';
import PageHeader from "../../components/header";
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
        <View style={styles.creditContainer}>
          <Text style={styles.creditTitle}>{title}</Text>
          {content.map(text => <Text style={styles.credit}>{text}</Text>)}
        </View>
      )
    })

  }

  return (
    <>
      <PageHeader title="About" inlineTitle={true} settingsButton={false}/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>PeaceBox</Text>
        <Text style={styles.subtitle}>Toolbox for your Brain</Text>
        <Text style={styles.subtitle}>Version 1.0</Text>
        <View style={styles.credits}>
          <Text style={styles.sectionTitle}>Credits</Text>
          {renderCredits()}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  credits: {
    paddingVertical: 20
  },
  sectionTitle: {
    fontSize: 30,
    color: "black",
    fontFamily: "Futura",
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 5,
  },
  creditContainer: {
    marginVertical: 8
  },
  creditTitle: {
    fontSize: 15,
    color: colors.primary
  },
  credit: {
    fontSize: 20,
  },

  container: {
    paddingHorizontal: 40,
    paddingVertical: 25,
    // justifyContent: "center"
  },
  title: {
    fontSize: 50,
    color: "black",
    fontFamily: "Futura",
    // textAlign: "center",
    fontWeight: "900"
  },
  subtitle: {
    fontSize: 20,
    color: colors.primary,
    fontFamily: "Avenir",
    // textAlign: "center"
  }
})

export default AboutPage;
