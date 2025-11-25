"use client";

import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";
import type { ToolUIPart } from "ai";

interface OptionsMessageProps {
  content: string;
  options: Array<{ value: string; label: string }>;
  status?: ToolUIPart["state"];
  onOptionSelect?: (value: string) => void;
}

export const OptionsMessage = ({
  content,
  options,
  status = "approval-requested",
  onOptionSelect,
}: OptionsMessageProps) => {
  return (
    <Confirmation approval={{ id: nanoid() }} state={status}>
      <ConfirmationTitle>
        <ConfirmationRequest>{content}</ConfirmationRequest>
        <ConfirmationAccepted>
          <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
          <span>您已批准此操作</span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <XIcon className="size-4 text-destructive" />
          <span>您已拒绝此操作</span>
        </ConfirmationRejected>
      </ConfirmationTitle>
      <ConfirmationActions>
        {options.map((option, optionIndex) => (
          <ConfirmationAction
            key={optionIndex}
            onClick={() => {
              onOptionSelect?.(option.value);
            }}
            disabled={status !== "approval-requested"}
          >
            {option.label}
          </ConfirmationAction>
        ))}
      </ConfirmationActions>
    </Confirmation>
  );
};

export default OptionsMessage;
