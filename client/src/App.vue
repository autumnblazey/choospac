<template lang="pug">
#main-app
   #nav.
      #[NavbarLink(to="/") Home]
      | #[NavbarLink(to="/builder") Builder]
      | #[NavbarLink(to="/about") About]

   #router-view
      router-view(v-slot="{ Component }")
         keep-alive
            component(:is="Component")

THEFOOT
</template>

<style lang="scss">
@import "config/scss_vars";

* {
   margin: 0;
   border: 0;
   padding: 0;
   outline: none;
}

a {
   text-decoration: none;
}

#router-view {
   padding-left: 15px;
   padding-right: 15px;
   flex-grow: 1;
}

body {
   background-color: $background-color;
   height: 100vh;
   display: flex;
}

#app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   background-color: $background-color;
   flex-grow: 1;
   display: flex;
   flex-direction: column;

   // margin-left: 30px;
   // margin-right: 30px;
   // margin-top: 30px;
}

#main-app {
   flex-grow: 1;
   margin: 30px;

   display: flex;
   flex-direction: column;
}

#nav {
   padding-bottom: 30px;
   // transform: translate(-30px, 0);

   a {
      font-weight: bold;
      // color: #2c3e50;

      // &.router-link-exact-active {
      //    color: #42b983;
      // }
   }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import NavbarLink from "@/components/NavbarLink.vue";
import THEFOOT from "@/components/Foot.vue";

export default defineComponent({
   components: {
      NavbarLink,
      THEFOOT
   }
});
</script>
