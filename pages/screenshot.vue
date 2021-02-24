<template lang="pug">
  v-container
    v-row(justify="center" align="center")
      v-stage(:config="konva" id="konva")
        v-layer
          v-image(:config="img")
</template>

<script lang="ts">
import Vue from 'vue'

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
      img: {
        x: 0,
        y: 0,
        image: null as any,
        width: 1280,
        height: 720,
        rotation: 0,
        crop: {
          x: 0,
          y: 0,
          width: 1280,
          height: 720
        }
      } as any
    }
  },
  created() {
    const source = new Image()
    source.src = require('~/assets/dummyScreenshot.jpeg')
    source.onload = () => {
      const img = this.img
      img.image = source

      img.rotation = -30
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
