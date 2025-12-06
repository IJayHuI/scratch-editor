import React from "react";

import { Sender, Bubble, Welcome } from "@ant-design/x";
import { XMarkdown } from "@ant-design/x-markdown";

import styles from "./chat-panel.css";

const ChatPanel = (props) => {
    const { inputValue, setInputValue, submitMessage, messages, loading } =
        props;

    const chatHeader = <div className={styles.chatHeader}></div>;

    const chatList = (
        <div className={styles.chatList}>
            {messages.length === 0 ? (
                <div className={styles.listWelcome}>
                    <Welcome
                        variant="borderless"
                        title={`👋 欢迎使用AI助手`}
                    />
                    <p>我可以帮你学习 Scratch 编程，回答任何问题</p>
                </div>
            ) : (
                <div className={styles.listContainer}>
                    {messages.map((message) => (
                        <Bubble
                            shape="corner"
                            key={message.id}
                            placement={
                                message.role === "user" ? "end" : "start"
                            }
                            content={
                                message.role === "user" ? (
                                    message.content
                                ) : (
                                    <XMarkdown content={message.content} />
                                )
                            }
                            typing={
                                message.role === "assistant" &&
                                loading &&
                                message === messages[messages.length - 1]
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );

    const chatSender = (
        <div className={styles.chatSender}>
            <Sender
                allowSpeech
                value={inputValue}
                loading={loading}
                placeholder="输入消息..."
                onChange={(v) => {
                    setInputValue(v);
                }}
                onSubmit={() => {
                    submitMessage(inputValue);
                }}
                onCancel={null}
            />
        </div>
    );
    return (
        <div className={styles.chatPanel}>
            {chatHeader}
            {chatList}
            {chatSender}
        </div>
    );
};

export default ChatPanel;
