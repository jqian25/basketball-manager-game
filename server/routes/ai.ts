/**
 * AI对话API
 * 使用手机端大模型生成NPC对话
 */

import { Router } from "express";

const router = Router();

/**
 * POST /api/ai/chat
 * 生成AI对话回复
 */
router.post("/chat", async (req, res) => {
  try {
    const { model, messages, temperature, max_tokens } = req.body;

    // 验证请求参数
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    // 构建提示词
    const systemMessage = messages.find((m: any) => m.role === "system");
    const conversationMessages = messages.filter((m: any) => m.role !== "system");

    // 简化版AI回复生成（使用规则引擎）
    // 在生产环境中，这里应该调用真实的大模型API
    const response = generateRuleBasedResponse(
      systemMessage?.content || "",
      conversationMessages
    );

    res.json({
      response,
      model: model || "mobile-llm",
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 基于规则的对话生成（降级方案）
 */
function generateRuleBasedResponse(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>
): string {
  const lastUserMessage = messages
    .filter(m => m.role === "user")
    .pop()?.content || "";

  // 提取角色名称
  const nameMatch = systemPrompt.match(/你是(.+?)，/);
  const characterName = nameMatch ? nameMatch[1] : "NPC";

  // 关键词匹配回复
  const lowerMessage = lastUserMessage.toLowerCase();

  // 篮球相关
  if (lowerMessage.includes("篮球") || lowerMessage.includes("比赛")) {
    const responses = [
      "篮球是一项需要团队配合的运动，每个位置都很重要。",
      "想要打好篮球，基本功训练必不可少。",
      "比赛的关键在于战术执行和临场应变。",
      "我看过很多精彩的比赛，每一场都让人热血沸腾！"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 训练相关
  if (lowerMessage.includes("训练") || lowerMessage.includes("练习")) {
    const responses = [
      "坚持训练是成为优秀球员的必经之路。",
      "每天的基础训练看似枯燥，但却是进步的基石。",
      "训练时要注意保护好自己，避免受伤。",
      "有针对性的训练能让你的弱项变成强项。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 问候
  if (lowerMessage.includes("你好") || lowerMessage.includes("嗨") || lowerMessage.includes("hi")) {
    const responses = [
      "你好！有什么我可以帮助你的吗？",
      "嗨！很高兴见到你！",
      "你好啊！今天感觉怎么样？",
      "欢迎！有什么想聊的吗？"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 询问名字
  if (lowerMessage.includes("你叫") || lowerMessage.includes("名字") || lowerMessage.includes("who are you")) {
    return `我是${characterName}。`;
  }

  // 询问位置/地点
  if (lowerMessage.includes("哪里") || lowerMessage.includes("在哪") || lowerMessage.includes("位置")) {
    const responses = [
      "我们现在在湘北高中，这里有很棒的篮球场。",
      "这里是学校的操场，经常有人在这里练球。",
      "如果你想找篮球场，就在前面那边。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 鼓励/加油
  if (lowerMessage.includes("加油") || lowerMessage.includes("努力") || lowerMessage.includes("坚持")) {
    const responses = [
      "没错！只要不放弃，就一定能成功！",
      "加油！我相信你可以的！",
      "坚持下去，你会看到成果的！",
      "努力永远不会白费，继续加油！"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 默认回复
  const defaultResponses = [
    "嗯，我明白你的意思。",
    "有意思，继续说说看。",
    "是吗？告诉我更多吧。",
    "我在听，请继续。",
    "这个话题很有趣。",
    "我也这么觉得。"
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export default router;

