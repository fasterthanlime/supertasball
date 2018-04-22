import { Expense } from "./types";
import { actions } from "./actions";

const _ = (e: Expense) => e;

export const expenses = {
  PlayPinball: _({
    label: "Play pinball",
    cost: 5,
    action: () => actions.playPinball({}),
  }),
  BuyMoreROM: _({
    label: "Buy more ROM",
    cost: 480,
    action: () => actions.romUpgrade({ sizeDelta: 4 }),
  }),
  BuyFasterCPU: _({
    label: "Buy a faster CPU",
    cost: 1200,
    action: () => actions.cpuUpgrade({ freqDelta: 1 }),
  }),
};
