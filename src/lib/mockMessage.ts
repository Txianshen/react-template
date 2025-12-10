// 从 chat_message.txt 解析的消息列表
export interface Message {
  run_id: string;
  type: string;
  data: {
    id: string;
    name: string;
    role: string;
    content: any;
    metadata: any;
    timestamp: string;
  };
}

// 解析后的消息列表，对于相同id的消息只保留最后一条
export const mockMessages: Message[] = [
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "user_message",
    data: {
      id: "5VfTTDPrp2SqRGFMkzzurm",
      name: "user",
      role: "user",
      content: "一个目标是aifeex.com",
      metadata: null,
      timestamp: "2025-12-09 17:23:37.438",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "gXwzDH7k27buoRo78VAEQA",
      name: "user",
      role: "user",
      content:
        "<system-hint>If the user's query is complex (e.g. programming a website, game or app), or requires a long chain of steps to complete (e.g. conduct research on a certain topic from different sources), you NEED to create a plan first by calling 'create_plan'. Otherwise, you can directly execute the user's query without planning.</system-hint>",
      metadata: null,
      timestamp: "2025-12-09 17:23:37.441",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "Hw3VG2VDgsD3i2ACtbGXsi",
      name: "Matrix-apitest-cc554d15-617b-4c81-9c43-cedf1002db10",
      role: "assistant",
      content: [
        {
          type: "text",
          text: "我注意到您再次提到了aifeex.com作为测试目标。根据之前的测试结果，该网站存在DNS解析异常问题，并探索可能的替代测试方法。",
        },
        {
          type: "tool_use",
          id: "call_81eabb79e75342d39c2c8c47",
          name: "create_plan",
          input: {
            name: "aifeex.com 重新评估与测试",
            description:
              "重新评估aifeex.com的可访问性状态，确认是否仍然存在DNS解析问题，并探索可能的替代测试方法。",
            expected_outcome:
              "确定aifeex.com当前的可访问性状态，并基于结果决定是否可以继续API安全测试或需要采取其他措施。",
            subtasks: [
              {
                name: "重新检查网站可访问性",
                description: "使用浏览器和网络工具重新检查aifeex.com的当前状态",
                expected_outcome: "确认aifeex.com当前是否可以正常访问",
              },
              {
                name: "分析DNS解析状态",
                description:
                  "详细分析aifeex.com的DNS解析情况，确认是否仍然解析到127.0.1.1",
                expected_outcome: "获取aifeex.com当前的DNS解析结果和IP地址信息",
              },
              {
                name: "探索替代访问方法",
                description: "尝试使用不同的网络环境或工具访问aifeex.com",
                expected_outcome: "确定是否存在可以成功访问aifeex.com的方法",
              },
              {
                name: "制定后续行动计划",
                description: "基于重新评估的结果，制定下一步的测试或沟通计划",
                expected_outcome:
                  "明确的后续行动方案，包括继续测试、等待修复或联系相关人员",
              },
            ],
          },
        },
      ],
      metadata: null,
      timestamp: "2025-12-09 17:23:37.445",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "F4d588yRVvDNz9ZVCY8xf8",
      name: "system",
      role: "system",
      content: [
        {
          type: "tool_result",
          id: "call_81eabb79e75342d39c2c8c47",
          name: "create_plan",
          output: [
            {
              type: "text",
              text: "Plan 'aifeex.com 重新评估与测试' created successfully.",
            },
          ],
        },
      ],
      metadata: null,
      timestamp: "2025-12-09 17:23:51.555",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "FSBNoqKpjP6uxxCgXCeAsR",
      name: "user",
      role: "user",
      content:
        "<system-hint>The current plan:\n```\n# aifeex.com 重新评估与测试\n**Description**: 重新评估aifeex.com的可访问性状态，确认是否仍然存在DNS解析问题，并探索可能的替代测试方法。\n**Expected Outcome**: 确定aifeex.com当前的可访问性状态，并基于结果决定是否可以继续API安全测试或需要采取其他措施。\n**State**: todo\n**Created At**: 2025-12-09 17:23:51.557\n## Subtasks\n- [ ] 重新检查网站可访问性\n- [ ] 分析DNS解析状态\n- [ ] 探索替代访问方法\n- [ ] 制定后续行动计划\n```\nYour options include:\n- Mark the first subtask as 'in_progress' by calling 'update_subtask_state' with subtask_idx=0 and state='in_progress', and start executing it.\n- If the first subtask is not executable, analyze why and what you can do to advance the plan, e.g. ask user for more information, revise the plan by calling 'revise_current_plan'.\n- If the user asks you to do something unrelated to the plan, prioritize the completion of user's query first, and then return to the plan afterward.\n- If the user no longer wants to perform the current plan, confirm with the user and call the 'finish_plan' function.\n</system-hint>",
      metadata: null,
      timestamp: "2025-12-09 17:23:51.557",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "gfzp5eJ3KC75X3JXerf7aN",
      name: "Matrix-apitest-cc554d15-617b-4c81-9c43-cedf1002db10",
      role: "assistant",
      content: [
        {
          type: "text",
          text: "我将开始重新评估aifeex.com的可访问性状态。首先执行第一个子任务：重新检查网站可访问性。\n\n",
        },
        {
          type: "tool_use",
          id: "call_dcad983906dc4cc2a34a3f0f",
          name: "update_subtask_state",
          input: {
            subtask_idx: 0,
            state: "in_progress",
          },
        },
      ],
      metadata: null,
      timestamp: "2025-12-09 17:23:51.580",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "QT5tRBdD8cMzhDu8yDh9eg",
      name: "system",
      role: "system",
      content: [
        {
          type: "tool_result",
          id: "call_dcad983906dc4cc2a34a3f0f",
          name: "update_subtask_state",
          output: [
            {
              type: "text",
              text: "Subtask at index 0, named '重新检查网站可访问性' is marked as 'in_progress' successfully. The plan state has been updated to 'in_progress'.",
            },
          ],
        },
      ],
      metadata: null,
      timestamp: "2025-12-09 17:23:57.335",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "hfvj6Wp8BfWddFLmeD7asD",
      name: "user",
      role: "user",
      content:
        "<system-hint>The current plan:\n```\n# aifeex.com 重新评估与测试\n**Description**: 重新评估aifeex.com的可访问性状态，确认是否仍然存在DNS解析问题，并探索可能的替代测试方法。\n**Expected Outcome**: 确定aifeex.com当前的可访问性状态，并基于结果决定是否可以继续API安全测试或需要采取其他措施。\n**State**: in_progress\n**Created At**: 2025-12-09 17:23:51.557\n## Subtasks\n- [ ] [WIP]重新检查网站可访问性\n- [ ] 分析DNS解析状态\n- [ ] 探索替代访问方法\n- [ ] 制定后续行动计划\n```\nNow the subtask at index 0, named '重新检查网站可访问性', is 'in_progress'. Its details are as follows:\n```\n- [ ] [WIP]重新检查网站可访问性\n\t- Created At: 2025-12-09 17:23:51.557\n\t- Description: 使用浏览器和网络工具重新检查aifeex.com的当前状态\n\t- Expected Outcome: 确认aifeex.com当前是否可以正常访问\n\t- State: in_progress\n```\nYour options include:\n- Go on execute the subtask and get the outcome.\n- Call 'finish_subtask' with the specific outcome if the subtask is finished.\n- Ask the user for more information if you need.\n- Revise the plan by calling 'revise_current_plan' if necessary.\n- If the user asks you to do something unrelated to the plan, prioritize the completion of user's query first, and then return to the plan afterward.</system-hint>",
      metadata: null,
      timestamp: "2025-12-09 17:23:57.336",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "3mZjaPsMqo6m7Nw8sYP2n3",
      name: "Matrix-apitest-cc554d15-617b-4c81-9c43-cedf1002db10",
      role: "assistant",
      content: [
        {
          type: "text",
          text: "我将重新检查aifeex.com的可访问性状态。首先启用必要的工具。\n\n",
        },
        {
          type: "tool_use",
          id: "call_2855e13fc721495199654bee",
          name: "reset_equipped_tools",
          input: {
            browser_use: true,
            terminal_use: true,
          },
        },
      ],
      metadata: null,
      timestamp: "2025-12-09 17:23:57.343",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "hRCxN7v9aQ3K4xCxzU52CM",
      name: "system",
      role: "system",
      content: [
        {
          type: "tool_result",
          id: "call_2855e13fc721495199654bee",
          name: "reset_equipped_tools",
          output: [
            {
              type: "text",
              text: "Active tool groups successfully: ['browser_use', 'terminal_use']. You MUST follow these notes to use the tools:\n<notes>## About terminal_use Tools\n1. Use create_terminal_session to create a new tmux session.\n2. Use interact_terminal_session to write commands or read outputs from the session.\n3. Use list_terminal_sessions to list all active sessions.  \n4. Use kill_terminal_session to kill a session when it is no longer required or you have finished your job.\n    \n## About browser_use Tools\n1. when page changed, you need to use `list_element` or `extract` tool to get latest page elements or content.\n    \n## About file_use Tools\n1. the file operation can only happen in file sandbox\n    \n## About proxy_use Tools\n\n    </notes>",
            },
          ],
        },
      ],
      metadata: null,
      timestamp: "2025-12-09 17:24:04.760",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "HQ3Kts9eWJ9QEEwooPnXo3",
      name: "user",
      role: "user",
      content:
        "<system-hint>The current plan:\n```\n# aifeex.com 重新评估与测试\n**Description**: 重新评估aifeex.com的可访问性状态，确认是否仍然存在DNS解析问题，并探索可能的替代测试方法。\n**Expected Outcome**: 确定aifeex.com当前的可访问性状态，并基于结果决定是否可以继续API安全测试或需要采取其他措施。\n**State**: in_progress\n**Created At**: 2025-12-09 17:23:51.557\n## Subtasks\n- [ ] [WIP]重新检查网站可访问性\n- [ ] 分析DNS解析状态\n- [ ] 探索替代访问方法\n- [ ] 制定后续行动计划\n```\nNow the subtask at index 0, named '重新检查网站可访问性', is 'in_progress'. Its details are as follows:\n```\n- [ ] [WIP]重新检查网站可访问性\n\t- Created At: 2025-12-09 17:23:51.557\n\t- Description: 使用浏览器和网络工具重新检查aifeex.com的当前状态\n\t- Expected Outcome: 确认aifeex.com当前是否可以正常访问\n\t- State: in_progress\n```\nYour options include:\n- Go on execute the subtask and get the outcome.\n- Call 'finish_subtask' with the specific outcome if the subtask is finished.\n- Ask the user for more information if you need.\n- Revise the plan by calling 'revise_current_plan' if necessary.\n- If the user asks you to do something unrelated to the plan, prioritize the completion of user's query first, and then return to the plan afterward.</system-hint>",
      metadata: null,
      timestamp: "2025-12-09 17:24:04.761",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "m8gpNT6xaZoh4yM8JcZE4x",
      name: "Matrix-apitest-cc554d15-617b-4c81-9c43-cedf1002db10",
      role: "assistant",
      content: [
        {
          type: "text",
          text: "我将重新检查aifeex.com的可访问性状态。首先使用浏览器尝试访问网站。\n\n",
        },
        {
          type: "tool_use",
          id: "call_062ec1c4ce8f4221979d2223",
          name: "navigate",
          input: {
            url: "https://aifeex.com",
          },
        },
      ],
      metadata: null,
      timestamp: "2025-12-09 17:24:04.768",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "FQjSPxHBvWppXDmW9LQw9r",
      name: "system",
      role: "system",
      content: [
        {
          type: "tool_result",
          id: "call_062ec1c4ce8f4221979d2223",
          name: "navigate",
          output: [
            {
              type: "text",
              text: "<system-info>The tool call has been interrupted by the user.</system-info>",
            },
          ],
        },
      ],
      metadata: null,
      timestamp: "2025-12-09 17:24:10.554",
    },
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message_done",
  },
  {
    run_id: "cc554d15-617b-4c81-9c43-cedf1002db10",
    type: "agent_message",
    data: {
      id: "hmWNKhC7GBbkGjGfoCTkP9",
      name: "Matrix-apitest-cc554d15-617b-4c81-9c43-cedf1002db10",
      role: "assistant",
      content: "I noticed that you have interrupted me. What can I do for you?",
      metadata: {
        is_interrupted: true,
      },
      timestamp: "2025-12-09 17:24:23.548",
    },
  },
];
