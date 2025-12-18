import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { History, MessageItem } from "@/types/chat";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 根据消息ID递归构建消息列表
 * @param history 聊天历史对象
 * @param messageId 消息ID
 * @returns 消息列表数组
 */
export function createMessagesList(
  history: History,
  messageId: string | null
): MessageItem[] {
  if (messageId === null) {
    return [];
  }

  const message = history.messages[messageId];
  if (message?.parentId) {
    return [...createMessagesList(history, message.parentId), message];
  } else {
    return [message];
  }
}

/**
 * 将消息列表转换为聊天历史记录
 * @param messages 消息列表
 * @returns 聊天历史记录
 */
export function convertMessagesToHistory(messages: MessageItem[]): History {
  const history: History = {
    messages: {},
    currentId: null,
  };

  let parentMessageId: string | null = null;
  let messageId: string | null = null;

  for (const messageData of messages) {
    messageId = nanoid();

    if (parentMessageId !== null) {
      const parentMessage = history.messages[parentMessageId];
      if (parentMessage) {
        parentMessage.childrenIds = [...parentMessage.childrenIds, messageId];
      }
    }

    history.messages[messageId] = {
      ...messageData,
      id: messageId,
      parentId: parentMessageId,
      childrenIds: [],
      // done: false,
    };

    parentMessageId = messageId;
  }

  history.currentId = messageId;
  return history;
}

/**
 * Parses SEEDEMU JSON data into G6 compatible Nodes and Edges.
 * @param {Array} jsonArray - The raw JSON array from SEEDEMU.
 * @returns {Object} { nodes: Array, edges: Array }
 */
function parseSeedEmuToTopology(jsonArray) {
  const nodesMap = new Map();
  const edges = [];

  // Configuration mapping
  const config = {
    BorderRouter: { color: "#FF7675", type: "diamond", size: 35 },
    Host: { color: "#74B9FF", type: "rect", size: [40, 25] },
    "Route Server": { color: "#FFEAA7", type: "circle", size: 35 },
    Network: { color: "#55EFC4", type: "circle", size: 15 },
    IX: { color: "#A29BFE", type: "circle", size: 45 },
  };

  const addNode = (id, label, role, meta = {}, isNetwork = false) => {
    if (!nodesMap.has(id)) {
      let styleConfig;

      if (isNetwork) {
        // Check if it's an IX or local LAN
        const isIX = label.startsWith("ix");
        styleConfig = isIX ? config.IX : config.Network;
        if (isIX) label = "IX: " + label;
      } else {
        // Device
        styleConfig = config[role] || config.Host;
      }

      // G6 Node Object
      nodesMap.set(id, {
        id: id,
        label: label,
        type: styleConfig.type,
        size: styleConfig.size,
        style: {
          fill: styleConfig.color,
          stroke: "#fff",
          lineWidth: 2,
          shadowColor: "#666",
          shadowBlur: 10,
        },
        labelCfg: {
          position: "bottom",
          offset: 5,
          style: {
            fill: "#fff", // White text for dark bg
            fontSize: 11,
          },
        },
        // Store original meta for tooltip
        metaData: meta,
      });
    }
  };

  jsonArray.forEach((container) => {
    if (!container.meta || !container.meta.emulatorInfo) return;

    const info = container.meta.emulatorInfo;
    const asn = info.asn;
    const name = info.name;
    const role = info.role;
    const containerId = container.Id;

    // 1. Create Device Node
    const deviceLabel = `${name}\n(AS${asn})`;
    addNode(containerId, deviceLabel, role, info, false);

    // 2. Create Network Nodes & Edges
    if (info.nets && Array.isArray(info.nets)) {
      info.nets.forEach((net) => {
        const netName = net.name;
        const ip = net.address;

        // Determine Network ID scope
        let networkNodeId, networkLabel;
        if (netName.startsWith("ix")) {
          networkNodeId = `global_${netName}`;
          networkLabel = netName;
        } else {
          networkNodeId = `as${asn}_${netName}`;
          networkLabel = `AS${asn}-${netName}`;
        }

        // Add Network Node
        addNode(
          networkNodeId,
          networkLabel,
          "Network",
          { type: "network", name: netName },
          true
        );

        // Add Edge (G6 uses source/target)
        const ipLabel = ip.split("/")[0];
        edges.push({
          source: containerId,
          target: networkNodeId,
          label: ipLabel,
          style: {
            stroke: "#777",
            lineWidth: 1,
            endArrow: false,
          },
          labelCfg: {
            style: {
              fill: "#aaa",
              fontSize: 9,
              background: {
                fill: "#222",
                padding: [2, 2, 2, 2],
              },
            },
            autoRotate: true,
          },
        });
      });
    }
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges: edges,
  };
}
