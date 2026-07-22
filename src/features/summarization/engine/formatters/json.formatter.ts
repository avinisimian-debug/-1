import type { SummaryFormatter } from "../../types";

export const jsonFormatter: SummaryFormatter = {
  format(document) {
    return JSON.stringify(document, null, 2);
  },
};
