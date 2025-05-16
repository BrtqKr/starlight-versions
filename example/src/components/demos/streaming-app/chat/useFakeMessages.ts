import { useEffect, useState } from "react";
import type { Message } from "./ChatEntry";

const normalizedStart: [number, Message][] = [
  [0, { id: 0, text: "Hey team, quick check: are we good for today’s sprint?" }],
  [100, { id: 1, text: "Yep, just finishing up." }],
  [200, { id: 2, text: "Checking last commits now. Any concerns?" }],
  [300, { id: 3, text: "Looks alright, need any assistance?" }],
  [400, { id: 4, text: "I’m managing fine, thanks though!" }],
  [500, { id: 5, text: "Okay. What’s the status on backend issues?" }],
  [600, { id: 6, text: "Fixed the bug, just one final test left." }],
  [700, { id: 7, text: "Good on this end, wrapping up the integration." }],
  [800, { id: 8, text: "Setting up the final build environment." }],
  [900, { id: 9, text: "Almost done, just a few more minutes." }],
  [1000, { id: 10, text: "Monitoring the build, looking okay so far." }],
  [1100, { id: 11, text: "Any final checks or issues needing attention?" }],
  [1200, { id: 12, text: "Finished the updates, ready for review." }],
  [1600, { id: 13, text: "Going through the changes now." }],
  [2200, { id: 14, text: "All looks set from this side." }],
  [2700, { id: 15, text: "Noticed any issues with the deployment yet?" }],
  [3200, { id: 16, text: "Some slight server timeouts earlier, but all clear now." }],
  [3450, { id: 17, text: "Stability confirmed. Proceeding with the next steps." }],
  [4000, { id: 18, text: "Excellent, starting to prepare demo with the client." }],
  [4600, { id: 19, text: "Has anyone checked if the latest data is ready?" }],
  [5200, { id: 20, text: `Data's integrated and updated for the demo.` }],
];

export function useFakeMessages(): Message[] {
  const [messages, setMessages] = useState<Message[]>([]);
  const [index, setIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < normalizedStart.length) {
        const currentLoopIteration = loopCount * normalizedStart.length;
        const newMessage = {
          ...normalizedStart[index][1],
          id: normalizedStart[index][1].id + currentLoopIteration,
        };
        setMessages((oldMessages) => [...oldMessages.slice(-10), newMessage]);
        setIndex(index + 1);
      } else {
        setIndex(0);
        setLoopCount(loopCount + 1);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [index, loopCount]);

  return messages;
}
