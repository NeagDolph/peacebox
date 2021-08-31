import {useState, useEffect, useRef} from 'react';
import {getData, storeData} from "../helpers/kvstore";

export default function useStat(key) {
  const [statVal, setStatVal] = useState();
  const statKey = useRef(key).current


  const setStat = async (value: any) => await storeData(statKey, value)


  useEffect(() => {
    getData(statKey)
      .then(returnStats => setStatVal(returnStats))
      .catch(console.error)
  });

  return [statVal, setStat];
}
