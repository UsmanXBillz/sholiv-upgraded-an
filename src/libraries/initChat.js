import {socketInstance} from '../libraries/sockets';
import {Store} from '../Redux';

const initChat = (convoID, updateFunc) => {
  let userId = Store?.getState()?.AuthReducer?.user?.id;

  // Leave Room Listener:
  socketInstance?.emit('leave-room', convoID);

  // Join Room Listener:
  socketInstance?.emit('join', {conversation_id: convoID, sender_id: userId});

  // Error Event Listener:
  socketInstance?.on('error-event', payload => {
    console.warn({payload}, 'errorSocket==sana');
  });

  // Message Listener:
  socketInstance?.on(`message:receive`, payload => {
    if (convoID == payload?.conversation_id) {
      updateFunc(payload);
    }
  });
};

const fansLiveListener = (id, cb) => {
  socketInstance.on(`livestream-${id}`, payload => {
    console.log('===fansLiveListener===>', JSON.stringify(payload, null, 1));
    cb(payload);
  });
};

const artistLiveListener = (id, cb) => {
  socketInstance.on(`alert-${id}`, payload => {
    console.log('===payload===>', JSON.stringify(payload, null, 1));
    cb(payload);
  });
};

const fanStreamListingListner = cb => {
  socketInstance.on(`update`, payload => {
    console.warn('artistLiveListener payload', payload);
    cb(payload);
  });
};

const competitionListener = (id, cb) => {
  console.warn('ccccc', id);
  socketInstance.on(`competition-${id}`, payload => {
    console.warn('competitionListener payload', payload);
    cb(payload);
  });
};

// Listening for a message alert.
const alertListener = cb => {
  let userId = Store?.getState()?.AuthReducer?.user?.id;
  socketInstance?.on(`alert-${userId}`, payload => {
    if (payload) {
      cb(payload);
      return;
    }
    cb(payload);
  });
};

const offAlertListener = cb => {
  let userId = Store?.getState()?.AuthReducer?.user?.id;
  socketInstance.off(`alert-${userId}`, payload => {
    cb();
  });
};

export {
  alertListener,
  artistLiveListener,
  competitionListener,
  fansLiveListener,
  fanStreamListingListner,
  initChat,
  offAlertListener,
};
