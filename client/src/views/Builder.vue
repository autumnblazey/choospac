<!--
builder steps:

1. mc version
2. choose template/preset
3. blocks
4. entities
5. sounds
6. language
7. miscellaneous?
8. export page, save preset page, etc (hmm what is there to configure to export lol)
-->

<template lang="pug">
.builder-view
   .builder-view-main-part
      keep-alive
         component(:is="page")

   .buttons
      keep-alive
         template(v-if="hasprevious")
            div(@click="previous") previous

      keep-alive
         template(v-if="hasnext")
            div(@click="next") next
</template>

<style lang="scss" scoped>
.builder-view {
   height: 100%;
   display: flex;
   flex-direction: column;
}

.builder-view-main-part {
   flex: 1 0 auto;
}
.buttons {
   flex-shrink: 0;
   display: flex;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Page1 from "./builder/Page1.vue";
import Page2 from "./builder/Page2.vue";
import Page3 from "./builder/Page3.vue";
import Page4 from "./builder/Page4.vue";
import Page5 from "./builder/Page5.vue";
import Page6 from "./builder/Page6.vue";
import Page7 from "./builder/Page7.vue";
import Page8 from "./builder/Page8.vue";

export default defineComponent({
   components: {
      Page1, Page2, Page3, Page4,
      Page5, Page6, Page7, Page8
   },
   data() {
      return {
         // 1
         pagenum: 1,
         // total number of pages
         totalpages: 8
      }
   },
   computed: {
      page(): string {
         // gets component name from page number
         return `Page${this.pagenum}`;
      },
      hasnext(): boolean {
         // hide/disable next button when no next page
         return this.pagenum < this.totalpages;
      },
      hasprevious(): boolean {
         // hide/disable previous button when no previous page
         return this.pagenum > 1;
      }
   },
   methods: {
      next() {
         // goes to next page
         this.pagenum++;
      },
      previous() {
         // goes to previous page
         this.pagenum--;
      }
   }
});
</script>
