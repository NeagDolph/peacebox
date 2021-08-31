import {getData, storeData} from "../helpers/kvstore"

export const loadBgImage = async() => {
  const bgDate = getData("bgDate")
  const bgDateCalc = Date.now()/86400000
}
