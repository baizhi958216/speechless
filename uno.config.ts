import { presetWind4, defineConfig, transformerDirectives } from 'unocss'

export default defineConfig({
    presets: [
        presetWind4(),
    ],
    transformers: [transformerDirectives()]
})