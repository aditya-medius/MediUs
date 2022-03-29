export const dayArray: Array<string> = [
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
        let returnData: any = {
          day: elem,
          timings: e[elem],
        };
        if (e.workingHourId) {
          returnData["workingHourId"] = e.workingHourId;
        }
        return returnData;
      }
    });
  });
  workingHours = workingHours.flat().filter((e: any) => e);
  return workingHours;
};
