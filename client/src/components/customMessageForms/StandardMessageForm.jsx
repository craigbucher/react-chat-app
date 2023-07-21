import { useState } from "react";
import MessageFormUI from "./MessageFormUI";

const StandardMessageForm = ({ props, activeChat }) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState("");

  const handleChange = (e) => setMessage(e.target.value);

  const handleSubmit = async () => {
    const date = new Date()
      .toISOString()    // format to 'YYYY-MM-DDTHH:mm:ss.sssZ'
      .replace("T", " ")  // strip-out 'T' to make it read better
      .replace("Z", `${Math.floor(Math.random() * 1000)}+00:00`); // add random time
    // if have attachment, format for chat engine; if not = empty array (to prevent error)
    const at = attachment ? [{ blob: attachment, file: attachment.name }] : [];
    const form = {
      attachments: at,
      created: date,
      sender_username: props.username,  // from chat api
      text: message,
      activeChatId: activeChat.id,  // from chat api
    };

    props.onSubmit(form); // call 'onSubmit' function from props (passed-in from MessageFormUI)
    setMessage(""); // clear message
    setAttachment("");  // clear attachment
  };

  return (
    <MessageFormUI
      setAttachment={setAttachment}
      message={message}
      handleChange={handleChange} // allows user to change text entry box value/state
      handleSubmit={handleSubmit}
    />
  );
};

export default StandardMessageForm;
