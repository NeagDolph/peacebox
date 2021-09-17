import React from 'react';

import {Text, View} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import PageHeader from "../../components/header";

const PatternUse = ({route, navigation}) => {
  const {id} = route.params
  const patternData = useSelector(state => state.breathing.patterns[id]);
  const dispatch = useDispatch();

  return (
    <>
      <PageHeader
        title={patternData.name}
        inlineTitle={true}
        settingsButton={true}
        titleWhite={false}
        settingsCallback={() => navigation.push("settings", {
          page: "breathing",
          pageTitle: "Breathing Settings"
        })}
        navigation={navigation}
      />
      <Text>{patternData.id}</Text>
    </>
  );
};

export default PatternUse;
