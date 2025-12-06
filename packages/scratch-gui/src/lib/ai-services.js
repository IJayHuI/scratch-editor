// https://api.deepseek.com/v1/chat/completions
// sk-924d7c54cd3f4d20941829d7850f6e76
export const aiChatService = {
    async sendMessage(
        userMessage,
        projectStatus,
        messageHistory = [],
        onDelta,
    ) {
        try {
            // 1. 系统提示词
            const systemPrompt = `你是一个专业的 Scratch 编程助手，专门帮助用户学习图形化编程和解决问题。  
  
你的职责：  
- 提供准确的 Scratch 编程指导  
- 解释积木块的使用方法  
- 帮助调试程序错误  
- 给出创意项目建议  
- 用简单易懂的语言解释复杂概念  
  
请根据用户的具体问题和当前项目状况，提供有针对性的帮助。如果涉及代码操作，请提供详细的步骤说明。`;

            // 构建完整的消息数组
            const apiMessages = [
                {
                    role: "system",
                    content: systemPrompt,
                },
            ];

            // 2. 添加项目状况信息作为系统消息的一部分
            if (projectStatus) {
                const projectContext = `当前项目状况：  
- 当前选择的精灵或舞台：${JSON.stringify(projectStatus.currentSelect) || "无"}  
- 项目数据：${JSON.stringify(projectStatus.projectJson || {})}`;

                apiMessages.push({
                    role: "system",
                    content: projectContext,
                });
            }

            // 3. 添加历史消息列表（限制最近10条）
            const recentMessages = messageHistory.slice(-10);
            recentMessages.forEach((msg) => {
                if (msg.role === "user" || msg.role === "assistant") {
                    apiMessages.push({
                        role: msg.role,
                        content: msg.content,
                    });
                }
            });

            // 4. 添加用户当前发送的消息
            apiMessages.push({
                role: "user",
                content: userMessage,
            });

            const response = await fetch(
                "https://api.deepseek.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer sk-924d7c54cd3f4d20941829d7850f6e76",
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: apiMessages,
                        temperature: 0.7,
                        max_tokens: 2000,
                        stream: true,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            // 解析流式输出
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let fullText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);

                const lines = chunk.split("\n");
                for (const line of lines) {
                    // SSE 格式: data: {...}
                    if (line.startsWith("data: ")) {
                        const dataStr = line.replace("data: ", "").trim();

                        if (dataStr === "[DONE]") {
                            return fullText;
                        }

                        try {
                            const json = JSON.parse(dataStr);
                            const delta = json.choices?.[0]?.delta?.content;
                            if (delta) {
                                fullText += delta;

                                // ⭐ 每段增量内容回调给 React
                                onDelta(delta);
                            }
                        } catch {}
                    }
                }
            }

            return fullText;
        } catch (error) {
            console.error("AI service error:", error);
            throw error;
        }
    },
};
