/**
 * NPC市场系统 - 数据库Schema
 * 支持用户购买和定制NPC
 */

import { pgTable, text, integer, timestamp, boolean, jsonb, uuid, decimal } from "drizzle-orm/pg-core";

/**
 * NPC商品表 - 可购买的NPC列表
 */
export const npcMarketplace = pgTable("npc_marketplace", {
  id: uuid("id").primaryKey().defaultRandom(),
  npcId: text("npc_id").notNull().unique(), // NPC的唯一标识
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "student", "teacher", "coach", "vendor", "celebrity"
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(), // 基础价格
  premiumPrice: decimal("premium_price", { precision: 10, scale: 2 }), // 高级版价格（含AI定制）
  defaultPersonality: text("default_personality"), // 默认性格设定
  spriteSheet: text("sprite_sheet").notNull(),
  previewImage: text("preview_image"),
  isAvailable: boolean("is_available").default(true),
  stockLimit: integer("stock_limit"), // 库存限制（null表示无限）
  soldCount: integer("sold_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

/**
 * 用户拥有的NPC表
 */
export const userNpcs = pgTable("user_npcs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), // 关联用户
  npcMarketplaceId: uuid("npc_marketplace_id").notNull().references(() => npcMarketplace.id),
  npcId: text("npc_id").notNull(), // 实例化的NPC ID
  customName: text("custom_name"), // 用户自定义名称
  isPremium: boolean("is_premium").default(false), // 是否购买了高级版
  
  // AI定制配置
  aiConfig: jsonb("ai_config").$type<{
    enabled: boolean;
    modelType: "gpt-4" | "claude" | "gemini" | "mobile-llm";
    personalityPrompt: string;
    conversationStyle: "formal" | "casual" | "friendly" | "professional";
    specialTraits: string[];
    memoryEnabled: boolean;
  }>(),
  
  // 放置位置
  placement: jsonb("placement").$type<{
    mapId: string;
    x: number;
    y: number;
    movementPattern: "static" | "wander" | "patrol";
    patrolRoute?: { x: number; y: number }[];
  }>(),
  
  // 交互统计
  interactionCount: integer("interaction_count").default(0),
  lastInteractionAt: timestamp("last_interaction_at"),
  
  purchasedAt: timestamp("purchased_at").defaultNow(),
  isActive: boolean("is_active").default(true)
});

/**
 * NPC对话历史表
 */
export const npcConversations = pgTable("npc_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userNpcId: uuid("user_npc_id").notNull().references(() => userNpcs.id),
  userId: text("user_id").notNull(),
  messages: jsonb("messages").$type<Array<{
    speaker: string;
    text: string;
    timestamp: number;
  }>>(),
  sessionStartedAt: timestamp("session_started_at").defaultNow(),
  sessionEndedAt: timestamp("session_ended_at"),
  messageCount: integer("message_count").default(0)
});

/**
 * 地图扩展对象表 - 用户自定义的地图元素
 */
export const mapCustomObjects = pgTable("map_custom_objects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  mapId: text("map_id").notNull(),
  objectType: text("object_type").notNull(), // "decoration", "building", "interactive"
  objectData: jsonb("object_data").$type<{
    x: number;
    y: number;
    width: number;
    height: number;
    imagePath: string;
    interactable: boolean;
    customProperties?: Record<string, any>;
  }>(),
  isPurchased: boolean("is_purchased").default(false),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true)
});

/**
 * NPC预设人格模板表
 */
export const npcPersonalityTemplates = pgTable("npc_personality_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // "anime", "sports", "professional", "casual"
  promptTemplate: text("prompt_template").notNull(),
  conversationStyle: text("conversation_style"),
  exampleDialogues: jsonb("example_dialogues").$type<string[]>(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  isPublic: boolean("is_public").default(true),
  createdBy: text("created_by"), // 创建者（官方或用户）
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

/**
 * 地图元素市场表 - 可购买的地图装饰/建筑
 */
export const mapObjectMarketplace = pgTable("map_object_marketplace", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "decoration", "building", "facility", "landmark"
  objectType: text("object_type").notNull(),
  imagePath: text("image_path").notNull(),
  previewImage: text("preview_image"),
  defaultSize: jsonb("default_size").$type<{ width: number; height: number }>(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isInteractive: boolean("is_interactive").default(false),
  interactionConfig: jsonb("interaction_config").$type<{
    type: "dialogue" | "shop" | "minigame" | "portal";
    data?: Record<string, any>;
  }>(),
  isAvailable: boolean("is_available").default(true),
  soldCount: integer("sold_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

/**
 * 用户购买记录表
 */
export const userPurchases = pgTable("user_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  itemType: text("item_type").notNull(), // "npc", "map_object", "personality_template"
  itemId: uuid("item_id").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  status: text("status").default("completed"), // "pending", "completed", "refunded"
  purchasedAt: timestamp("purchased_at").defaultNow()
});

/**
 * 地图扩展槽位表 - 用户可以在地图上放置的对象数量限制
 */
export const userMapSlots = pgTable("user_map_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  mapId: text("map_id").notNull(),
  maxNpcs: integer("max_npcs").default(5), // 最多放置NPC数量
  maxObjects: integer("max_objects").default(10), // 最多放置装饰物数量
  currentNpcs: integer("current_npcs").default(0),
  currentObjects: integer("current_objects").default(0),
  isPremium: boolean("is_premium").default(false), // 高级用户有更多槽位
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

