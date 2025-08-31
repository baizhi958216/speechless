<template>
  <ClientOnly>
    <div>
      <velocity :texts="['无语😅，和你说不下去💧典型的耄耋思维🤗😅😅', '🧩点击图片上传图片', '💧可以拖动', '✏️文字也可以编辑']" :velocity="100" :damping="50"
        :stiffness="400" :velocity-mapping="{ input: [0, 1000], output: [0, 5] }" class-name="md:text-30px"
        parallax-class-name="custom-parallax" scroller-class-name="custom-scroller" />

      <div ref="speechless" class="md:w-500px w-360px mx-auto my-3em relative bg-#fff py-[12px]">
        <div :class="[
          'md:w-400px h-300px mx-auto md:h-400px w-300px flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden',
          imageUrl ? '' : 'border-2 border-dashed border-gray-300'
        ]" @click="openFileDialog">
          <div v-if="!imageUrl" class="text-center text-gray">
            点击上传图片
          </div>

          <img v-if="imageUrl" :src="imageUrl" alt="上传的图片" class="max-w-full max-h-full object-contain draggable-image"
            draggable="false" />
        </div>
        <DraggableElement />
        <div class="text-center font-500 md:text-42px text-26px" contenteditable>无语😅，和你说不下去</div>
        <div class="text-center font-500 md:text-42px text-26px" contenteditable>典型的耄耋思维🤗😅😅</div>
      </div>
    </div>
    <button @click="saveimg"
      class="cursor-pointer mx-auto group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl md:text-30px hover:bg-opacity-70 transition font-semibold shadow-md">
      <svg class="md:hidden block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24px" width="24px">
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Interface / Download">
            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#f1f1f1"
              d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" id="Vector"></path>
          </g>
        </g>
      </svg>
      保存图片
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { snapdom } from '@zumer/snapdom';

const speechless = ref()
const imageUrl = ref('/doro.jpg')

const openFileDialog = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      processImageFile(file)
    }
  }
  input.click()
}

const processImageFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (e.target?.result) {
      imageUrl.value = e.target.result as string
    }
  }
  reader.readAsDataURL(file)
}

const saveimg = async () => {
  const result = await snapdom(speechless.value);
  await result.download({ format: 'png', filename: 'speech' });
}
</script>

<style>
@import url('https://fonts.font.im/css?family=Noto+Sans');

* {
  font-family: 'Noto Sans', sans-serif;
}

html,
body,
#__nuxt {
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

#__nuxt {
  /* 默认背景色 */
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  transition: background 0.3s ease;
}

/* 夜间模式 */
@media (prefers-color-scheme: dark) {
  #__nuxt {
    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  }
}

/* 日间模式 */
@media (prefers-color-scheme: light) {
  #__nuxt {
    background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  }
}

</style>