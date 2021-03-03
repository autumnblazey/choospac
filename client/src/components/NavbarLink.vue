<template lang="pug">
router-link.navlink(:to="to")
   slot
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
   props: {
      to: String
   }
});
</script>

<style lang="scss" scoped>
@import "../vars/scss_vars";

.navlink {
   text-decoration: none;
   display: inline-block;

   padding-left: 15px;
   padding-right: 15px;
   padding-top: 5px;
   padding-bottom: 5px;

   margin: 0;
   border-radius: 6px;
   // background-color: $primary-color-2;

   // box-shadow: 0 0 10px $shadow-color;
   &:active {
      background-color: $background-color-slightly-darker;
   }
}
</style>
