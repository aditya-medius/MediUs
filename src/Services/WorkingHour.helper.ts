const dayArray: Array<string> = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const formatWorkingHour = (workingHours: Array<any>) => {
  workingHours = workingHours.map((e: any) => {
    return Object.keys(e).map((elem: any) => {
      if (dayArray.includes(elem)) {
        return {
          day: elem,
          timings: e[elem],
        };
      }
    });
  });
  workingHours = workingHours.flat().filter((e: any) => e);
  return workingHours;
};
