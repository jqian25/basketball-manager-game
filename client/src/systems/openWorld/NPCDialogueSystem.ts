/**
 * NPC对话系统
 * 支持静态对话和AI生成对话
 */

import type { NPC, NPCDialogue } from "../../types/openWorld";

export interface DialogueMessage {
  speaker: string;
  text: string;
  timestamp: number;
}

export interface DialogueSession {
  npcId: string;
  messages: DialogueMessage[];
  isActive: boolean;
}

export class NPCDialogueSystem {
  private dialogues: Map<string, NPCDialogue> = new Map();
  private currentSession: DialogueSession | null = null;
  private conversationHistory: Map<string, DialogueMessage[]> = new Map();

  /**
   * 注册NPC对话
   */
  registerDialogue(dialogue: NPCDialogue) {
    this.dialogues.set(dialogue.npcId, dialogue);
  }

  /**
   * 开始与NPC对话
   */
  async startDialogue(npc: NPC, playerName: string): Promise<DialogueSession> {
    const dialogue = this.dialogues.get(npc.id);
    
    if (!dialogue) {
      // 如果没有注册对话，创建默认对话
      return this.createDefaultDialogue(npc);
    }

    this.currentSession = {
      npcId: npc.id,
      messages: [],
      isActive: true
    };

    // 获取历史对话
    const history = this.conversationHistory.get(npc.id) || [];

    if (dialogue.useAI) {
      // 使用AI生成对话
      const greeting = await this.generateAIResponse(
        npc,
        dialogue,
        playerName,
        "你好",
        history
      );
      
      this.currentSession.messages.push({
        speaker: npc.name,
        text: greeting,
        timestamp: Date.now()
      });
    } else {
      // 使用静态对话
      const greeting = this.getRandomStaticDialogue(dialogue);
      this.currentSession.messages.push({
        speaker: npc.name,
        text: greeting,
        timestamp: Date.now()
      });
    }

    return this.currentSession;
  }

  /**
   * 发送玩家消息并获取NPC回复
   */
  async sendMessage(
    playerMessage: string,
    playerName: string
  ): Promise<string> {
    if (!this.currentSession) {
      throw new Error("No active dialogue session");
    }

    const npcId = this.currentSession.npcId;
    const dialogue = this.dialogues.get(npcId);

    if (!dialogue) {
      return "...";
    }

    // 添加玩家消息到历史
    this.currentSession.messages.push({
      speaker: playerName,
      text: playerMessage,
      timestamp: Date.now()
    });

    let response: string;

    if (dialogue.useAI) {
      // 使用AI生成回复
      const npc = { id: npcId, name: dialogue.npcId } as NPC; // 简化版NPC对象
      response = await this.generateAIResponse(
        npc,
        dialogue,
        playerName,
        playerMessage,
        this.currentSession.messages
      );
    } else {
      // 使用静态对话
      response = this.getRandomStaticDialogue(dialogue);
    }

    // 添加NPC回复到历史
    this.currentSession.messages.push({
      speaker: dialogue.npcId,
      text: response,
      timestamp: Date.now()
    });

    // 保存到长期历史
    this.saveToHistory(npcId, this.currentSession.messages);

    return response;
  }

  /**
   * 使用AI生成对话回复
   */
  private async generateAIResponse(
    npc: NPC,
    dialogue: NPCDialogue,
    playerName: string,
    playerMessage: string,
    history: DialogueMessage[]
  ): Promise<string> {
    try {
      // 构建系统提示词
      const systemPrompt = this.buildSystemPrompt(npc, dialogue, playerName);

      // 构建对话历史
      const conversationContext = history.slice(-10).map(msg => ({
        role: msg.speaker === npc.name ? "assistant" : "user",
        content: msg.text
      }));

      // 调用手机端大模型API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mobile-llm", // 手机端大模型
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationContext,
            { role: "user", content: playerMessage }
          ],
          temperature: 0.8,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error("AI API request failed");
      }

      const data = await response.json();
      return data.response || "...";
    } catch (error) {
      console.error("AI dialogue generation failed:", error);
      // 降级到静态对话
      return this.getRandomStaticDialogue(dialogue);
    }
  }

  /**
   * 构建AI系统提示词
   */
  private buildSystemPrompt(
    npc: NPC,
    dialogue: NPCDialogue,
    playerName: string
  ): string {
    const basePrompt = `你是${npc.name}，一个在篮球游戏中的NPC角色。`;
    
    const contextPrompt = dialogue.aiContext 
      ? `\n\n角色设定：${dialogue.aiContext}`
      : "";

    const personalityPrompt = npc.aiPersonality
      ? `\n\n性格特点：${npc.aiPersonality}`
      : "";

    const instructionPrompt = `

对话规则：
1. 保持角色设定，用第一人称说话
2. 回复简短自然，不超过50字
3. 可以谈论篮球、训练、比赛相关话题
4. 如果玩家问及比赛，可以提供建议或鼓励
5. 保持友好和乐于助人的态度
6. 不要重复之前说过的话

玩家名字：${playerName}`;

    return basePrompt + contextPrompt + personalityPrompt + instructionPrompt;
  }

  /**
   * 获取随机静态对话
   */
  private getRandomStaticDialogue(dialogue: NPCDialogue): string {
    if (!dialogue.staticDialogues || dialogue.staticDialogues.length === 0) {
      return "你好！";
    }

    const randomIndex = Math.floor(Math.random() * dialogue.staticDialogues.length);
    return dialogue.staticDialogues[randomIndex];
  }

  /**
   * 创建默认对话
   */
  private createDefaultDialogue(npc: NPC): DialogueSession {
    return {
      npcId: npc.id,
      messages: [
        {
          speaker: npc.name,
          text: "你好！",
          timestamp: Date.now()
        }
      ],
      isActive: true
    };
  }

  /**
   * 保存对话历史
   */
  private saveToHistory(npcId: string, messages: DialogueMessage[]) {
    // 只保留最近20条消息
    const recentMessages = messages.slice(-20);
    this.conversationHistory.set(npcId, recentMessages);
  }

  /**
   * 结束对话
   */
  endDialogue() {
    if (this.currentSession) {
      this.currentSession.isActive = false;
      this.currentSession = null;
    }
  }

  /**
   * 获取当前对话会话
   */
  getCurrentSession(): DialogueSession | null {
    return this.currentSession;
  }

  /**
   * 清除NPC的对话历史
   */
  clearHistory(npcId: string) {
    this.conversationHistory.delete(npcId);
  }
}

