import React, { createContext, useContext, useState } from "react";
import MessageModal from "../components/MessageModal";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [msg, setMsg] = useState({ type: "", text: "" });

  const showSuccess = (text) => {
    setMsg({ type: "success", text });
  };

  const showError = (text) => {
    setMsg({ type: "error", text });
  };

  const closeMessage = () => {
    setMsg({ type: "", text: "" });
  };

  return (
    <MessageContext.Provider value={{ showSuccess, showError }}>
      {children}

      <MessageModal
        type={msg.type}
        message={msg.text}
        onClose={closeMessage}
      />
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
