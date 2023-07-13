// require the
import RNFS, { DownloadFileOptions } from "react-native-fs";
import { CDN_ENDPOINT } from "./constants";

const audioJson = require("../assets/audio-files.json");

export const getAudioList = async () => {
  const downloadLink = `${CDN_ENDPOINT}/audio-files.json`;

  const toPath = "../assets/audio-files.json";

  const downloadOptions: DownloadFileOptions = {
    fromUrl: downloadLink,
    toFile: toPath,
    background: false,
    cacheable: false,
    readTimeout: 1000
  }

  let jsonData

  try {
    const response = await fetch(downloadLink, {
      method: "GET",
    })
    jsonData = await response.json()
  } catch (e) {
    console.log("Error downloading audio list:", e)

    if (e.message.includes("timed out")) {
      return audioJson
    }
  }

  if (!jsonData) {
    try {
      const download = RNFS.downloadFile(downloadOptions)

      const downloadPromise = await download.promise
    } catch (e) {

      console.log("Error downloading audio list:", e.message)
      if (e.message.includes("timed out")) {
        return audioJson
      }
    }


    try {
      const audioStat = await RNFS.stat(toPath);

      if (audioStat.isFile()) {
        // if we have a file, read it
        jsonData = JSON.parse(await RNFS.readFile(require("../assets/audio-files.json"), 'utf8'));

        return jsonData
      } else {
        // if file doesn't exist that means it was either deleted or was not bundled with app and cannot be downloaded
        console.log("Could not find audio list!")

        return audioJson;
        // return false
      }
    } catch (e) {
      console.log("Error loading audio: ", e);

      return audioJson;
    }
  }

  const returnData = jsonData ?? audioJson;

  return returnData;
}
