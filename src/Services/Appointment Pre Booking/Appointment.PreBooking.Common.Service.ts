import { Base } from "../../Classes"

export class AppointmentPreBookingCommonService extends Base<AppointmentPreBookingCommonService> {
    public doesDoctorHaveCapacityForWorkingHour(
        workingHour: Array<string>,
        capacityAndToken: Array<{
            capacity: number,
            largestToken: number
        }>) {
        return workingHour.map((x: string, index: number) =>
            ({ time: x, iscapacity: capacityAndToken[index].largestToken < capacityAndToken[index].capacity })
        )
    }
}