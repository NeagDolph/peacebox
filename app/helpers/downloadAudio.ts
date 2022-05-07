import RNBackgroundDownloader, {download, completeHandler} from 'react-native-background-downloader'


import RNFS from 'react-native-fs'
import {store} from "../store/store";
import {deleteTape, setDownload, setDownloaded, setProgress} from "../store/features/tapesSlice";
import {CDNENDPOINT} from "./constants";


const isDownloaded = async ({set, tape, part, localPath}) => {
  const currentState = store.getState();
  const fileExists = await RNFS.exists(`${RNFS.DocumentDirectoryPath}/${localPath}`)

  const downloading = currentState.tapes?.[set]?.[tape]?.downloads?.[part]?.downloadState

  return fileExists || downloading >= 2
}
const isDownloading = async ({set, tape, part}) => {
  const currentState = store.getState();

  const downloading = currentState.tapes?.[set]?.[tape]?.downloads?.[part]?.downloadState

  return downloading === 2
}

export const cancelDownload = async ({set, tape}) => {
  let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
  const searchString = `${set}/${tape}/`

  for (let task of lostTasks) {
    if (task.id.startsWith(searchString)) {
      task.stop();
    }
  }
}

export const deleteAudio = async ({set, tape}) => {
  const currentState = store.getState();

  const downloads = currentState.tapes?.[set]?.[tape]?.downloads

  const betterDownloads = downloads.slice(0, currentState.tapes.audioData?.[set]?.files?.[tape]?.parts?.length)

  if (betterDownloads && betterDownloads.length >= 1) {
    for (let file of downloads) {
      if (file.location.length <= 10) continue

      const fileExists = await RNFS.exists(`${RNFS.DocumentDirectoryPath}/${file.location}`)

      if (fileExists) await RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${file.location}`).catch(console.warn)
    }
  }
}

export const downloadAudioSet = async (set) => {
  for (let file of set.files) {
    await downloadAudioTape(set, file.episode)
  }
}

// export const downloadAudioTape = async (set, tape) => {
//   await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/${set.author}/${set.name}`);
//
//   const partCount = set.files[tape].parts.length
//
//   for (let partIdx = 0; partIdx < partCount; partIdx++) { //Parts in cdn start at 1
//     const fileName = `${tape + 1}_${partIdx + 1}.mp3`
//     const localPath = `${set.author}/${set.name}/${fileName}`
//
//     const alreadyDownloaded = await isDownloaded({set: set.name, tape, part: partIdx, localPath});
//     const currentlyDownloading = await isDownloading({set: set.name, tape, part: partIdx});
//
//     if (!alreadyDownloaded && !currentlyDownloading) {
//       const jobId = `${set.name}/${tape}/${partIdx}`
//
//       const downloadPath = encodeURI(`${CDNENDPOINT}/${set.author}/${set.name}/${fileName}`)
//
//       store.dispatch(setDownload({set: set.name, tape, part: partIdx, progress: 0, location: localPath, downloadState: 1}))
//
//       const task = download({
//         id: jobId,
//         url: downloadPath,
//         destination: `${RNFS.DocumentDirectoryPath}/${localPath}`,
//
//       }).begin(({expectedBytes}) => {
//         console.log(fileName, `Going to download ${expectedBytes} bytes!`)
//         store.dispatch(setDownload({set: set.name, tape, part: partIdx, progress: 1, location: localPath, downloadState: 2}))
//       }).progress(percent => {
//         console.log(fileName, `Progress at ${percent * 100}`)
//         store.dispatch(setProgress({set: set.name, tape, part: partIdx, progress: percent * 100}))
//       }).done(() => {
//         console.log(fileName, 'Download is done!')
//         store.dispatch(setDownloaded({set: set.name, tape, part: partIdx}))
//         completeHandler(jobId)
//       }).error(error => {
//         console.log('Download canceled due to error: ', error);
//         store.dispatch(deleteTape({set: set.name, tape}));
//       })
//
//       task.resume()
//     } else if (!currentlyDownloading) {
//       store.dispatch(setDownload({set: set.name, tape, part: partIdx, progress: 100, location: localPath, downloadState: 3}))
//     }
//   }
// }

export const downloadAudioTape = async (set, tape) => {
  await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/${set.author}/${set.name}`);

  const partCount = set.files[tape].parts.length

  for (let partIdx = 0; partIdx < partCount; partIdx++) { //Parts in cdn start at 1
    const fileName = `${tape + 1}_${partIdx + 1}.mp3`
    const localPath = `${set.author}/${set.name}/${fileName}`

    const alreadyDownloaded = await isDownloaded({set: set.name, tape, part: partIdx, localPath});
    const currentlyDownloading = await isDownloading({set: set.name, tape, part: partIdx});

    if (!alreadyDownloaded && !currentlyDownloading) {
      const jobId = `${set.name}/${tape}/${partIdx}`

      const downloadPath = encodeURI(`${CDNENDPOINT}/${set.author}/${set.name}/${fileName}`)

      store.dispatch(setDownload({set: set.name, tape, part: partIdx, progress: 0, location: localPath, downloadState: 1}))

      const task = download({
        id: jobId,
        url: downloadPath,
        destination: `${RNFS.DocumentDirectoryPath}/${localPath}`,

      }).begin(({expectedBytes}) => {
        console.log(fileName, `Going to download ${expectedBytes} bytes!`)
        store.dispatch(setDownload({set: set.name, tape, part: partIdx, progress: 1, location: localPath, downloadState: 2}))
      }).progress(percent => {
        console.log(fileName, `Progress at ${percent * 100}`)
        store.dispatch(setProgress({set: set.name, tape, part: partIdx, progress: percent * 100}))
      }).done(() => {
        console.log(fileName, 'Download is done!')
        store.dispatch(setDownloaded({set: set.name, tape, part: partIdx}))
        completeHandler(jobId)
      }).error(error => {
        console.log('Download canceled due to error: ', error);
        store.dispatch(deleteTape({set: set.name, tape}));
      })

      task.resume()
    } else if (!currentlyDownloading) {
      store.dispatch(setDownload({set: set.name, tape, part: partIdx, progress: 100, location: localPath, downloadState: 3}))
    }
  }
}
