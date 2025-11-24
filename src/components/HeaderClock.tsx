import { useEffect, useState } from 'react';

export const HeaderClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-30 flex flex-col items-end text-slate-500 dark:text-slate-400 hidden md:flex">
      <div className="text-2xl font-bold font-mono text-slate-800 dark:text-white leading-none">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-xs font-medium uppercase tracking-wider mt-1 opacity-80">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};
