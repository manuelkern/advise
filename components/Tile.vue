<template>
  <transition name="tile-transition">
    <div v-html="body" class="tile-body"></div>
  </transition>
</template>

<script>
export default {
  props: {
    body: {
      type: String
    }
  }
}
</script>
