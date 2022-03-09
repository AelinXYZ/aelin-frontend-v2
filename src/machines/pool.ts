import { assign, /* interpret, */ createMachine } from 'xstate'

export interface XStateWeb3ReactContext {
  deltme: any
}

// export enum Event {
//   PROVIDER = "PROVIDER",
//   ERROR = "ERROR",
//   CONNECT = "CONNECT",
//   ON_WALLET_UPDATED = "ON_WALLET_UPDATED",
//   DISCONNECT = "DISCONNECT",
// }

// type ProviderEvent = { type: Event.PROVIDER; payload: { provider: any } };
// type ErrorEvent = { type: Event.ERROR };
// type ConnectEvent = { type: Event.CONNECT };
// type OnWalletUpdatedEvent = { type: Event.ON_WALLET_UPDATED };
// type DisconnectEvent = { type: Event.DISCONNECT };

export const xStateWeb3Model =
  /** @xstate-layout N4IgpgJg5mDOIC5QHcwCMDMB1AhgGzzABcBhAewDsKwBjIgS0oDoAhAJzOVjDYEkL6RAMSJQABzKxBjCqJAAPRAFoArAEYA7Ew0YATAA4M+gGz79GlfpUAaEAE9lxlQAYmagwBY1ATg-ONxt4YAL7BtqiYuATE5FS0DMyx1HT0FFBCAAoASgDyAGq8ACIAollyElIJskgKyj4YTN5W5obq5pYetg4ISmrGWioaGt7eGiZN+t6DoeHo2PiEpJTJVUxJ8anppbllNRXSlHKKCBjOKkzOumoYPqPXzqZdyroeutoqphhfH2rOvhozEARebRJZxFLMDIcABu9AgPHWdEgTBwYjEiIYaREe0kB2qoGOvSsTBUGGMuheujJVg0uieCDUZgu5j8tN8Hm8ag8HkBwKiiwxMiYULIsPhbAxyNRYgAcmQwStIEJKPziABVMQQHBEMDlXFVI7KV7eNxDZy-U5nU50+yIYZMTxqJ0jUwWaZhIFzVUKjaQmFwhHLeJStGSiDKijejVanV6yoyQ0IIIXMkaP5NNOk3TGen24z1fzXAw3YzGXlehYxIMQijC-3isMo0PVnXh4rQsAUIgAAgwcbxiY8xO8V28pn0zm52Ye9M0DR0fQeRg8-X85cilZ9NbrooDEpbSsKvAAyiQcjKZcUSAAVfsGmrHDC0km3EaU8nmzq2hAeB1nFzDOmZJDmWHp8pugrMLg0hpAAYmQ+7glUQhnheV63ji8aHA+iD6G8KhjmcpgfC8GAqF+3RKE+bzkiYeFFsYNwvKEHoUGQ8LwDU4GgpBtbsJw3B8AIRB3gmOE9J8jRNB4GDctaKjkfSqhGG4xYEYEagfBY64ggKLZCoKaSidhBJ1M+ZgrppHwTr4jJKda2g+AEXz6EORikjp3q8TuYqBkhIbovpRmYQO4m9DoTB+GOaZkk+9H0hOjmyYYHJ6MYzhfJ5EH6X6u4NgeEBNrK8phsZ+K1D0HguI0Bhpq8vz6PcGj0nov4uORKhUoxVkhGBFY8TltYir5iGKoV0qlSF96mQghhMLJZFPq6+a+Dm366IMJLmkMK6dfm1xZQNSFCsNe6TeI+piTNSgeBov4juYk5XM4jWnM137GA6rmaVMk4jv0nKHXpx1QTgMFQPBo2+uV+zTRVXxqEwgQySuY5BL4pJKTJJqkmmniySukw8n1G5HSsQqpLARALN6ZWJko-QOrdhgWmRhgZUpjH6PNfiaLoDzmEMAIk7pVYgzDl0mRVShploIyuQT8mKd+MtUqprn8-+f29aEQA */
  createMachine(
    {
      schema: {
        context: {} as XStateWeb3ReactContext,
        // events: {} ,
      },
      id: 'web3WalletConnection',
      initial: 'BrowserInit',
      states: {
        BrowserInit: {
          always: [
            {
              cond: 'noWeb3Detected',
              target: '#web3WalletConnection.installWallet',
            },
            {
              cond: 'storedConnection',
              target: '#web3WalletConnection.Connecting',
            },
            {
              target: '#web3WalletConnection.WaitingForConnection',
            },
          ],
        },
        Connecting: {
          //   on: {
          //     [Event.PROVIDER]: {
          //       actions: "addProviderToContext",
          //       target: "#web3WalletConnection.ProviderConnected",
          //     },
          //     [Event.ERROR]: {
          //       target: "#web3WalletConnection.WaitingForConnection",
          //     },
          //   },
        },
        ProviderConnected: {
          initial: 'appConnecting',
          states: {
            appConnecting: {
              always: [
                {
                  cond: 'accountIsReady',
                  target: '#web3WalletConnection.ProviderConnected.appConnected',
                },
                {
                  target: '#web3WalletConnection.ProviderConnected.appNotConnected',
                },
              ],
            },
            appNotConnected: {
              //   on: {
              //     [Event.ON_WALLET_UPDATED]: {
              //       target: "#web3WalletConnection.ProviderConnected.appConnecting",
              //     },
              //   },
            },
            appConnected: {
              //   on: {
              //     [Event.ON_WALLET_UPDATED]: {
              //       target: "#web3WalletConnection.ProviderConnected.appConnecting",
              //     },
              //   },
            },
          },
          on: {
            // [Event.DISCONNECT]: {
            //   target: "#web3WalletConnection.WaitingForConnection",
            // },
          },
        },
        WaitingForConnection: {
          //   on: {
          //     [Event.CONNECT]: {
          //       target: '#web3WalletConnection.Connecting',
          //     },
          //   },
        },
        installWallet: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        // addProviderToContext: assign({
        //   provider: (_context, event: Pick<ProviderEvent, "payload">) => event.payload.provider,
        // }),
      },
      guards: {
        // noWeb3Detected: () => {
        //   return typeof window === "undefined" || window.ethereum === "undefined";
        // },
        // storedConnection: (context, event) => {
        //   return false;
        //   // check if there is a stored connection
        // },
        // accountIsReady: (context, event) => {
        //   return true;
        // },
      },
    },
  )
