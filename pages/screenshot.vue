<template lang="pug">
  v-container
    v-row(justify="center" align="center")
      v-stage(:config="konva" ref="stage").d-none
        v-layer
          v-image(:config="img")
      v-stage(:config="snippet")
        v-layer
          v-image(
            v-for="n in 5"
            :key="'ass'+n"
            :config="getImageConfig(n, 'ally')"
          )
      v-stage(:config="snippet")
        v-layer
          v-image(
            v-for="n in 5"
            :key="'ass'+n"
            :config="getImageConfig(n, 'enemy')"
          )
</template>

<script lang="ts">
import Vue from 'vue'
import Konva from 'konva'

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
        width: 125,
        height: 250,
        scaleX: 1,
        scaleY: 1,
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
    }
  },
  methods: {
    getImageConfig(n: number, type: 'ally' | 'enemy') {
      const coordsAlly = [
        {x:50,y:80},
        {x:162,y:145},
        {x:162,y:275},
        {x:275,y:340},
        {x:275,y:470}
      ]
      const coordsEnemy = [
        {x:930,y:220},
        {x:820,y:285},
        {x:820,y:415},
        {x:710,y:482},
        {x:710,y:610}
      ]

      return {
        x: 0,
        y: (n-1)*50,
        image: type === 'ally' ? this.allyImage : this.enemyImage,
        width: 125,
        height: 40,
        crop: {
          ...(type === 'ally' ? coordsAlly[n-1] : coordsEnemy[n-1]),
          width: 125,
          height: 40
        }
      }
    }
  },
  created() {
    const source = new Image()
    source.src = require('~/assets/dummyScreenshot.jpeg')
    source.onload = () => {
      source.onload = null
      const img = this.img
      const stage = (this.$refs.stage as any).getNode() as Konva.Node
      img.image = source

      const allyImage = new Image()
      this.$nextTick(() => {
        allyImage.src = stage.toDataURL()
        allyImage.onload = () => {
          allyImage.onload = null
          this.allyImage = allyImage
        }

        img.rotation = 30
        img.y = -500
        this.$nextTick(() => {
          const enemyImage = new Image()
          enemyImage.src = stage.toDataURL()
          enemyImage.onload = () => {
            enemyImage.onload = null
            this.enemyImage = enemyImage
            img.rotation = 0
            img.y = 0
          }
        })
      })
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
