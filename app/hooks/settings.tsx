import {useState, useEffect, useLayoutEffect} from 'react';
import {getData, storeData} from "../helpers/kvstore";

export default function useSettings() {
  const [settings, setSettings] = useState({});

  const addSetting = (key: string, value: string) => storeSettings({...settings, [key]: value})

  const storeSettings = (settings: any) => storeData("settings", settings)
    .then((returnSettings) => {
      setSettings(returnSettings)
    })
    .catch(console.error)

  useLayoutEffect(() => {
    getData("settings")
      .then(returnSettings => {
        if (returnSettings === null) storeSettings({});
        else setSettings(returnSettings);
      })
  });

  return [settings, addSetting];
}
