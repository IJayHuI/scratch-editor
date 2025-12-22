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
            messages: [
                {
                    id: 1765430319353,
                    content: "项目里有啥",
                    role: "user",
                    timestamp: "2025-12-11T05:18:39.353Z",
                },
                {
                    id: 1765430319354,
                    content:
                        '我来帮你查看一下当前项目的内容：\n\n## 📋 项目概览\n\n### 1. **舞台 (Stage)**\n- **背景**：有一个名为"背景1"的SVG背景\n- **声音**：有一个"啵"的声音效果\n- **变量**：有一个全局变量"my variable"（当前值为0）\n\n### 2. **精灵 (角色1)**\n- **当前选择**：你正在编辑的是"角色1"\n- **造型**：有2个造型\n  - 造型1\n  - 造型2\n- **声音**：有一个"Meow"（猫叫声）音效\n- **属性**：\n  - 位置：舞台中心 (x:0, y:0)\n  - 大小：100%\n  - 方向：90度（面向右）\n  - 可见：是\n  - 可拖动：否\n  - 旋转模式：全方位旋转\n\n### 3. **当前状态**\n- 项目目前**没有任何积木代码**\n- 所有精灵和舞台的代码区域都是空的\n- 项目处于初始状态，等待你添加编程逻辑\n\n## 💡 建议\n既然项目还是空白的，你可以：\n1. 为角色1添加一些动作积木\n2. 使用两个造型制作动画效果\n3. 添加交互功能（比如点击角色时播放猫叫声）\n4. 使用变量创建计分或计时功能\n\n你想从哪个功能开始呢？我可以帮你一步步实现！',
                    role: "assistant",
                    timestamp: "2025-12-11T05:18:39.353Z",
                },
                {
                    id: 1765430356630,
                    content: "写一个最简单的python代码",
                    role: "user",
                    timestamp: "2025-12-11T05:19:16.630Z",
                },
                {
                    id: 1765430356631,
                    content:
                        '虽然Scratch是图形化编程，但我可以帮你写一个最简单的Python代码，然后教你在Scratch中实现类似的功能。\n\n## 🐍 最简单的Python代码\n\n```python\n# 打印"Hello, World!"\nprint("Hello, World!")\n```\n\n## 🎯 在Scratch中实现类似功能\n\n### 方法1：使用"说"积木\n1. 点击**角色1**\n2. 从**外观**类别中拖动：\n   ```\n   [说 Hello! 2秒]\n   ```\n3. 修改文字为"Hello, World!"\n\n### 方法2：使用"说"积木（不等待）\n```\n[说 Hello, World!]\n```\n\n### 方法3：使用舞台的"说"积木\n1. 点击**舞台**\n2. 从**外观**类别中拖动：\n   ```\n   [说 Hello, World! 2秒]\n   ```\n\n## 📝 完整的Scratch代码示例\n\n如果你想在Scratch中实现一个完整的"Hello World"程序：\n\n1. **当绿旗被点击时开始**\n   ```\n   [当绿旗被点击]\n   [说 Hello, World! 2秒]\n   ```\n\n2. **添加一些互动**（点击角色时说话）：\n   ```\n   [当角色被点击]\n   [说 Hello from Scratch! 2秒]\n   ```\n\n## 🔄 Python与Scratch对比\n\n| Python代码 | Scratch对应积木 |\n|------------|----------------|\n| `print("Hello")` | `[说 Hello]` |\n| 文本编辑器编写 | 拖拽积木块 |\n| 命令行输出 | 角色气泡显示 |\n\n你想在Scratch中实现什么具体功能吗？我可以帮你一步步构建！',
                    role: "assistant",
                    timestamp: "2025-12-11T05:19:16.630Z",
                },
                {
                    id: 1765430386656,
                    content: "写一小段py代码",
                    role: "user",
                    timestamp: "2025-12-11T05:19:46.656Z",
                },
                {
                    id: 1765430386657,
                    content:
                        '# 🐍 一小段实用的Python代码\n\n## 示例1：简单的计算器\n```python\n# 简单的加法计算器\nnum1 = float(input("请输入第一个数字: "))\nnum2 = float(input("请输入第二个数字: "))\n\nresult = num1 + num2\nprint(f"{num1} + {num2} = {result}")\n```\n\n## 示例2：猜数字游戏\n```python\nimport random\n\n# 生成1-10的随机数\nsecret_number = random.randint(1, 10)\nguess = int(input("猜一个1-10的数字: "))\n\nif guess == secret_number:\n    print("恭喜你猜对了！")\nelse:\n    print(f"猜错了，正确答案是: {secret_number}")\n```\n\n## 示例3：列表操作\n```python\n# 创建和处理列表\nfruits = ["苹果", "香蕉", "橙子", "草莓"]\n\nprint("水果列表:")\nfor fruit in fruits:\n    print(f"- {fruit}")\n\nprint(f"\\n总共有 {len(fruits)} 种水果")\n```你需要我详细解释哪个Python代码，或者想在Scratch中实现什么特定功能吗？',
                    role: "assistant",
                    timestamp: "2025-12-11T05:19:46.656Z",
                },
                {
                    id: 1765867913580,
                    content: "写一段示例scratch代码",
                    role: "user",
                    timestamp: "2025-12-16T06:51:53.580Z",
                },
                {
                    id: 1765867913581,
                    content:
                        '```scratch\n<xml xmlns="http://www.w3.org/1999/xhtml">\n  <block type="event_whenflagclicked" x="0" y="0">\n    <next>\n      <block type="looks_sayforsecs">\n        <value name="MESSAGE">\n          <shadow type="text">\n            <field name="TEXT">你好，Scratch！</field>\n          </shadow>\n        </value>\n        <value name="SECS">\n          <shadow type="math_number">\n            <field name="NUM">2</field>\n          </shadow>\n        </value>\n        <next>\n          <block type="motion_movesteps">\n            <value name="STEPS">\n              <shadow type="math_number">\n                <field name="NUM">50</field>\n              </shadow>\n            </value>\n            <next>\n              <block type="sound_playuntildone">\n                <value name="SOUND_MENU">\n                  <shadow type="sound_sounds_menu">\n                    <field name="SOUND_MENU">Meow</field>\n                  </shadow>\n                </value>\n                <next>\n                  <block type="looks_switchcostumeto">\n                    <value name="COSTUME">\n                      <shadow type="looks_costume">\n                        <field name="COSTUME">造型2</field>\n                      </shadow>\n                    </value>\n                    <next>\n                      <block type="control_wait">\n                        <value name="DURATION">\n                          <shadow type="math_number">\n                            <field name="NUM">1</field>\n                          </shadow>\n                        </value>\n                        <next>\n                          <block type="looks_switchcostumeto">\n                            <value name="COSTUME">\n                              <shadow type="looks_costume">\n                                <field name="COSTUME">造型1</field>\n                              </shadow>\n                            </value>\n                          </block>\n                        </next>\n                      </block>\n                    </next>\n                  </block>\n                </next>\n              </block>\n            </next>\n          </block>\n        </next>\n      </block>\n    </next>\n  </block>\n</xml>\n```',
                    role: "assistant",
                    timestamp: "2025-12-16T06:51:53.580Z",
                },
                {
                    id: 1765947519142,
                    content: "写一个航天器在太空中飞行的项目",
                    role: "user",
                    timestamp: "2025-12-17T04:58:39.142Z",
                },
                {
                    id: 1765947519144,
                    content:
                        '```scratch\n<xml xmlns="http://www.w3.org/1999/xhtml">\n  <!-- 主程序：航天器控制 -->\n  <block type="event_whenflagclicked" x="0" y="0">\n    <next>\n      <block type="looks_switchcostumeto">\n        <value name="COSTUME">\n          <shadow type="looks_costume">\n            <field name="COSTUME">造型1</field>\n          </shadow>\n        </value>\n        <next>\n          <block type="motion_gotoxy">\n            <value name="X">\n              <shadow type="math_number">\n                <field name="NUM">0</field>\n              </shadow>\n            </value>\n            <value name="Y">\n              <shadow type="math_number">\n                <field name="NUM">0</field>\n              </shadow>\n            </value>\n            <next>\n              <block type="motion_pointindirection">\n                <value name="DIRECTION">\n                  <shadow type="math_number">\n                    <field name="NUM">90</field>\n                  </shadow>\n                </value>\n                <next>\n                  <block type="control_forever">\n                    <statement name="SUBSTACK">\n                      <block type="motion_ifonedgebounce">\n                        <next>\n                          <block type="control_if">\n                            <value name="CONDITION">\n                              <block type="sensing_keypressed">\n                                <value name="KEY_OPTION">\n                                  <shadow type="keyoptions">\n                                    <field name="KEY_OPTION">up arrow</field>\n                                  </shadow>\n                                </value>\n                              </block>\n                            </value>\n                            <statement name="SUBSTACK">\n                              <block type="motion_changeyby">\n                                <value name="DY">\n                                  <shadow type="math_number">\n                                    <field name="NUM">10</field>\n                                  </shadow>\n                                </value>\n                                <next>\n                                  <block type="looks_switchcostumeto">\n                                    <value name="COSTUME">\n                                      <shadow type="looks_costume">\n                                        <field name="COSTUME">造型2</field>\n                                      </shadow>\n                                    </value>\n                                  </block>\n                                </next>\n                              </block>\n                            </statement>\n                            <next>\n                              <block type="control_if">\n                                <value name="CONDITION">\n                                  <block type="sensing_keypressed">\n                                    <value name="KEY_OPTION">\n                                      <shadow type="keyoptions">\n                                        <field name="KEY_OPTION">down arrow</field>\n                                      </shadow>\n                                    </value>\n                                  </block>\n                                </value>\n                                <statement name="SUBSTACK">\n                                  <block type="motion_changeyby">\n                                    <value name="DY">\n                                      <shadow type="math_number">\n                                        <field name="NUM">-10</field>\n                                      </shadow>\n                                    </value>\n                                    <next>\n                                      <block type="looks_switchcostumeto">\n                                        <value name="COSTUME">\n                                          <shadow type="looks_costume">\n                                            <field name="COSTUME">造型1</field>\n                                          </shadow>\n                                        </value>\n                                      </block>\n                                    </next>\n                                  </block>\n                                </statement>\n                                <next>\n                                  <block type="control_if">\n                                    <value name="CONDITION">\n                                      <block type="sensing_keypressed">\n                                        <value name="KEY_OPTION">\n                                          <shadow type="keyoptions">\n                                            <field name="KEY_OPTION">right arrow</field>\n                                          </shadow>\n                                        </value>\n                                      </block>\n                                    </value>\n                                    <statement name="SUBSTACK">\n                                      <block type="motion_changexby">\n                                        <value name="DX">\n                                          <shadow type="math_number">\n                                            <field name="NUM">10</field>\n                                          </shadow>\n                                        </value>\n                                        <next>\n                                          <block type="motion_turnright">\n                                            <value name="DEGREES">\n                                              <shadow type="math_number">\n                                                <field name="NUM">15</field>\n                                              </shadow>\n                                            </value>\n                                          </block>\n                                        </next>\n                                      </block>\n                                    </statement>\n                                    <next>\n                                      <block type="control_if">\n                                        <value name="CONDITION">\n                                          <block type="sensing_keypressed">\n                                            <value name="KEY_OPTION">\n                                              <shadow type="keyoptions">\n                                                <field name="KEY_OPTION">left arrow</field>\n                                              </shadow>\n                                            </value>\n                                          </block>\n                                        </value>\n                                        <statement name="SUBSTACK">\n                                          <block type="motion_changexby">\n                                            <value name="DX">\n                                              <shadow type="math_number">\n                                                <field name="NUM">-10</field>\n                                              </shadow>\n                                            </value>\n                                            <next>\n                                              <block type="motion_turnleft">\n                                                <value name="DEGREES">\n                                                  <shadow type="math_number">\n                                                    <field name="NUM">15</field>\n                                                  </shadow>\n                                                </value>\n                                              </block>\n                                            </next>\n                                          </block>\n                                        </statement>\n                                        <next>\n                                          <block type="control_if">\n                                            <value name="CONDITION">\n                                              <block type="sensing_keypressed">\n                                                <value name="KEY_OPTION">\n                                                  <shadow type="keyoptions">\n                                                    <field name="KEY_OPTION">space</field>\n                                                  </shadow>\n                                                </value>\n                                              </block>\n                                            </value>\n                                            <statement name="SUBSTACK">\n                                              <block type="sound_playuntildone">\n                                                <value name="SOUND_MENU">\n                                                  <shadow type="sound_sounds_menu">\n                                                    <field name="SOUND_MENU">Meow</field>\n                                                  </shadow>\n                                                </value>\n                                                <next>\n                                                  <block type="looks_sayforsecs">\n                                                    <value name="MESSAGE">\n                                                      <shadow type="text">\n                                                        <field name="TEXT">引擎启动！</field>\n                                                      </shadow>\n                                                    </value>\n                                                    <value name="SECS">\n                                                      <shadow type="math_number">\n                                                        <field name="NUM">0.5</field>\n                                                      </shadow>\n                                                    </value>\n                                                  </block>\n                                                </next>\n                                              </block>\n                                            </statement>\n                                            <next>\n                                              <block type="control_wait">\n                                                <value name="DURATION">\n                                                  <shadow type="math_number">\n                                                    <field name="NUM">0.1</field>\n                                                  </shadow>\n                                                </value>\n                                              </block>\n                                            </next>\n                                          </block>\n                                        </next>\n                                      </block>\n                                    </next>\n                                  </block>\n                                </next>\n                              </block>\n                            </next>\n                          </block>\n                        </next>\n                      </block>\n                    </statement>\n                  </block>\n                </next>\n              </block>\n            </next>\n          </block>\n        </next>\n      </block>\n    </next>\n  </block>\n</xml>\n```\n\n## 🚀 项目功能说明\n\n这个航天器飞行项目包含以下功能：\n\n### 控制方式：\n- **上箭头**：向上飞行（切换为造型2）\n- **下箭头**：向下飞行（切换为造型1）\n- **左箭头**：向左飞行并左转15度\n- **右箭头**：向右飞行并右转15度\n- **空格键**：启动引擎（播放声音并显示"引擎启动！"）\n\n### 物理特性：\n- 碰到边缘会自动反弹\n- 每次按键移动10个单位\n- 转向时旋转15度\n- 有0.1秒的延迟防止按键过快\n\n### 视觉效果：\n- 上下飞行时切换不同造型\n- 左右飞行时航天器会转向\n- 引擎启动时有声音和文字提示\n\n你可以根据需要调整移动速度、旋转角度或添加更多功能！',
                    role: "assistant",
                    timestamp: "2025-12-17T04:58:39.143Z",
                },
            ],
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
            console.log(this.state.messages);
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
                vm={this.props.vm}
            />
        );
    }
}

Chat.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(Chat);
