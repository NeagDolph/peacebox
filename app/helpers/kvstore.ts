import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    let storeValue = value

    if (typeof value !== "string") {
      storeValue = JSON.stringify(value)
    }

    await AsyncStorage.setItem(key, storeValue)
    return value
  } catch (e) {
    return Error(e)
  }
}

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    if (e.name === "SyntaxError") {
      return ""
      return await AsyncStorage.getItem(key)
    } else
      return Error(e)
  }
}

