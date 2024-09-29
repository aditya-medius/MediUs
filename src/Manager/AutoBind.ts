export function AutoBind<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            const methodNames = Object.getOwnPropertyNames(constructor.prototype);

            for (const methodName of methodNames) {
                const method = this[methodName as keyof this];
                if (typeof method === 'function' && methodName !== 'constructor') {
                    this[methodName as keyof this] = method.bind(this);
                }
            }
        }
    };
}
