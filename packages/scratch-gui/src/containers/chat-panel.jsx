import { connect } from "react-redux";
import React from "react";
import { aiChatService } from "../lib/ai-services.js";
import VM from "@scratch/scratch-vm";
import PropTypes from "prop-types";
import {
    setInputValue,
    setMessages,
    setLoading,
    setSessionId,
    setSessions,
    setSessionTitle,
} from "../reducers/chat-panel";
import {
    getChatRecords,
    getChatRecord,
    uploadRecord,
    deleteRecord,
} from "../lib/chat-panel.js";

import ChatPanel from "../components/chat-panel/chat-panel.jsx";

class Chat extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.props.setSessions(await getChatRecords());
    }

    // 获取项目状况信息
    getProjectStatus = () => {
        const projectStatus = {
            currentSelect: {}, // 当前选中的内容
            projectJson: {}, // 项目JSON数据
        };
        if (this.props.vm) {
            projectStatus.projectJson = this.props.vm.toJSON();
            const currentSelect = this.props.vm.runtime.getEditingTarget();
            projectStatus.currentSelect = {
                isStage: currentSelect.isStage,
                direction: currentSelect.direction,
                id: currentSelect.id,
            };
        }
        return projectStatus;
    };

    // 历史对话记录点击
    conversationClick = async (id) => {
        await getChatRecord(id).then((res) => {
            this.props.setSessionId(res.id);
            this.props.setMessages(res.messages);
            this.props.setSessionTitle(res.sessionTitle);
        });
    };

    newConversation = () => {
        this.props.setMessages([]);
        this.props.setInputValue("");
        this.props.setSessionId(null);
        this.props.setLoading(false);
        this.props.setSessionTitle("新对话");
    };

    deleteRecord = async (id) => {
        await deleteRecord(id).then(() => {
            this.props.setSessions(
                this.props.sessions.filter((item) => item.id !== id),
            );
        });
    };

    submitMessage = async (text) => {
        if (!text) return;
        // 添加用户消息
        const userMessage = {
            id: Date.now(),
            content: text,
            role: "user",
            timestamp: new Date(),
        };

        // 先创建一个空的 assistant 消息，用于流式填充
        const aiMessage = {
            id: Date.now() + 1,
            content: "",
            role: "assistant",
            timestamp: new Date(),
        };

        this.props.setMessages([
            ...this.props.messages,
            userMessage,
            aiMessage,
        ]);
        this.props.setInputValue("");
        this.props.setLoading(true);
        try {
            // 按照四部分结构调用AI服务
            const projectStatus = this.getProjectStatus();
            const messageHistory = this.props.messages;

            await aiChatService.sendMessage(
                text, // 4. 用户发送的最后一条信息
                projectStatus, // 2. 项目状况
                messageHistory, // 3. 消息列表
                (delta) => {
                    // ⭐ 推送增量到最后一条消息
                    const updated = [...this.props.messages];
                    updated[updated.length - 1].content += delta;
                    this.props.setMessages(updated);
                },
            );
        } catch (error) {
            const updated = [...this.props.messages];
            updated[updated.length - 1].content =
                "抱歉，AI 服务暂时不可用，请稍后再试。";
            this.props.setMessages(updated);
        } finally {
            await uploadRecord(
                this.props.sessionId,
                this.props.messages.slice(-30),
            ) // 只保存最近30条消息
                .then((res) => {
                    if (!this.props.sessionId) {
                        this.props.setSessionId(res.id);
                    }
                })
                .finally(() => {
                    this.props.setLoading(false);
                    console.log(this.props);
                });
        }
    };

    render() {
        return (
            <ChatPanel
                inputValue={this.props.inputValue}
                setInputValue={this.props.setInputValue}
                messages={this.props.messages}
                loading={this.props.loading}
                vm={this.props.vm}
                sessions={this.props.sessions}
                sessionTitle={this.props.sessionTitle}
                submitMessage={this.submitMessage}
                newConversation={this.newConversation}
                conversationClick={this.conversationClick}
                deleteRecord={this.deleteRecord}
            />
        );
    }
}

Chat.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    inputValue: PropTypes.string,
    messages: PropTypes.array,
    loading: PropTypes.bool,
    sessionId: PropTypes.number,
    sessions: PropTypes.array,
    sessionTitle: PropTypes.string,
    setInputValue: PropTypes.func.isRequired,
    setMessages: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setSessionTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    inputValue: state.scratchGui.chatPanel.inputValue,
    messages: state.scratchGui.chatPanel.messages,
    loading: state.scratchGui.chatPanel.loading,
    sessionId: state.scratchGui.chatPanel.sessionId,
    sessions: state.scratchGui.chatPanel.sessions,
    sessionTitle: state.scratchGui.chatPanel.sessionTitle,
});

const mapDispatchToProps = (dispatch) => ({
    setInputValue: (value) => dispatch(setInputValue(value)),
    setMessages: (messages) => dispatch(setMessages(messages)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    setSessionId: (sessionId) => dispatch(setSessionId(sessionId)),
    setSessions: (sessions) => dispatch(setSessions(sessions)),
    setSessionTitle: (sessionTitle) => dispatch(setSessionTitle(sessionTitle)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
