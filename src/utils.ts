export const memoize = <R, T extends (...args: any[]) => R>(func: T): T => {
  const memory = new Map<string, R>();

  const newFunc = (...args: any[]) => {
    if (!memory.get(args.join())) {
      memory.set(args.join(), func(...args));
    }

    return memory.get(args.join());
  };

  return newFunc as T;
};
