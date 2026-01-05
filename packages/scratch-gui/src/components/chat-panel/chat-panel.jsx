import React, { useCallback } from "react";
import { Sender, Welcome, CodeHighlighter, Conversations } from "@ant-design/x";
import { XMarkdown } from "@ant-design/x-markdown";
import ScratchHighlighter from "./scratch-highlighter";
import { Button, Space, Popover, message } from "antd";
import {
    CommentOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import styles from "./chat-panel.css";

const ChatPanel = (props) => {
    const {
        inputValue,
        setInputValue,
        submitMessage,
        newConversation,
        conversationClick,
        messages,
        loading,
        vm,
        sessions,
        sessionTitle,
        deleteRecord,
    } = props;

    const Code = useCallback(({ className, children }) => {
        const lang = className?.match(/language-(\w+)/)?.[1] || "";
        if (typeof children !== "string") return null;

        if (lang === "scratch")
            return <ScratchHighlighter value={children} vm={vm} />;
        return <CodeHighlighter lang={lang}>{children}</CodeHighlighter>;
    }, []);

    const conversationMenuConfig = (conversation) => ({
        trigger: (
            <DeleteOutlined
                onClick={async (e) => {
                    e.stopPropagation();
                    await deleteRecord(conversation.key);
                }}
            />
        ),
        items: []
    });

    const chatHeader = (
        <div className={styles.chatHeader}>
            <p>{sessionTitle}</p>
            <Space size={0}>
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        if (messages.length === 0)
                            message.error("已经是新对话了。");
                        else newConversation();
                    }}
                />
                <Popover
                    placement="bottom"
                    styles={{ container: { padding: 0, maxHeight: 600 } }}
                    content={
                        <Conversations
                            items={sessions}
                            menu={conversationMenuConfig}
                            groupable
                            onActiveChange={conversationClick}
                        />
                    }
                >
                    <Button type="text" icon={<CommentOutlined />} />
                </Popover>
            </Space>
        </div>
    );

    const chatList = (
        <div className={styles.chatList}>
            {messages.length === 0 ? (
                <div className={styles.listWelcome}>
                    <Welcome variant="borderless" title={`👋 欢迎使用AI助手`} />
                    <p>我可以帮你学习 Scratch 编程，回答任何问题</p>
                </div>
            ) : (
                messages.map((message) => (
                    <div key={message.id} className={styles.message}>
                        {message.role === "user" ? (
                            message.content
                        ) : (
                            <XMarkdown
                                components={{ code: Code }}
                                paragraphTag="div"
                                content={message.content}
                            />
                        )}
                    </div>
                ))
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
