<template lang="pug">
  v-container
    v-row(justify="center" align="center")
      v-col(id="mainStage")
      v-col(id="cropStage")
</template>

<script lang="ts">
import Vue from 'vue'
import Konva from 'konva'
import Tesseract from "tesseract.js"

export default Vue.extend({
  name: "screenshot",
  data() {
    return {

    }
  },
  methods: {
    /**
     * Run image text recognition
     */
    async recognize(image: string) {
      return await Tesseract.recognize(image,'eng', { logger: m => console.log(m) })
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
        {x: 105, y: 155},
        {x: 275, y: 252},
        {x: 275, y: 448},
        {x: 448, y: 545},
        {x: 448, y: 740}
      ]
      const enemyCoords = [
        {x: 1420, y: 362},
        {x: 1255, y: 460},
        {x: 1255, y: 655},
        {x: 1085, y: 755},
        {x: 1085, y: 950}
      ]

      return {
        x: 0,
        y: 0,
        image: img,
        width: 140,
        height: 20,
        crop: {
          ...(type === 'ally' ? allyCoords[n] : enemyCoords[n]),
          width: 140,
          height: 20
        }
      }
    }
  },
  async mounted() {
    // TODO: refactor constants to objects e.g. MAIN_STAGE & CROP_STAGE are to be stage.main & stage.crop

    /**
     * Define Main & Crop Konva Stages & working Layer
     */
    const MAIN_STAGE = new Konva.Stage({
      container: 'mainStage',
      width: 1920,
      height: 1080
    })
    const CROP_STAGE = new Konva.Stage({
      container: 'cropStage',
      width: 140,
      height: 20
    })

    /**
     * Define working Layers
     */
    const MAIN_LAYER = new Konva.Layer()
    MAIN_STAGE.add(MAIN_LAYER)
    const CROP_LAYER = new Konva.Layer()
    CROP_STAGE.add(CROP_LAYER)

    /**
     * Get source image that will be used in every new Image instance
     * TODO: replace this section with Uppy file upload
     */
    const SOURCE_IMAGE = await this.getImage(require('~/assets/dummyFullHD.png'))

    /**
     * Define Konva Image that will be used in transformations
     */
    const IMAGE = new Konva.Image({
      x: 0,
      y: 0,
      image: SOURCE_IMAGE,
      width: 1920,
      height: 1080
    })
    MAIN_LAYER.add(IMAGE)

    /**
     * Create Ally & Enemy Image source instances
     */
    IMAGE.rotation(-30)
    const ALLY_SOURCE_IMAGE = await this.getImage(MAIN_STAGE.toDataURL())
    IMAGE.rotation(30)
    IMAGE.y(-750)
    const ENEMY_SOURCE_IMAGE = await this.getImage(MAIN_STAGE.toDataURL())
    IMAGE.rotation(0)
    IMAGE.y(0)

    /**
     * Create arrays of single names for both teams
     */
    const ALLY_NAMES = [] as HTMLImageElement[]
    const ENEMY_NAMES = [] as HTMLImageElement[]
    for (let i=0; i<5; i++) {
      const CROP_ALLY_IMAGE = new Konva.Image({
        ...this.getCropConfig(ALLY_SOURCE_IMAGE, 'ally', i)
      })
      const CROP_ENEMY_IMAGE = new Konva.Image({
        ...this.getCropConfig(ENEMY_SOURCE_IMAGE, 'enemy', i)
      })

      CROP_LAYER.add(CROP_ALLY_IMAGE)
      ALLY_NAMES.push(await this.getImage(CROP_STAGE.toDataURL()))
      CROP_ALLY_IMAGE.destroy()

      CROP_LAYER.add(CROP_ENEMY_IMAGE)
      ENEMY_NAMES.push(await this.getImage(CROP_STAGE.toDataURL()))
      CROP_ENEMY_IMAGE.destroy()
    }

    /**
     * Create arrays of names with filters applied
     */
    const FILTERED_ALLY_NAMES = [] as HTMLImageElement[]
    const FILTERED_ENEMY_NAMES = [] as HTMLImageElement[]
    for (let i=0; i<5; i++) {
      const FILTERED_ALLY_IMAGE = new Konva.Image({
        x: 0,
        y: 0,
        image: ALLY_NAMES[i],
        filters: [Konva.Filters.Contrast, Konva.Filters.Grayscale, Konva.Filters.Invert]
      })
      const FILTERED_ENEMY_IMAGE = new Konva.Image({
        x: 0,
        y: 0,
        image: ENEMY_NAMES[i],
        filters: [Konva.Filters.Contrast, Konva.Filters.Grayscale, Konva.Filters.Invert]
      })

      FILTERED_ALLY_IMAGE.cache()
      CROP_LAYER.add(FILTERED_ALLY_IMAGE)
      FILTERED_ALLY_NAMES.push(await this.getImage(CROP_LAYER.toDataURL()))
      FILTERED_ALLY_IMAGE.destroy()

      FILTERED_ENEMY_IMAGE.cache()
      CROP_LAYER.add(FILTERED_ENEMY_IMAGE)
      FILTERED_ENEMY_NAMES.push(await this.getImage(CROP_LAYER.toDataURL()))
      FILTERED_ENEMY_IMAGE.destroy()
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
