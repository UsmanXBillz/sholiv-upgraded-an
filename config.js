// Disclaimer: Do not store your app key and secret in your app in production. Use a server to generate tokens instead.
// These are used to generate JWTs.
// THIS IS NOT A SAFE OPERATION TO DO IN YOUR APP IN PRODUCTION.
// JWTs should be provided by a backend server as they require a secret
// WHICH IS NOT SAFE TO STORE ON DEVICE!

export const ZOOM_APP_KEY = "KC2ydPm575gAYPq9uVyvWtOUSNug94Q1cb2Q";
export const ZOOM_APP_SECRET = "E0mZgcqp8w13LejqfMRlH5TZQVujBK9Z0mbl";

export const configuration = {
  sessionName: "live",
  roleType: "1",
  sessionPassword: "",
  displayName: "live",
  sessionIdleTimeoutMins: 60,
  chat: {
    isEnabled: true,  // Enable chat
    isPrivateChatEnabled: true,  // Enable private chat if needed
  },
  "session_name": "Session 2",
  "settings": {
    "auto_recording": "cloud"
  }
};