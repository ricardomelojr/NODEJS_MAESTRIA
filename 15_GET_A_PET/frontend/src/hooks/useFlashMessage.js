import bus from '../utils/bus.js';

export default function useFlashMessage() {
  function setFlashMessage(msg, type) {
    bus.emit('flash', {
      message: msg,
      type: type,
    });
  }

  return { setFlashMessage };
}
