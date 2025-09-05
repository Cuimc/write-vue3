
import { isObject } from '@vue/shared'
import { ReactiveFlags, mutableHandlers } from './baseHandler'

export const reactiveMap = new WeakMap()
export function createReactiveObject(target) {
    if (!isObject(target)) {
        return target
    }

    // 判断是否已经被代理过了，
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }

    // 使用weakmap来缓存已经被代理过的对象
    const exitsProxy = reactiveMap.get(target)
    if (exitsProxy) {
        return exitsProxy
    }

    const proxy = new Proxy(target, mutableHandlers)
    reactiveMap.set(target, proxy)

    return proxy
}

export function reactive(target) {
    return createReactiveObject(target)
}
