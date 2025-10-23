/**
 * 世界地图 - 海域和日本
 */

import type { WorldMap, WorldMapRegion, Portal } from "../../types/openWorld";

export const WORLD_MAP: WorldMap = {
  metadata: {
    id: "world-japan",
    name: "日本列岛",
    level: "world",
    width: 100,
    height: 80,
    tileSize: 32,
    backgroundImage: "/maps/world/japan-ocean.png",
    backgroundMusic: "/music/world-map-theme.mp3"
  },

  // 世界地图的瓦片（简化版，主要用于显示）
  tiles: [],

  // 地图对象
  objects: [],

  // NPC（世界地图通常没有NPC）
  npcs: [],

  // 传送门/城市入口
  portals: [
    {
      id: "portal-tokyo",
      type: "portal",
      x: 45,
      y: 35,
      width: 3,
      height: 3,
      imagePath: "/maps/world/city-icon-tokyo.png",
      interactable: true,
      targetMapId: "city-tokyo",
      targetX: 50,
      targetY: 50,
      requiresInteraction: true,
      transitionEffect: "zoom",
      data: {
        cityName: "东京",
        description: "日本的首都，现代化大都市"
      }
    },
    {
      id: "portal-osaka",
      type: "portal",
      x: 38,
      y: 42,
      width: 3,
      height: 3,
      imagePath: "/maps/world/city-icon-osaka.png",
      interactable: true,
      targetMapId: "city-osaka",
      targetX: 50,
      targetY: 50,
      requiresInteraction: true,
      transitionEffect: "zoom",
      data: {
        cityName: "大阪",
        description: "关西地区的经济中心",
        locked: true // 需要解锁
      }
    },
    {
      id: "portal-yokohama",
      type: "portal",
      x: 47,
      y: 36,
      width: 2,
      height: 2,
      imagePath: "/maps/world/city-icon-yokohama.png",
      interactable: true,
      targetMapId: "city-yokohama",
      targetX: 50,
      targetY: 50,
      requiresInteraction: true,
      transitionEffect: "zoom",
      data: {
        cityName: "横滨",
        description: "港口城市",
        locked: true
      }
    },
    {
      id: "portal-kyoto",
      type: "portal",
      x: 40,
      y: 40,
      width: 2,
      height: 2,
      imagePath: "/maps/world/city-icon-kyoto.png",
      interactable: true,
      targetMapId: "city-kyoto",
      targetX: 50,
      targetY: 50,
      requiresInteraction: true,
      transitionEffect: "zoom",
      data: {
        cityName: "京都",
        description: "古都，文化名城",
        locked: true
      }
    }
  ],

  // 篮球场（世界地图没有）
  basketballCourts: [],

  // 玩家出生点
  spawnPoint: { x: 45, y: 35 },

  // 世界地图区域
  regions: [
    {
      id: "region-kanto",
      name: "关东地区",
      bounds: { x: 42, y: 30, width: 15, height: 15 },
      cities: ["city-tokyo", "city-yokohama"],
      unlocked: true
    },
    {
      id: "region-kansai",
      name: "关西地区",
      bounds: { x: 35, y: 38, width: 12, height: 12 },
      cities: ["city-osaka", "city-kyoto"],
      unlocked: false
    },
    {
      id: "region-chubu",
      name: "中部地区",
      bounds: { x: 38, y: 32, width: 10, height: 12 },
      cities: [],
      unlocked: false
    },
    {
      id: "region-tohoku",
      name: "东北地区",
      bounds: { x: 42, y: 15, width: 12, height: 15 },
      cities: [],
      unlocked: false
    },
    {
      id: "region-kyushu",
      name: "九州地区",
      bounds: { x: 28, y: 48, width: 12, height: 15 },
      cities: [],
      unlocked: false
    }
  ]
};

/**
 * 获取已解锁的城市
 */
export function getUnlockedCities(): Portal[] {
  return WORLD_MAP.portals.filter(portal => {
    return !portal.data?.locked;
  });
}

/**
 * 解锁城市
 */
export function unlockCity(cityId: string) {
  const portal = WORLD_MAP.portals.find(p => p.targetMapId === cityId);
  if (portal && portal.data) {
    portal.data.locked = false;
  }
}

