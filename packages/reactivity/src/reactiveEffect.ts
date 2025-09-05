
import { activeEffect, trackEffect, triggerEffects } from "./effect"

export const targetMap = new WeakMap<any, any>()

const creatDep = (cleanup, key) => {
    const dep = new Map() as any
    dep.cleanup = cleanup
    dep.name = key
    return dep
}
export function track(target, key) {
    // 依赖收集
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = creatDep(() => {
            console.log("清理的key:", key);

            depsMap.delete(key)
        }, key)))
    }
    trackEffect(activeEffect, dep)
}

export function trigger(target, key, newValue, oldValue) {
    // 依赖触发
    let deps = targetMap.get(target)
    if (deps) {
        let dep = deps.get(key)
        if (dep) {
            triggerEffects(dep)
        }
    }
}