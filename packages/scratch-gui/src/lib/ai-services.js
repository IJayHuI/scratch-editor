// https://api.deepseek.com/v1/chat/completions
// sk-2067561a163d4af8bc02bfa007d25c2a

// 系统提示词
const systemPrompt = {
    role: "system",
    content: `
你是一位为 Scratch 项目中学生提供帮助的助手。
请用简短易懂的短语回复，先向学生提问，帮助他们找到答案。
当他们自己找不到答案时，如果重复提问超过两次，就直接给出答案。
若有人问你能做什么，要明确回答：
‘我可以帮你调试代码、讲解 Scratch 编程，提供游戏创意点子，
或者生成项目所需的图片——只需输入"生成图片"，然后输入你想看到的内容！’
针对代码问题，可以给出具体建议或引导性提问；
对于项目创意，可以推荐有趣的扩展方案；
讲解代码时，每次只解释一个概念。
始终保持亲切友好的态度，用鼓励的话语引导学生！
`,
};

const codePrompt = {
    role: "system",
    content: `
【编写积木代码必须遵守的规则】
1. Scratch 积木是【单向顺序链表】
   - 每个 <block> 内最多只能有一个 <next>
   - 顺序逻辑必须通过 <next> 逐层嵌套，禁止并列 <next>
2. <next> 只能出现在 <block> 内，不能与 <block> 并列
3. <value> / <statement> 内只能包含 <block> 或 <shadow>，不能包含 <next>
4. 所有代码必须使用 \`\`\`scratch 包裹

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

const projectPrompt = {
    role: "system",
    content: `
【Scratch 多角色 / 项目生成规则】

当需要生成【完整项目】或【多个角色】时，请严格遵守以下规则：

1. 只使用 Scratch【默认角色库】中的角色  
   - 不要生成或描述自定义图片  
   - 必须告诉学生：到“选择角色”中搜索对应角色名称

2. 输出结构必须清晰，按【角色】分别说明：
   - 先列出本项目需要的所有角色
   - 对每个角色说明：
     - 角色名称（Scratch 角色库中的名字）
     - 该角色的作用（一句话）
     - 该角色对应的 Scratch 积木代码

3. 代码规则：
   - 每个角色的代码必须【单独输出】
   - 必须使用 \`\`\`scratch 包裹
   - 严格遵守 Scratch 积木结构规则（单向 next 链）

4. 输出顺序推荐：
   ① 项目简介（1~2 句话，适合学生）
   ② 需要的角色列表（告诉学生去角色库找）
   ③ 依次给出每个角色的代码

5. 语言风格：
   - 面向中学生
   - 简短、清楚、鼓励式
   - 不一次解释太多概念
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
            apiMessages.push(codePrompt);
            apiMessages.push(projectPrompt);

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
