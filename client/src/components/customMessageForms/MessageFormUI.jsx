import {
  PaperAirplaneIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import Dropzone from "react-dropzone";

const MessageFormUI = ({
  setAttachment,          // functions passed-in as props
  message,
  handleChange,
  handleSubmit,
  appendText,
  handleKeyDown,
}) => {
  const [preview, setPreview] = useState(""); // initial state = blank

  return (
    // all styles are from index.scss
    // Message input component at bottom middle of screen:
    <div className="message-form-container">
      {preview && (
        <div className="message-form-preview">
          <img
            alt="message-form-preview"
            className="message-form-preview-image"
            src={preview}
            onLoad={() => URL.revokeObjectURL(preview)} // once loaded, revoke 'ObjectURL' created below
          />
          <XMarkIcon
            className="message-form-icon-x"
            onClick={() => {
              setPreview(""); // clear preview
              setAttachment("");  // clear attachment
            }}
          />
        </div>
      )}
      {/* Styled text input box: */}
      <div className="message-form">
        <div className="message-form-input-container">
          <input
            className="message-form-input"
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // unique to AI Assist
            placeholder="Send a message..."
          />
          {appendText && (  // if there is an append text:
            // create a second input with both original and 'append' values:
            <input
              className="message-form-assist" // overlays on original text, but in grey text
              type="text"
              disabled="disabled" // can't modify value; only modified in original input, above
              value={`${message} ${appendText}`}  // as opposed to just '{message}' above
            />
          )}
        </div>
        <div className="message-form-icons">
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            noClick={true}
            onDrop={(acceptedFiles) => {
              setAttachment(acceptedFiles[0]);  // 'acceptedFiles[0]' = selected file
              setPreview(URL.createObjectURL(acceptedFiles[0]));  // creates 'ObjectURL' for image (revoked above)
            }}
          >
            {/* from dropzone documentation: */}
            {({ getRootProps, getInputProps, open }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <PaperClipIcon
                  className="message-form-icon-clip"
                  onClick={open}
                />
              </div>
            )}
          </Dropzone>

          {/* horizontal rule turned into vertical with CSS: */}
          <hr className="vertical-line" />
          <PaperAirplaneIcon
            className="message-form-icon-airplane"
            onClick={() => {
              setPreview(""); // clear the preview image
              handleSubmit(); // handleSubmit passed-in as prop
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageFormUI;
