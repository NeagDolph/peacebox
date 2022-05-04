// require the
import RNFS, {DownloadFileOptions} from 'react-native-fs'
import {CDNENDPOINT} from "./constants";

export const getAudioList = async () => {
  const downloadLink = `${CDNENDPOINT}/audio-files.json`

  const toPath = RNFS.MainBundlePath + "/audio-files.json"

  const downloadOptions: DownloadFileOptions = {
    fromUrl: downloadLink,
    toFile: toPath,
    background: false,
    cacheable: false
  }

  let jsonData

  try {
    const response = await fetch(downloadLink, {
      method: "GET",
    })
    jsonData = await response.json()
  } catch (e) {
    console.warn("Error downloading audio list:", e)
  }

  if (!jsonData) {
    try {
      await RNFS.downloadFile(downloadOptions)
    } catch (e) {
      console.warn("Error downloading audio list:", e)
    }

    const audioStat = await RNFS.stat(toPath);

    try {
      if (audioStat.isFile()) {
        // if we have a file, read it
        jsonData = JSON.parse(await RNFS.readFile(toPath, 'utf8'));
      } else {
        // if file doesn't exist that means it was either deleted or was not bundled with app and cannot be downloaded
        console.warn("Could not find audio list!")
        return false
      }
    } catch (e) {
      console.error(e)
    }
  }

  return jsonData;
}
