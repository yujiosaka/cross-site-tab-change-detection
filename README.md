# cross-site-tab-change-detection

Demo for cross site tab change detection

![demo](https://user-images.githubusercontent.com/2261067/190013795-bb5fbbb8-e07e-4387-ac9d-834db1bc0ad9.gif)

## Result

- You can distinguish tab switching on the same site when a script is injected on all the tabs of the site
- You cannot distinguish whether the tab became activated or switched from another site

## Instruction

1. Start server

```sh
$ git clone git@github.com:yujiosaka/cross-site-tab-change-detection.git
$ npm install
$ npm run build
$ npm start
```

2. Open http://localhost:8080 in multiple tabs

## Comparison

|                      | **Broadcast Channel** | **Shared Worker** | **LocalStorage** | **WebSocket (SocketIO)** |
| :------------------: | :-------------------: | :---------------: | :--------------: | :----------------------: |
|   Code simplicity    |           ○           |         △         |        ○         |            ×             |
|     Server load      |           ○           |         ○         |        ○         |            △             |
|     Client load      |           ○           |         ○         |      △ [^1]      |            ○             |
|    Responsiveness    |        △ [^2]         |         ○         |        ○         |          × [^3]          |
| Cross origin support |           ×           |         ×         |        ×         |            ○             |
|        Chrome        |          54           |         4         |        4         |          10.13           |
|         Edge         |         <=79          |        79         |        12        |            ○             |
|       Firefox        |          38           |        29         |       3.5        |          10.11           |
|  Internet Explorer   |           ×           |         ×         |        8         |            7             |
|        Opera         |          41           |       10.6        |       10.5       |            ○             |
|        Safari        |           ×           |         ×         |        4         |          10.13           |

- Choose **Broadcast Channel** only when code simplicity is your primary concern
- Choose **Shared Worker** when
  1. You don't need to support Internet Explorer
  2. You don't need to support cross origins
  3. You don't want to place loads on both client and server side
- Choose **LocalStorage** when
  1. You need to support Internet Explorer
  2. You don't need to support cross origins
  3. You don't want to place loads on server side
- Choose **WebSocket** when
  1. You need to support Internet Explorer
  2. You need to support cross origins
  3. You don't want to place loads on client side

[^1]: **LocalStorage** writes data to the permanent storage of the browser for detecting tab switches
[^2]: **Broadcast Channel** has a short delay for receiving a message from antoher tab
[^3]: **WebSocket** has a medium to long delay depending on the network bandwidth for receiving a message from another tab

## Resources

- [Broadcast Channel](https://developer.mozilla.org/docs/Web/API/Broadcast_Channel_API)
- [SharedWorker](https://developer.mozilla.org/docs/Web/API/SharedWorker)
- [LocalStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage)
- [SocketIO](https://socket.io/docs/server-api/)
