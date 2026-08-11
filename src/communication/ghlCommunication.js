import Postmate from "postmate";

const handshake = new Postmate.Model({});

export function initializeGHL(onElementStore) {
  handshake.then((parent) => {
    console.log("Connected to HighLevel");

    console.log("HighLevel parent model:", parent?.model);

    const elementStore = parent?.model?.elementStore;

    console.log("Received elementStore:", elementStore);

    if (elementStore) {
      onElementStore(elementStore);
    }
  });
}

export function sendToGHL(widget) {
  handshake.then((parent) => {
    console.log("Sending widget to HighLevel:", widget);

    parent?.emit("code", {
      html: widget.html,
      js: widget.js,
      elementStore: widget.elementStore,
    });
  });
}
