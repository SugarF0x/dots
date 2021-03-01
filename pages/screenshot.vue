<template lang="pug">
  v-container
    v-row(justify="center" align="center")
      v-stage(:config="konva" ref="stage").d-none
        v-layer
          v-image(:config="img")
      v-stage(:config="snippet" ref="ally")
        v-layer(:config="{ filters: filters }" ref="process")
          v-image(
            v-for="n in 10"
            :key="'ass'+n"
            :config="getImageConfig(n)"
            ref="allyTextImage"
          )
      //v-stage(:config="snippet" ref="enemy")
      //  v-layer(:config="{ filters: filters }" ref="enemyLayer")
      //    v-image(
      //      v-for="n in 5"
      //      :key="'ass'+n"
      //      :config="getImageConfig(n, 'enemy')"
      //    )
</template>

<script lang="ts">
import Vue from 'vue'
import Konva from 'konva'
import Tesseract from "tesseract.js"

export default Vue.extend({
  name: "screenshot",
  data() {
    return {
      canvas: null as null | CanvasRenderingContext2D,
      konva: {
        width: 1280,
        height: 720,
        scaleX: 1,
        scaleY: 1,
      },
      snippet: {
        width: 320,
        height: 800,
        scaleX: 2,
        scaleY: 2,
      },
      img: {
        x: 0,
        y: 0,
        image: null as any,
        width: 1280,
        height: 720,
        rotation: -30,
        crop: {
          x: 0,
          y: 0,
          width: 1280,
          height: 720
        }
      } as any,
      allyImage: null as null | HTMLImageElement,
      enemyImage: null as null | HTMLImageElement,
      filters: [Konva.Filters.Contrast, Konva.Filters.Grayscale, Konva.Filters.Invert]
    }
  },
  methods: {
    getImageConfig(n: number) {
      const coords = [
        {x:75,y:105},
        {x:187,y:170},
        {x:187,y:300},
        {x:300,y:365},
        {x:300,y:495},
        {x:955,y:245},
        {x:842,y:310},
        {x:842,y:440},
        {x:730,y:507},
        {x:730,y:635}
      ]

      return {
        x: 0,
        y: (n-1)*30,
        image: n <= 5 ? this.allyImage : this.enemyImage,
        width: 160,
        height: 20,
        crop: {
          ...(coords[n-1]),
          width: 80,
          height: 10
        }
      }
    },
    async recognize(image: string) {
      return await Tesseract.recognize(image,'eng', { logger: m => console.log(m) })
        .then(({ data: { text } }) => {
          return text
        })
    }
  },
  async created() {
    const source = new Image()
    source.src = require('~/assets/dummyScreenshot.jpeg')
    source.onload = async () => {
      source.onload = null
      const img = this.img
      const stage = (this.$refs.stage as any).getNode() as Konva.Node
      img.image = source

      const allyImage = new Image()
      this.$nextTick(async () => {
        allyImage.src = stage.toDataURL()
        allyImage.onload = async () => {
          allyImage.onload = null
          this.allyImage = allyImage
        }

        img.rotation = 30
        img.y = -500
        this.$nextTick(async () => {
          const enemyImage = new Image()
          enemyImage.src = stage.toDataURL()
          enemyImage.onload = async () => {
            enemyImage.onload = null
            this.enemyImage = enemyImage
            img.rotation = 0
            img.y = 0

            const layer = (this.$refs.process as any).getNode() as Konva.Node
            layer.contrast(25)
            layer.cache()

            // console.log(ally.toDataURL())
            // console.log(await this.recognize(ally.toDataURL()))
            // console.log(await this.recognize(enemy.toDataURL()))
          }
        })
      })
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
