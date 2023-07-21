import { usePostAiAssistMutation } from "@/state/api";
import { useEffect, useState } from "react";
import MessageFormUI from "./MessageFormUI";

// for AI input prompt completion:
// similar to StandardMessageForm

// debounce = wait for pause/delay in user typing:
// don't want to send api request for every keystroke
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // actually use debounce:
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);  // proper way to close-out useEffect
    };
  }, [value, delay]); // trigger any time either of these values changes

  return debouncedValue;
}

const AiAssist = ({ props, activeChat }) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [triggerAssist, resultAssist] = usePostAiAssistMutation();  // 'resultAssist' = response from backend
  const [appendText, setAppendText] = useState("");

  const handleChange = (e) => setMessage(e.target.value);

  const handleSubmit = async () => {
    const date = new Date()
      .toISOString()
      .replace("T", " ")
      .replace("Z", `${Math.floor(Math.random() * 1000)}+00:00`);
    const at = attachment ? [{ blob: attachment, file: attachment.name }] : [];
    const form = {
      attachments: at,
      created: date,
      sender_username: props.username,
      text: message,
      activeChatId: activeChat.id,
    };

    props.onSubmit(form);
    setMessage("");
    setAttachment("");
  };

  const debouncedValue = useDebounce(message, 1000);  // set debounce to 1 second (1000ms)

  useEffect(() => {
    if (debouncedValue) {   // don't do anything if 'debouncedValue' doesn't exist
      const form = { text: message }; // create form from text
      triggerAssist(form);  // make the api call
    }
  // trigger whenver 'debouncedValue' changes:
  }, [debouncedValue]); // eslint-disable-line

  const handleKeyDown = (e) => {
    // handle enter and tab = use autocomplete entry
    if (e.keyCode === 9 || e.keyCode === 13) {  // '9' = enter; '13' = tab
      e.preventDefault(); // don't refresh the page
      // add original text and appended text together:
      setMessage(`${message} ${appendText}`); // 'appendText' = extra text returned from ai api
    }
    setAppendText("");  // clear appended text
  };

  useEffect(() => {
    if (resultAssist.data?.text) {    // if response from assist api
      setAppendText(resultAssist.data?.text); // set 'appendText' to be response value
    }
  // run any time resultAssist changes:
  }, [resultAssist]); // eslint-disable-line

  return (
    <MessageFormUI
      setAttachment={setAttachment}
      message={message}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      appendText={appendText} // unique to this component
      handleKeyDown={handleKeyDown} // unique to this component
    />
  );
};

export default AiAssist;
