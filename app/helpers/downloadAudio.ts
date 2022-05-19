import RNBackgroundDownloader, { completeHandler, download } from "react-native-background-downloader";


import RNFS from "react-native-fs";
import { store } from "../store/store";
import {
  deleteTape,
  queueDownload,
  removeFromQueue,
  setDownload,
  setDownloaded,
  setProgress,
  shiftDownload
} from "../store/features/tapesSlice";
import { CDNENDPOINT } from "./constants";


const isDownloaded = async ({ set, tape, part, localPath }) => {
  const currentState = store.getState();
  const fileExists = await RNFS.exists(`${RNBackgroundDownloader.directories.documents}/${localPath}`);

  const downloading = currentState.tapes?.[set]?.[tape]?.downloads?.[part]?.downloadState;

  return fileExists || downloading >= 2;
};
const isDownloading = async ({ set, tape, part }) => {
  const currentState = store.getState();

  const downloading = currentState.tapes?.[set]?.[tape]?.downloads?.[part]?.downloadState;

  return downloading === 2;
};

export const cancelDownload = async ({ set, tape }) => {
  store.dispatch(removeFromQueue({ set, tape }));
  let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
  const searchString = `${set}/${tape}/`;

  for (let task of lostTasks) {
    if (task.id.startsWith(searchString)) {
      task.stop();
    }
  }
};

export const deleteAudio = async ({ set, tape }) => {
  const currentState = store.getState();

  const downloads = currentState.tapes?.[set]?.[tape]?.downloads;

  const betterDownloads = downloads.slice(0, currentState.tapes.audioData?.[set]?.files?.[tape]?.parts?.length);

  if (betterDownloads && betterDownloads.length >= 1) {
    for (let file of downloads) {
      if (file.location.length <= 10) continue;

      const fileExists = await RNFS.exists(`${RNBackgroundDownloader.directories.documents}/${file.location}`);

      if (fileExists) await RNFS.unlink(`${RNBackgroundDownloader.directories.documents}/${file.location}`).catch(console.warn);
    }
  }
};

export const downloadAudioSet = async (set) => {
  const state = store.getState();

  for (let file of set.files) {

    // await downloadAudioTapeWrapper(set, file.episode, taskReturn);

    const currentDownloads = state.tapes[set.name][file.episode].downloads;
    const partCount = set.files[file.episode].parts.length;


    if (currentDownloads?.slice(0, partCount)?.some(el => el?.downloadState === 0)) {
      for (let partIdx in file.parts) {
        await store.dispatch(setDownload({
          set: set.name,
          tape: file.episode,
          part: partIdx,
          progress: 0,
          location: "",
          downloadState: 1
        }));
      }

      await store.dispatch(queueDownload({ set: set, tape: file.episode }));
    }
  }

  processDownloadQ();
};


export const processDownloadQ = () => {

  RNBackgroundDownloader.checkForExistingDownloads()
    .then(downloadsList => {
      if (downloadsList >= 2) return;

      const state = store.getState();

      const currentQTasks = state.tapes.queue.slice(0, 2); // Get first two queue items

      if (currentQTasks.length <= 0) return;

      store.dispatch(shiftDownload(2)); // remove first two queue items from queue

      currentQTasks.forEach(qTask => {
        const { set, tape, part } = qTask;

        downloadAudioTape(set, tape, part).then(tasks => {
          let taskList = Array(tasks.length).fill(false);

          for (let idx in tasks) {
            const { task, partIdx } = tasks[idx];

            task.done(() => {
              store.dispatch(setDownloaded({ set: set.name, tape, part: partIdx }));
              completeHandler(task.id);
              taskList[idx] = true;
              if (taskList.every(val => val)) processDownloadQ();
            });
          }
        });

      });
    });
};

export const downloadAudioTape = async (set, tape, part = undefined) => {
  await RNFS.mkdir(`${RNBackgroundDownloader.directories.documents}/${set.author}/${set.name}`);

  const partStart = part ?? 0;
  const partCount = part ? partStart + 1 : set.files[tape].parts.length;

  const tasks = [];

  for (let partIdx = partStart; partIdx < partCount; partIdx++) { //Parts in cdn start at 1
    const fileName = `${tape + 1}_${partIdx + 1}.mp3`;
    const localPath = `${set.author}/${set.name}/${fileName}`;

    const alreadyDownloaded = await isDownloaded({ set: set.name, tape, part: partIdx, localPath });
    const currentlyDownloading = await isDownloading({ set: set.name, tape, part: partIdx });


    if (!alreadyDownloaded && !currentlyDownloading) {
      const jobId = `${set.name}/${tape}/${partIdx}`;

      const downloadPath = encodeURI(`${CDNENDPOINT}/${set.author}/${set.name}/${fileName}`);

      store.dispatch(setDownload({
        set: set.name,
        tape,
        part: partIdx,
        progress: 0,
        location: localPath,
        downloadState: 1
      }));

      const task = download({
        id: jobId,
        url: downloadPath,
        destination: `${RNBackgroundDownloader.directories.documents}/${localPath}`
      }).begin(({ expectedBytes }) => {
        console.log(fileName, `Going to download ${expectedBytes} bytes!`);
        store.dispatch(setDownload({
          set: set.name,
          tape,
          part: partIdx,
          progress: 1,
          location: localPath,
          downloadState: 2
        }));
      }).progress(percent => {
        // console.log(fileName, `Progress at ${percent * 100}`);
        store.dispatch(setProgress({ set: set.name, tape, part: partIdx, progress: percent * 100 }));
      }).error(error => {
        console.log("Download canceled due to error: ", error);
        store.dispatch(deleteTape({ set: set.name, tape }));
        completeHandler(task.id);
      });

      task.resume();

      tasks.push({ task, partIdx });

    } else if (!currentlyDownloading) {
      store.dispatch(setDownload({
        set: set.name,
        tape,
        part: partIdx,
        progress: 100,
        location: localPath,
        downloadState: 3
      }));
    }
  }

  return tasks;
};
