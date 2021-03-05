<template lang="pug">
  v-container
    v-row.d-none
      v-col(id="mainStage")
      v-col(id="cropStage")
    v-row(justify="center" v-if="progress < 100")
      Dashboard(:uppy="uppy" :props="{ theme: 'dark' }" v-if="state === 'init'")
      div.text-center(v-else)
        v-progress-circular.mb-2(:value="progress")
        div {{ progressMessage }}

</template>

<script lang="ts">
import Vue from 'vue'
import Konva from 'konva'
import Tesseract from "tesseract.js"
import { Entry } from "~/assets/consts"

import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/vue'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css' // @ts-ignore
import Russian from '@uppy/locales/lib/ru_RU'

export default Vue.extend({
  name: "screenshot",
  components: {
    Dashboard
  },
  data() {
    return {
      state: 'init', // init | parsing | finished
      names: [] as string[],
      entries: [] as Entry[]
    }
  },
  computed: {
    progress(): number {
      let result = this.names.length
      if (this.entries.length) result++
      return Math.floor((result/11) * 100)
    },
    progressMessage(): string {
      let message = ''
      if (this.names.length < 10) message = `Анализируем имена (${this.names.length+1}/10)...`
      else message = 'Ищем совпадения в базе данных...'
      return message
    },
    uppy() { // @ts-ignore
      return new Uppy({
        id: 'uppy',
        restrictions: {
          allowedFileTypes: ['image/*']
        },// @ts-ignore
        onBeforeFileAdded: (file: any) => {
          this.state = 'parsing'

          const reader = new FileReader()
          reader.readAsDataURL(file.data)
          reader.onload = async () => {
            await this.parse(await this.getImage(reader.result as string))
          }
        },
        locale: Russian
      })
    }
  },
  methods: {
    /**
     * Run image text recognition
     */
    async recognize(image: string): Promise<string> {
      return Tesseract.recognize(image,'eng')
        .then(({ data: { text } }) => {
          return text
        })
    },
    /**
     * Promisify Image onload
     */
    async getImage(src: string): Promise<HTMLImageElement> {
      return new Promise(res => {
        const image = new Image()
        image.src = src
        image.onload = () => {
          image.onload = null
          res(image)
        }
      })
    },
    /**
     * Get Crop Image Konva config
     * @param img
     * @param type
     * @param n
     */
    getCropConfig(img: HTMLImageElement, type: 'ally' | 'enemy', n: number) {
      const allyCoords = [
        {x: 110, y: 155},
        {x: 280, y: 252},
        {x: 280, y: 448},
        {x: 451, y: 545},
        {x: 451, y: 741}
      ]
      const enemyCoords = [
        {x: 1418, y: 365},
        {x: 1253, y: 463},
        {x: 1253, y: 658},
        {x: 1083, y: 756},
        {x: 1083, y: 950}
      ]

      return {
        x: 0,
        y: 0,
        image: img,
        width: 130,
        height: 16,
        crop: {
          ...(type === 'ally' ? allyCoords[n] : enemyCoords[n]),
          width: 130,
          height: 16
        }
      }
    },
    async parse(sourceImage: HTMLImageElement) {
      /**
       * Define Main & Crop Konva Stages & working Layer
       */
      const stage = {
        main: new Konva.Stage({
          container: 'mainStage',
          width: 1920,
          height: 1080
        }),
        crop: new Konva.Stage({
          container: 'cropStage',
          width: 130,
          height: 16
        })
      }

      /**
       * Define working Layers
       */
      const layer = {
        main: new Konva.Layer(),
        crop: new Konva.Layer()
      }
      stage.main.add(layer.main)
      stage.crop.add(layer.crop)

      /**
       * Define Konva Image that will be used in transformations
       */
      const image = new Konva.Image({
        x: 0,
        y: 0,
        image: sourceImage,
        width: 1920,
        height: 1080
      })
      layer.main.add(image)

      /**
       * Create Ally & Enemy Image source instances
       */
      image.rotation(-30)
      const ALLY_SOURCE_IMAGE = await this.getImage(stage.main.toDataURL())
      image.rotation(30)
      image.y(-750)
      const ENEMY_SOURCE_IMAGE = await this.getImage(stage.main.toDataURL())
      image.rotation(0)
      image.y(0)

      /**
       * Create arrays of single names for both teams
       */
      const names = {
        ally: [] as HTMLImageElement[],
        enemy: [] as HTMLImageElement[]
      }
      for (let i=0; i<5; i++) {
        const crop = {
          ally: new Konva.Image({
            ...this.getCropConfig(ALLY_SOURCE_IMAGE, 'ally', i)
          }),
          enemy: new Konva.Image({
            ...this.getCropConfig(ENEMY_SOURCE_IMAGE, 'enemy', i)
          })
        }

        layer.crop.add(crop.ally)
        names.ally.push(await this.getImage(stage.crop.toDataURL()))
        crop.ally.destroy()

        layer.crop.add(crop.enemy)
        names.enemy.push(await this.getImage(stage.crop.toDataURL()))
        crop.enemy.destroy()
      }

      /**
       * Create arrays of names with filters applied
       */
      const filteredNames = {
        ally: [] as HTMLImageElement[],
        enemy: [] as HTMLImageElement[]
      }
      for (let i=0; i<5; i++) {
        const filtered = {
          ally: new Konva.Image({
            x: 0,
            y: 0,
            image: names.ally[i],
            filters: [Konva.Filters.Contrast, Konva.Filters.Grayscale, Konva.Filters.Invert]
          }),
          enemy: new Konva.Image({
            x: 0,
            y: 0,
            image: names.enemy[i],
            filters: [Konva.Filters.Contrast, Konva.Filters.Grayscale, Konva.Filters.Invert]
          })
        }

        filtered.ally.cache()
        layer.crop.add(filtered.ally)
        filteredNames.ally.push(await this.getImage(layer.crop.toDataURL()))
        filtered.ally.destroy()

        filtered.enemy.cache()
        layer.crop.add(filtered.enemy)
        filteredNames.enemy.push(await this.getImage(layer.crop.toDataURL()))
        filtered.enemy.destroy()
      }

      for (const name of [...filteredNames.ally, ...filteredNames.enemy]) {
        const result = await this.recognize(name.currentSrc)
        this.names.push(result.replace(/[^0-9a-z-A-Z]/g, ""))
      }
    }
  },
})
</script>

<style lang="sass" scoped>

</style>
