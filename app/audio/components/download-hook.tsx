import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

function useAudioDownloader() {

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    return () => {

    };
  });

  return ;
}
