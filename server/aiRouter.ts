import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);

// AI服务Python脚本路径
const AI_SERVICE_PATH = path.join(__dirname, "ai_service.py");

/**
 * 调用Python AI服务生成解说
 */
async function generateCommentary(
  eventType: string,
  playerName: string,
  success: boolean = true,
  shotType: string = ""
): Promise<string> {
  try {
    const command = `python3.11 -c "
import sys
sys.path.append('${path.dirname(AI_SERVICE_PATH)}')
from ai_service import generate_commentary
print(generate_commentary('${eventType}', '${playerName}', ${success}, '${shotType}'))
"`;
    
    const { stdout } = await execAsync(command, { timeout: 5000 });
    return stdout.trim();
  } catch (error) {
    console.error("AI commentary generation error:", error);
    // 返回默认解说词
    return `${playerName}表现出色！`;
  }
}

/**
 * 与AI助手对话
 */
async function chatWithAssistant(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const historyJson = JSON.stringify(history).replace(/"/g, '\\"');
    const command = `python3.11 -c "
import sys
import json
sys.path.append('${path.dirname(AI_SERVICE_PATH)}')
from ai_service import chat_with_assistant
history = json.loads('${historyJson}')
print(chat_with_assistant('${message.replace(/'/g, "\\'")}', history))
"`;
    
    const { stdout } = await execAsync(command, { timeout: 10000 });
    return stdout.trim();
  } catch (error) {
    console.error("AI chat error:", error);
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
    return { status: "ok", model: "SmolLM-135M-Instruct" };
  }),
});

