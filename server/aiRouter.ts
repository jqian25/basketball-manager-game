import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

/**
 * AI路由 - 使用Manus内置LLM服务
 * 支持篮球解说生成和NPC对话
 */

/**
 * 生成篮球解说词
 */
async function generateCommentary(
  eventType: string,
  playerName: string,
  success: boolean = true,
  shotType: string = ""
): Promise<string> {
  try {
    const eventDescriptions: Record<string, string> = {
      shot: success ? `${playerName}投篮命中！` : `${playerName}投篮不中`,
      assist: `${playerName}送出精彩助攻！`,
      rebound: `${playerName}抢下篮板！`,
      steal: `${playerName}完成抢断！`,
      block: `${playerName}封盖成功！`
    };

    const shotTypeDesc: Record<string, string> = {
      three: "三分球",
      mid: "中距离",
      layup: "上篮",
      dunk: "扣篮",
      "": ""
    };

    const prompt = `你是一名专业的篮球比赛解说员，请为以下比赛事件生成一句激情洋溢的解说词(不超过30字):

事件类型: ${eventDescriptions[eventType] || eventType}
球员: ${playerName}
${shotType ? `投篮类型: ${shotTypeDesc[shotType]}` : ""}

要求:
1. 语言生动有力，充满激情
2. 符合灌篮高手的热血风格
3. 只返回解说词本身，不要其他内容`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "你是一名专业的篮球解说员，擅长用激情洋溢的语言描述比赛精彩瞬间。" },
        { role: "user", content: prompt }
      ]
    });

    const content = response.choices[0]?.message?.content;
    const commentary = (typeof content === 'string' ? content.trim() : null) || eventDescriptions[eventType];
    return commentary;
  } catch (error) {
    console.error("AI commentary generation error:", error);
    // 返回默认解说词
    return `${playerName}表现出色！`;
  }
}

/**
 * NPC对话生成
 */
async function chatWithNPC(
  npcName: string,
  npcRole: string,
  npcPersonality: string,
  playerMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  try {
    const systemPrompt = `你是${npcName}，一个在篮球经理游戏中的NPC角色。

角色设定:
- 职位: ${npcRole}
- 性格: ${npcPersonality}

对话规则:
1. 保持角色设定，用第一人称说话
2. 回复简短自然，不超过50字
3. 可以谈论篮球、训练、比赛、球员管理等话题
4. 如果玩家问及比赛策略，提供专业建议
5. 保持友好和乐于助人的态度
6. 根据对话历史保持连贯性
7. 不要重复之前说过的话

请自然地回复玩家的消息。`;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt }
    ];

    // 添加对话历史(最多保留最近10条)
    const recentHistory = conversationHistory.slice(-10);
    messages.push(...recentHistory);

    // 添加当前玩家消息
    messages.push({ role: "user", content: playerMessage });

    const response = await invokeLLM({
      messages
    });

    const content = response.choices[0]?.message?.content;
    const reply = (typeof content === 'string' ? content.trim() : null) || "...";
    return reply;
  } catch (error) {
    console.error("NPC dialogue generation error:", error);
    return "抱歉，我现在有点忙，请稍后再试！";
  }
}

/**
 * 通用AI助手对话
 */
async function chatWithAssistant(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  try {
    const systemPrompt = `你是篮球经理游戏的AI助手，负责帮助玩家提升球队实力。

你的职责:
1. 回答关于游戏玩法的问题
2. 提供球员培养和训练建议
3. 分析比赛战术和阵容配置
4. 推荐合适的设施建设
5. 解释游戏系统和机制

回复要求:
- 简洁专业，不超过100字
- 提供具体可行的建议
- 保持友好和鼓励的语气
- 如果涉及充值，委婉引导但不强迫`;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt }
    ];

    // 添加对话历史
    const recentHistory = history.slice(-10);
    messages.push(...recentHistory);

    // 添加当前消息
    messages.push({ role: "user", content: message });

    const response = await invokeLLM({
      messages
    });

    const content = response.choices[0]?.message?.content;
    const reply = (typeof content === 'string' ? content.trim() : null) || "抱歉，我现在有点忙，请稍后再试！";
    return reply;
  } catch (error) {
    console.error("AI assistant chat error:", error);
    return "抱歉，我现在有点忙，请稍后再试！";
  }
}

export const aiRouter = router({
  /**
   * 生成篮球解说词
   */
  generateCommentary: publicProcedure
    .input(
      z.object({
        eventType: z.enum(["shot", "assist", "rebound", "steal", "block"]),
        playerName: z.string(),
        success: z.boolean().default(true),
        shotType: z.enum(["three", "mid", "layup", "dunk", ""]).default(""),
      })
    )
    .mutation(async ({ input }) => {
      const commentary = await generateCommentary(
        input.eventType,
        input.playerName,
        input.success,
        input.shotType
      );
      return { commentary };
    }),

  /**
   * NPC对话 - 使用Manus LLM
   */
  npcChat: publicProcedure
    .input(
      z.object({
        npcName: z.string(),
        npcRole: z.string(),
        npcPersonality: z.string(),
        message: z.string(),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const reply = await chatWithNPC(
        input.npcName,
        input.npcRole,
        input.npcPersonality,
        input.message,
        input.history || []
      );
      return { reply };
    }),

  /**
   * 与AI助手对话
   */
  chat: publicProcedure
    .input(
      z.object({
        message: z.string(),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const reply = await chatWithAssistant(input.message, input.history || []);
      return { reply };
    }),

  /**
   * 健康检查
   */
  health: publicProcedure.query(() => {
    return { status: "ok", model: "Manus LLM" };
  }),
});

