<template>
  <div 
    ref="draggableElement"
    class="text-[100px] absolute cursor-move select-none"
    :style="{ 
      left: position.x + 'px', 
      top: position.y + 'px',
      right: 'auto'
    }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    💧
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const draggableElement = ref(null)
const isDragging = ref(false)
const position = reactive({ x: 0, y: 0 })
const dragOffset = reactive({ x: 0, y: 0 })

// 获取父容器边界
const getParentBounds = () => {
  const parent = draggableElement.value?.parentElement
  if (!parent) return { width: 0, height: 0 }
  
  const elementRect = draggableElement.value.getBoundingClientRect()
  
  return {
    width: parent.clientWidth - elementRect.width,
    height: parent.clientHeight - elementRect.height
  }
}

// 限制位置在父容器内(暂时不要，字体怎么会有边距好奇怪？)
// const constrainPosition = (x, y) => {
//   const bounds = getParentBounds()
//   return {
//     x: Math.max(0, Math.min(x, bounds.width)),
//     y: Math.max(0, Math.min(y, bounds.height))
//   }
// }

// 开始拖动
const startDrag = (event) => {
  event.preventDefault()
  isDragging.value = true
  
  const clientX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
  const clientY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY
  
  const rect = draggableElement.value.getBoundingClientRect()
  dragOffset.x = clientX - rect.left
  dragOffset.y = clientY - rect.top
  
  // 添加全局事件监听
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', handleDrag, { passive: false })
  document.addEventListener('touchend', stopDrag)
}

// 处理拖动
const handleDrag = (event) => {
  if (!isDragging.value) return
  
  event.preventDefault()
  
  const clientX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX
  const clientY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY
  
  const parent = draggableElement.value.parentElement
  const parentRect = parent.getBoundingClientRect()
  
  const newX = clientX - parentRect.left - dragOffset.x
  const newY = clientY - parentRect.top - dragOffset.y
  
  // const constrainedPosition = constrainPosition(newX, newY)
  position.x = newX
  position.y = newY
}

// 停止拖动
const stopDrag = () => {
  isDragging.value = false
  
  // 移除全局事件监听
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 初始化位置（右上角）
onMounted(() => {
  const bounds = getParentBounds()
  position.x = bounds.width
  position.y = 0
})

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', stopDrag)
})
</script>

<style scoped>
/* 防止在拖动时选中文本 */
.cursor-move {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .cursor-move {
    cursor: grab;
  }
  
  .cursor-move:active {
    cursor: grabbing;
  }
}
</style>