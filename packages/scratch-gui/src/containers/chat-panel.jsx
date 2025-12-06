import { injectIntl } from "react-intl";
import React from "react";
import { aiChatService } from "../lib/ai-services.js";
import VM from "@scratch/scratch-vm";
import PropTypes from "prop-types";

import ChatPanel from "../components/chat-panel/chat-panel.jsx";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            messages: [],
            loading: false,
        };
    }

    setInputValue = (value) => {
        this.setState({ inputValue: value });
    };

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

    submitMessage = async (text) => {
        if (!text) return;
        // 添加用户消息
        const userMessage = {
            id: Date.now(),
            content: text,
            role: "user",
            timestamp: new Date(),
        };

        this.setState({
            messages: [...this.state.messages, userMessage],
            inputValue: "",
            loading: true,
        });

        // 先创建一个空的 assistant 消息，用于流式填充
        const aiMessage = {
            id: Date.now() + 1,
            content: "",
            role: "assistant",
            timestamp: new Date(),
        };

        this.setState((prev) => ({
            messages: [...prev.messages, aiMessage],
        }));

        try {
            // 按照四部分结构调用AI服务
            const projectStatus = this.getProjectStatus();
            const messageHistory = this.state.messages;

            await aiChatService.sendMessage(
                text, // 4. 用户发送的最后一条信息
                projectStatus, // 2. 项目状况
                messageHistory, // 3. 消息列表
                (delta) => {
                    // ⭐ 推送增量到最后一条消息
                    this.setState((prev) => {
                        const updated = [...prev.messages];
                        updated[updated.length - 1].content += delta;
                        return { messages: updated };
                    });
                },
            );

            this.setState({ loading: false });
        } catch (error) {
            this.setState((prev) => {
                const updated = [...prev.messages];
                updated[updated.length - 1].content =
                    "抱歉，AI 服务暂时不可用，请稍后再试。";
                return { messages: updated, loading: false };
            });
        }
    };

    render() {
        return (
            <ChatPanel
                inputValue={this.state.inputValue}
                setInputValue={this.setInputValue}
                submitMessage={this.submitMessage}
                messages={this.state.messages}
                loading={this.state.loading}
            />
        );
    }
}

Chat.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(Chat);
