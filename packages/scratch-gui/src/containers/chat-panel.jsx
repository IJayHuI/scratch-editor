import { injectIntl } from "react-intl";
import React from "react";
import ChatPanel from "../components/chat-panel/chat-panel.jsx";

class Chat extends React.Component {
    render() {
        return <ChatPanel />;
    }
}

export default injectIntl(Chat);
