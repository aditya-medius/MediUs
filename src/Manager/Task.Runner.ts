import { Mode } from "../Services/Helpers";
import { TaskManager } from "./Task.Manager";


export class TaskRunner {
    static Bundle(responseType = false) {
        return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
            const originalMethod = descriptor.value; // Reference to the original method

            descriptor.value = async function (...args: any[]) {
                const taskManager = new TaskManager(async () => {
                    return await originalMethod.apply(this, args);
                });
                if (responseType) {
                    args.push(Mode.RESPONSE)
                }
                return await taskManager.execute(...args); // Execute taskManager with req and res
            };

            return descriptor; // Return the updated descriptor
        }
    }

}