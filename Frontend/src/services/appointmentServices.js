export const calculateQueue = (timeSlot) => {
  const seed = timeSlot
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const queueNumber = (seed % 25) + 1;
  const estimatedMinutes = queueNumber * 4;

  return {
    queueNumber,
    estimatedMinutes,
  };
};