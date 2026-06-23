import { GlobalMessageConfig, GlobalMessageType } from "@spartacus/core";

export const customGlobalMessageConfig: GlobalMessageConfig = {
  globalMessages: {
    [GlobalMessageType.MSG_TYPE_WARNING]: {
      timeout: 0
    }
  },
}