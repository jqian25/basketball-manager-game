/**
 * 开放世界地图系统 - 类型定义
 * 支持多层级地图：世界地图 → 城市地图 → 场景地图
 */

// ==================== 地图层级 ====================

export type MapLevel = "world" | "city" | "scene";

export interface MapMetadata {
  id: string;
  name: string;
  level: MapLevel;
  width: number; // 格子宽度
  height: number; // 格子高度
  tileSize: number; // 每个格子的像素大小
  backgroundImage?: string;
  backgroundMusic?: string;
}

// ==================== 地图瓦片 ====================

export type TileType = 
  | "ground" 
  | "water" 
  | "grass" 
  | "road" 
  | "building" 
  | "wall" 
  | "door"
  | "court"; // 篮球场

export interface MapTile {
  x: number;
  y: number;
  type: TileType;
  walkable: boolean;
  imagePath?: string;
  elevation?: number; // 高度层级（用于立体效果）
}

// ==================== 地图对象 ====================

export type MapObjectType =
  | "npc"
  | "portal" // 传送门/场景切换点
  | "item"
  | "decoration"
  | "basketball_court"; // 篮球场入口

export interface MapObject {
  id: string;
  type: MapObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  imagePath: string;
  interactable: boolean;
  data?: any; // 特定对象的额外数据
}

// ==================== NPC系统 ====================

export interface NPC extends MapObject {
  type: "npc";
  name: string;
  spriteSheet: string;
  dialogueId?: string;
  movementPattern?: NPCMovementPattern;
  aiPersonality?: string; // AI对话的人格设定
  role?: string; // NPC角色（如：教练、球员、商店老板等）
}

export type NPCMovementPattern =
  | "static" // 静止不动
  | "wander" // 随机游荡
  | "patrol" // 巡逻路线
  | "follow"; // 跟随玩家

export interface NPCDialogue {
  id: string;
  npcId: string;
  useAI: boolean; // 是否使用大模型生成对话
  staticDialogues?: string[]; // 静态对话（不使用AI时）
  aiContext?: string; // AI对话的上下文设定
  npcRole?: string; // NPC角色描述（用于AI对话生成）
}

// ==================== 传送门/场景切换 ====================

export interface Portal extends MapObject {
  type: "portal";
  targetMapId: string;
  targetX: number;
  targetY: number;
  requiresInteraction: boolean; // 是否需要按键交互
  transitionEffect?: "fade" | "slide" | "zoom";
}

// ==================== 篮球场入口 ====================

export interface BasketballCourtEntrance extends MapObject {
  type: "basketball_court";
  courtId: string;
  courtName: string;
  difficulty: "easy" | "normal" | "hard" | "expert";
  requiresRegistration: boolean; // 是否需要注册用户
}

// ==================== 完整地图定义 ====================

export interface GameMap {
  metadata: MapMetadata;
  tiles: MapTile[][];
  objects: MapObject[];
  npcs: NPC[];
  portals: Portal[];
  basketballCourts: BasketballCourtEntrance[];
  spawnPoint: { x: number; y: number }; // 玩家出生点
}

// ==================== 玩家角色 ====================

export interface PlayerCharacter {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  speed: number;
  spriteSheet: string;
  currentAnimation: "idle" | "walking" | "running";
  currentMapId: string;
}

// ==================== 相机系统 ====================

export interface Camera {
  x: number; // 相机中心X坐标
  y: number; // 相机中心Y坐标
  zoom: number; // 缩放级别
  followTarget?: string; // 跟随目标ID（通常是玩家）
}

// ==================== 输入控制 ====================

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean; // 交互键（空格或Enter）
  run: boolean; // 奔跑键（Shift）
  menu: boolean; // 菜单键（ESC）
}

// ==================== 碰撞检测 ====================

export interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ==================== 地图加载器 ====================

export interface MapLoader {
  loadMap(mapId: string): Promise<GameMap>;
  unloadMap(mapId: string): void;
  preloadMap(mapId: string): Promise<void>;
}

// ==================== 世界地图特定 ====================

export interface WorldMapRegion {
  id: string;
  name: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  cities: string[]; // 该区域包含的城市ID
  unlocked: boolean;
}

export interface WorldMap extends GameMap {
  regions: WorldMapRegion[];
}

// ==================== 城市地图特定 ====================

export interface CityMapDistrict {
  id: string;
  name: string;
  type: "residential" | "commercial" | "school" | "sports" | "park";
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CityMap extends GameMap {
  cityName: string;
  districts: CityMapDistrict[];
  landmarks: MapObject[]; // 地标建筑
}

// ==================== 场景地图特定 ====================

export interface SceneMap extends GameMap {
  sceneName: string;
  sceneType: "school" | "gym" | "park" | "street" | "indoor";
  interiorLighting?: boolean;
  weatherEffect?: "none" | "rain" | "snow" | "sunny";
}

