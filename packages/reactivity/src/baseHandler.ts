export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }

        return target[key]
    },
    set(target, key, value, receiver) {
        target[key] = value
        return true
    }
}