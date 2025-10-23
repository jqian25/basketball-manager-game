/**
 * 东京城市地图
 */

import type { CityMap, CityMapDistrict, Portal, NPC } from "../../types/openWorld";

export const TOKYO_CITY_MAP: CityMap = {
  metadata: {
    id: "city-tokyo",
    name: "东京",
    level: "city",
    width: 120,
    height: 100,
    tileSize: 32,
    backgroundImage: "/maps/city/tokyo-streets.png",
    backgroundMusic: "/music/city-theme.mp3"
  },

  tiles: [],
  objects: [],

  // 城市NPC
  npcs: [
    {
      id: "npc-city-guide",
      type: "npc",
      name: "城市向导",
      x: 52,
      y: 52,
      width: 1,
      height: 1,
      spriteSheet: "/characters/npc-guide.png",
      imagePath: "/characters/npc-guide.png",
      interactable: true,
      dialogueId: "city-guide-dialogue",
      movementPattern: "static",
      aiPersonality: "友好热情，熟悉东京的各个地方，喜欢帮助新来的人"
    },
    {
      id: "npc-street-vendor",
      type: "npc",
      name: "街边小贩",
      x: 48,
      y: 55,
      width: 1,
      height: 1,
      spriteSheet: "/characters/npc-vendor.png",
      imagePath: "/characters/npc-vendor.png",
      interactable: true,
      dialogueId: "vendor-dialogue",
      movementPattern: "static",
      aiPersonality: "精明能干，喜欢聊天，对篮球也有一定了解"
    },
    {
      id: "npc-student-1",
      type: "npc",
      name: "路过的学生",
      x: 55,
      y: 48,
      width: 1,
      height: 1,
      spriteSheet: "/characters/student-walking.png",
      imagePath: "/characters/student-walking.png",
      interactable: true,
      dialogueId: "student-dialogue",
      movementPattern: "wander",
      aiPersonality: "年轻活泼，热爱篮球，梦想成为职业球员"
    }
  ],

  // 场景入口
  portals: [
    {
      id: "portal-shohoku-high",
      type: "portal",
      x: 60,
      y: 40,
      width: 5,
      height: 5,
      imagePath: "/maps/city/school-building.png",
      interactable: true,
      targetMapId: "scene-shohoku-school",
      targetX: 30,
      targetY: 50,
      requiresInteraction: true,
      transitionEffect: "fade",
      data: {
        schoolName: "湘北高中",
        description: "著名的篮球强校"
      }
    },
    {
      id: "portal-public-court",
      type: "portal",
      x: 35,
      y: 60,
      width: 4,
      height: 4,
      imagePath: "/maps/city/public-court.png",
      interactable: true,
      targetMapId: "scene-public-court",
      targetX: 25,
      targetY: 25,
      requiresInteraction: true,
      transitionEffect: "fade",
      data: {
        courtName: "公共篮球场",
        description: "开放的街头篮球场"
      }
    },
    {
      id: "portal-sports-center",
      type: "portal",
      x: 70,
      y: 55,
      width: 6,
      height: 6,
      imagePath: "/maps/city/sports-center.png",
      interactable: true,
      targetMapId: "scene-sports-center",
      targetX: 40,
      targetY: 40,
      requiresInteraction: true,
      transitionEffect: "fade",
      data: {
        facilityName: "市立体育中心",
        description: "专业的体育训练设施"
      }
    },
    {
      id: "portal-back-to-world",
      type: "portal",
      x: 50,
      y: 95,
      width: 3,
      height: 2,
      imagePath: "/maps/city/exit-sign.png",
      interactable: true,
      targetMapId: "world-japan",
      targetX: 45,
      targetY: 35,
      requiresInteraction: true,
      transitionEffect: "zoom",
      data: {
        description: "返回世界地图"
      }
    }
  ],

  basketballCourts: [],

  spawnPoint: { x: 50, y: 50 },

  // 城市名称
  cityName: "东京",

  // 城市区域
  districts: [
    {
      id: "district-shibuya",
      name: "涩谷区",
      type: "commercial",
      bounds: { x: 40, y: 45, width: 25, height: 20 }
    },
    {
      id: "district-shinjuku",
      name: "新宿区",
      type: "commercial",
      bounds: { x: 65, y: 40, width: 30, height: 25 }
    },
    {
      id: "district-residential",
      name: "住宅区",
      type: "residential",
      bounds: { x: 20, y: 30, width: 20, height: 30 }
    },
    {
      id: "district-school",
      name: "学校区",
      type: "school",
      bounds: { x: 55, y: 35, width: 15, height: 15 }
    },
    {
      id: "district-sports",
      name: "体育区",
      type: "sports",
      bounds: { x: 65, y: 50, width: 20, height: 20 }
    },
    {
      id: "district-park",
      name: "公园区",
      type: "park",
      bounds: { x: 30, y: 55, width: 15, height: 20 }
    }
  ],

  // 地标建筑
  landmarks: [
    {
      id: "landmark-tokyo-tower",
      type: "decoration",
      x: 75,
      y: 45,
      width: 3,
      height: 5,
      imagePath: "/maps/city/tokyo-tower.png",
      interactable: false,
      data: {
        name: "东京塔",
        description: "东京的标志性建筑"
      }
    },
    {
      id: "landmark-station",
      type: "decoration",
      x: 48,
      y: 70,
      width: 8,
      height: 6,
      imagePath: "/maps/city/train-station.png",
      interactable: false,
      data: {
        name: "东京站",
        description: "主要的交通枢纽"
      }
    }
  ]
};

