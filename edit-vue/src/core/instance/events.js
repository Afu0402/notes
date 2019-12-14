export function initEvents (vm) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

export function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm
  // updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm)
  target = undefined
}