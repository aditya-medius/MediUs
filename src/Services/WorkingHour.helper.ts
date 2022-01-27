export const formatWorkingHour = async (workingHours: Array<any>) => {
  workingHours = workingHours.map((e: any) => {
    return Object.keys(e).map((elem: any) => {
      return {
        day: elem,
        timings: e[elem],
      };
    });
  });
  return workingHours.flat();
};
