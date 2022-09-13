import { io } from "socket.io-client";

const EVENT_NAME = "hidden";
const CHANNEL_NAME = "channel";
const WORKER_LOCATION = "worker.js";
const TAB_SWITCHING_DURATION = 200;
const BROADCAST_DELAY = 20;
const WEBSOCKET_DELAY = 50;
const PAGE_ID = Math.floor(Math.random() * 10000);

const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  if (window.BroadcastChannel) {
    const channel = new window.BroadcastChannel(CHANNEL_NAME);
    let timestamp: number;

    channel.onmessage = (e) => {
      if (e.data.name !== EVENT_NAME) return;
      if (e.data.pageId === PAGE_ID) return;
      timestamp = e.data.timestamp;
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        channel.postMessage(message());
      } else {
        setTimeout(() => {
          const isFromSameSite =
            !!timestamp && Date.now() - timestamp < TAB_SWITCHING_DURATION;
          select("channel", isFromSameSite);
        }, BROADCAST_DELAY);
      }
    });
  }

  if (window.SharedWorker) {
    const worker = new window.SharedWorker(WORKER_LOCATION);
    let timestamp: number;

    worker.port.onmessage = (e) => {
      if (e.data.name !== EVENT_NAME) return;
      if (e.data.pageId === PAGE_ID) return;

      timestamp = e.data.timestamp;
    };

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        worker.port.postMessage(message());
      } else {
        const isFromSameSite =
          !!timestamp && Date.now() - timestamp < TAB_SWITCHING_DURATION;
        select("worker", isFromSameSite);
      }
    });
  }

  if (window.localStorage) {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        window.localStorage.setItem(EVENT_NAME, JSON.stringify(message()));
      } else {
        const data = JSON.parse(
          window.localStorage.getItem(EVENT_NAME) || "{}"
        );
        const isFromSameSite =
          !!data.timestamp &&
          data.pageId !== PAGE_ID &&
          Date.now() - data.timestamp < TAB_SWITCHING_DURATION;
        select("storage", isFromSameSite);
      }
    });
  }

  socket.on("connect", () => {
    let timestamp: number;

    socket.on(EVENT_NAME, (data) => {
      if (data.pageId === PAGE_ID) return;

      timestamp = data.timestamp;
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        socket.emit(EVENT_NAME, message());
      } else {
        setTimeout(() => {
          const isFromSameSite =
            !!timestamp && Date.now() - timestamp < TAB_SWITCHING_DURATION;
          select("websocket", isFromSameSite);
        }, WEBSOCKET_DELAY);
      }
    });
  });
});

function message() {
  return {
    name: EVENT_NAME,
    pageId: PAGE_ID,
    timestamp: Date.now(),
  };
}

function select(prefix: string, isFromSameSite: boolean) {
  const fromSameSite: HTMLInputElement = document.querySelector(
    `#${prefix}-from-same-site`
  )!;
  const notFromSameSite: HTMLInputElement = document.querySelector(
    `#${prefix}-not-from-same-site`
  )!;
  fromSameSite.checked = isFromSameSite;
  notFromSameSite.checked = !isFromSameSite;
}
