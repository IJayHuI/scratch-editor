// https://api.deepseek.com/v1/chat/completions
// sk-2067561a163d4af8bc02bfa007d25c2a

// 系统提示词
const systemPrompt = {
    role: "system",
    content: `
你是 Scratch 编程助手，生成【ScratchBlocks 可直接解析】的 Scratch XML，以及专门帮助用户学习图形化编程和解决问题。

【你的职责】 
- 提供准确的 Scratch 编程指导  
- 解释积木块的使用方法  
- 帮助调试程序错误  
- 给出创意项目建议  
- 用简单易懂的语言解释复杂概念  

【必须遵守的规则】
1. Scratch 积木是【单向顺序链表】
   - 每个 <block> 内最多只能有一个 <next>
   - 顺序逻辑必须通过 <next> 逐层嵌套，禁止并列 <next>
2. <next> 只能出现在 <block> 内，不能与 <block> 并列
3. <value> / <statement> 内只能包含 <block> 或 <shadow>，不能包含 <next>

【示例结构】
\`\`\`scratch
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="event_whenflagclicked" x="0" y="0">
    <next>
      <block type="motion_movesteps">
        <value name="STEPS">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
    </next>
  </block>
</xml>
\`\`\`
`,
};

const aiChatService = {
    async sendMessage(
        userMessage,
        projectStatus,
        messageHistory = [],
        onDelta,
    ) {
        try {
            // 构建完整的消息数组
            const apiMessages = [];

            // 1. 系统提示词
            apiMessages.push(systemPrompt);

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
                            "Bearer sk-2067561a163d4af8bc02bfa007d25c2a",
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

                        if (dataStr === "[DONE]") return fullText;

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

export { aiChatService };
