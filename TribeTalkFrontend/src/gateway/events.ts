// // gateway/events.ts

// import { socketGateway } from "./socket"
// import { store } from "../app/store"
// // import { setServers } from "../features/servers/server.slice"
// // import { setChannelsForServer } from "../features/channels/channel.slice"
// import {
//   setMessagesForChannel,
//   addMessage,
//   editMessage,
//   deleteMessage
// } from "../features/messages/message.slice"


// /**
//  * Registers all socket → redux bindings.
//  * This should be called ONCE during app startup.
//  */
// // export function registerSocketEvents() {
// //   // Server list received from backend
// //   socketGateway.onServers(servers => {
// //     store.dispatch(setServers(servers))
// //   })

// //   // Channel list for a specific server
// //   socketGateway.onChannels(({ serverId, channels }) => {
// //     store.dispatch(setChannelsForServer({ serverId, channels }))
// //   })
// // }


// export function registerMessageEvents() {
//   socketGateway.onMessage(message => {
//     store.dispatch(addMessage({ channelId: message.channelId, message }))
//   })

//   socketGateway.onMessageEdited((message) => {
//     store.dispatch(editMessage({ channelId: message.channelId, message }))
//   })

//   socketGateway.onMessageDeleted(({ channelId, messageId }) => {
//     store.dispatch(deleteMessage({ channelId, messageId }))
//   })

//   // Listen for bulk messages for a channel
//   socketGateway.onMessages(({ channelId, messages }) => {
//     store.dispatch(setMessagesForChannel({ channelId, messages }))
//   })

// }
