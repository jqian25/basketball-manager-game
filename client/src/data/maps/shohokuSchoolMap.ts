/**
 * 湘北高中场景地图
 */

import type { SceneMap, MapTile, NPC } from "../../types/openWorld";

// 创建地图瓦片网格
function createTileGrid(width: number, height: number): MapTile[][] {
  const tiles: MapTile[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: MapTile[] = [];
    for (let x = 0; x < width; x++) {
      // 默认为草地
      let type: MapTile["type"] = "grass";
      let walkable = true;
      
      // 建筑物区域（不可行走）
      if ((x >= 10 && x <= 25 && y >= 5 && y <= 15) || // 教学楼
          (x >= 30 && x <= 45 && y >= 5 && y <= 20)) { // 体育馆
        type = "building";
        walkable = false;
      }
      
      // 道路（可行走）
      if ((x >= 5 && x <= 50 && y >= 18 && y <= 20) || // 横向道路
          (x >= 27 && x <= 29 && y >= 5 && y <= 35)) { // 纵向道路
        type = "road";
        walkable = true;
      }
      
      // 篮球场（可行走）
      if (x >= 32 && x <= 43 && y >= 25 && y <= 35) {
        type = "court";
        walkable = true;
      }
      
      row.push({
        x,
        y,
        type,
        walkable,
        elevation: 0
      });
    }
    tiles.push(row);
  }
  
  return tiles;
}

export const SHOHOKU_SCHOOL_MAP: SceneMap = {
  metadata: {
    id: "scene-shohoku-school",
    name: "湘北高中",
    level: "scene",
    width: 60,
    height: 45,
    tileSize: 32,
    backgroundImage: "/maps/scene/school-ground.png",
    backgroundMusic: "/music/school-theme.mp3"
  },

  tiles: createTileGrid(60, 45),

  objects: [
    // 教学楼入口
    {
      id: "obj-school-entrance",
      type: "decoration",
      x: 17,
      y: 15,
      width: 2,
      height: 1,
      imagePath: "/maps/scene/school-entrance.png",
      interactable: false
    },
    // 体育馆入口
    {
      id: "obj-gym-entrance",
      type: "decoration",
      x: 37,
      y: 20,
      width: 2,
      height: 1,
      imagePath: "/maps/scene/gym-entrance.png",
      interactable: false
    },
    // 长凳
    {
      id: "obj-bench-1",
      type: "decoration",
      x: 15,
      y: 22,
      width: 1,
      height: 1,
      imagePath: "/kairo/facilities/bench.png",
      interactable: false
    },
    {
      id: "obj-bench-2",
      type: "decoration",
      x: 40,
      y: 22,
      width: 1,
      height: 1,
      imagePath: "/kairo/facilities/bench.png",
      interactable: false
    },
    // 自动贩卖机
    {
      id: "obj-vending-1",
      type: "decoration",
      x: 20,
      y: 22,
      width: 1,
      height: 1,
      imagePath: "/kairo/facilities/vending-machine.png",
      interactable: true,
      data: {
        shopType: "vending",
        items: ["water", "juice", "snack"]
      }
    }
  ],

  // NPC角色
  npcs: [
    {
      id: "npc-coach-anzai",
      type: "npc",
      name: "安西教练",
      x: 38,
      y: 23,
      width: 1,
      height: 1,
      spriteSheet: "/characters/coach-standing.png",
      imagePath: "/characters/coach-standing.png",
      interactable: true,
      dialogueId: "coach-anzai-dialogue",
      movementPattern: "static",
      aiPersonality: "睿智慈祥的老教练，说话简洁有力，善于用简单的话语点醒球员。喜欢说'放弃的话，比赛就结束了'这类励志的话。"
    },
    {
      id: "npc-student-hanamichi",
      type: "npc",
      name: "樱木花道",
      x: 35,
      y: 30,
      width: 1,
      height: 1,
      spriteSheet: "/characters/student-walking.png",
      imagePath: "/characters/student-walking.png",
      interactable: true,
      dialogueId: "hanamichi-dialogue",
      movementPattern: "wander",
      aiPersonality: "热血冲动的篮球新手，自称'天才'，对篮球充满热情但技术还不成熟。说话直率，有时有点自大但内心善良。"
    },
    {
      id: "npc-student-rukawa",
      type: "npc",
      name: "流川枫",
      x: 40,
      y: 30,
      width: 1,
      height: 1,
      spriteSheet: "/characters/player-sf-idle.png",
      imagePath: "/characters/player-sf-idle.png",
      interactable: true,
      dialogueId: "rukawa-dialogue",
      movementPattern: "static",
      aiPersonality: "冷酷的篮球天才，话很少，专注于训练和比赛。对篮球极其认真，不喜欢闲聊，回答通常很简短。"
    },
    {
      id: "npc-manager-ayako",
      type: "npc",
      name: "彩子",
      x: 36,
      y: 27,
      width: 1,
      height: 1,
      spriteSheet: "/characters/cheerleader-idle.png",
      imagePath: "/characters/cheerleader-idle.png",
      interactable: true,
      dialogueId: "ayako-dialogue",
      movementPattern: "patrol",
      aiPersonality: "球队经理，认真负责，对球员们很关心。说话温柔但也会严厉地督促球员训练。熟悉每个球员的情况。"
    },
    {
      id: "npc-janitor",
      type: "npc",
      name: "清洁工大叔",
      x: 25,
      y: 22,
      width: 1,
      height: 1,
      spriteSheet: "/characters/staff-cleaning.png",
      imagePath: "/characters/staff-cleaning.png",
      interactable: true,
      dialogueId: "janitor-dialogue",
      movementPattern: "patrol",
      aiPersonality: "学校的老清洁工，见证了很多届学生的成长。说话亲切，喜欢聊些学校的趣事和历史。"
    }
  ],

  // 传送门
  portals: [
    {
      id: "portal-back-to-city",
      type: "portal",
      x: 28,
      y: 44,
      width: 2,
      height: 1,
      imagePath: "/maps/scene/exit-gate.png",
      interactable: true,
      targetMapId: "city-tokyo",
      targetX: 60,
      targetY: 40,
      requiresInteraction: true,
      transitionEffect: "fade",
      data: {
        description: "返回东京市区"
      }
    }
  ],

  // 篮球场入口
  basketballCourts: [
    {
      id: "court-shohoku-main",
      type: "basketball_court",
      x: 37,
      y: 32,
      width: 3,
      height: 2,
      imagePath: "/maps/scene/court-entrance.png",
      interactable: true,
      courtId: "shohoku-main-court",
      courtName: "湘北主球场",
      difficulty: "normal",
      requiresRegistration: true,
      data: {
        description: "进入篮球场开始比赛"
      }
    }
  ],

  spawnPoint: { x: 28, y: 40 },

  sceneName: "湘北高中",
  sceneType: "school",
  interiorLighting: false,
  weatherEffect: "sunny"
};

