
export function effect(fn, options?) {
    // 响应式副作用函数，只要依赖的响应式数据变化了，就会重新执行
    const _effect = new ReactiveEffect(fn, () => {
        // scheduler
        _effect.run()
    })

    _effect.run()
}

function cleanPrevEffectDeps(effect) {
    effect._depsLength = 0
    effect._trackId += 1
}
function postCleanEffect(effect) {
    if (effect.deps.length > effect._depsLength) {
        for (let i = effect._depsLength; i < effect.deps.length; i++) {
            const dep = effect.deps[i]
            cleanDepEffect(dep, effect)
        }

        effect.deps.length = effect._depsLength
    }
}

export let activeEffect
class ReactiveEffect {
    _trackId = 0 // 用于标识该effect是否被收集过
    deps = []  // 记录该effect依赖了哪些属性
    _depsLength = 0  // 记录deps的长度，方便清理

    public active = true  // 标识该effect是否激活
    constructor(public fn, public scheduler) {
        this.fn = fn
    }

    run() {
        if (!this.active) {
            return this.fn()
        }
        let lastEffect = activeEffect
        try {
            activeEffect = this

            // 触发函数之前，清理上次的依赖
            cleanPrevEffectDeps(this)

            return this.fn() // 执行副作用函数时，如果有触发了proxy的get，就会进行依赖收集
        } finally {
            postCleanEffect(this)
            activeEffect = lastEffect
        }
    }

    stop() {
        this.active = false
    }
}


function cleanDepEffect(dep, effect) {
    dep.delete(effect)

    if (dep.size === 0) {
        dep.cleanup()
    }
}

// 双向记忆
// {show, name}
// {show, age}
export function trackEffect(effect, dep) {
    if (dep.get(effect) !== effect._trackId) {
        dep.set(effect, effect._trackId)

        // 对比两次依赖项
        const oldDep = effect.deps[effect._depsLength]
        if (oldDep !== dep) {
            // 依赖不相同，将老的删掉
            if (oldDep) {
                cleanDepEffect(oldDep, effect)
            }
        }
        effect.deps[effect._depsLength] = dep
        effect._depsLength++
    }

    // if (effect) {
    //     dep.set(effect, effect._trackId)
    //     effect.deps[effect._depsLength++] = dep
    // }
}

// 触发依赖
export function triggerEffects(dep) {
    for (const effect of dep.keys()) {
        if (effect.scheduler) {
            effect.scheduler()
        }
    }
}