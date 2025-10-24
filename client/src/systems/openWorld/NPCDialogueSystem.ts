/**
 * NPC对话系统 - 集成Manus LLM
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
  private trpcClient: any; // tRPC客户端

  constructor(trpcClient?: any) {
    this.trpcClient = trpcClient;
  }

  /**
   * 设置tRPC客户端
   */
  setTRPCClient(client: any) {
    this.trpcClient = client;
  }

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

    if (dialogue.useAI && this.trpcClient) {
      // 使用Manus LLM生成对话
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

    if (dialogue.useAI && this.trpcClient) {
      // 使用Manus LLM生成回复
      const npc = { 
        id: npcId, 
        name: dialogue.npcId,
        role: dialogue.npcRole || "NPC",
        aiPersonality: dialogue.aiContext || "友好热情"
      } as NPC;
      
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
   * 使用Manus LLM生成对话回复
   */
  private async generateAIResponse(
    npc: NPC,
    dialogue: NPCDialogue,
    playerName: string,
    playerMessage: string,
    history: DialogueMessage[]
  ): Promise<string> {
    try {
      if (!this.trpcClient) {
        throw new Error("tRPC client not initialized");
      }

      // 构建对话历史
      const conversationHistory = history.slice(-10).map(msg => ({
        role: msg.speaker === npc.name ? "assistant" as const : "user" as const,
        content: msg.text
      }));

      // 调用tRPC的NPC对话接口
      const result = await this.trpcClient.ai.npcChat.mutate({
        npcName: npc.name,
        npcRole: npc.role || dialogue.npcRole || "篮球俱乐部成员",
        npcPersonality: npc.aiPersonality || dialogue.aiContext || "友好热情，乐于助人",
        message: playerMessage,
        history: conversationHistory
      });

      return result.reply || "...";
    } catch (error) {
      console.error("AI dialogue generation failed:", error);
      // 降级到静态对话
      return this.getRandomStaticDialogue(dialogue);
    }
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

