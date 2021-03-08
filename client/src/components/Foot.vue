<template lang="pug">
.foot
   div.
      choospac &copy; #[a(href="https://github.com/autumnblazey/") Alexander Liu (autumnblazey)] 2021
      #[br] Licensed under AGPL-3 only (#[a(href="https://github.com/autumnblazey/choospac") source code])
   div(v-html="additionalfooter")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import config from "@/config/config.json5";

export default defineComponent({
   name: "THE-FOOT",
   data() {
      return {
         additionalfooter: config.additionalfooter ?? ""
      }
   }
});
</script>

<style lang="scss" scoped>
@import "../config/scss_vars";

.foot {
   text-align: center;
   background-color: $foot-color;
   padding: 30px;
}
</style>
