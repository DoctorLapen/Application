

export const validateEventDate = (date?: Date) => {
  if (!date) return false;

  
  const eventDateUTC = new Date(date.toISOString());

  
  const nowUTC = new Date(new Date().toISOString());

  
  const tomorrowUTC = new Date(
    Date.UTC(
      nowUTC.getUTCFullYear(),
      nowUTC.getUTCMonth(),
      nowUTC.getUTCDate() + 1,
      0, 0, 0, 0
    )
  );

  return eventDateUTC >= tomorrowUTC;
};

