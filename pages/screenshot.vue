<template lang="pug">
  v-container
    v-row(justify="center" align="center").d-none
      v-col(id="mainStage")
      v-col(id="cropStage")
    v-row
      v-col {{ names }}
</template>

<script lang="ts">
import Vue from 'vue'
import Konva from 'konva'
import Tesseract from "tesseract.js"

export default Vue.extend({
  name: "screenshot",
  data() {
    return {
      names: [] as string[]
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
    }
  },
  async mounted() {
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
     * Get source image that will be used in every new Image instance
     * TODO: replace this section with Uppy file upload
     */
    const SOURCE_IMAGE = await this.getImage(require('~/assets/dummyFullHD.png'))

    /**
     * Define Konva Image that will be used in transformations
     */
    const image = new Konva.Image({
      x: 0,
      y: 0,
      image: SOURCE_IMAGE,
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
      this.names.push(result.replace(/ /g,''))
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
