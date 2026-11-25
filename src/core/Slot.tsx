import { createContext, useContext, type ReactNode } from 'react';
import type { SlotName } from '../shared/slots';

type SlotRenderer = (name: SlotName) => ReactNode;

const SlotContext = createContext<SlotRenderer>(() => null);

export const SlotProvider = SlotContext.Provider;

/** An empty-by-default integration point. Renders nothing unless something is plugged in. */
export function Slot({ name }: { name: SlotName }) {
  const render = useContext(SlotContext);
  return <>{render(name)}</>;
}
