<template lang="pug">
#everything
   #nav.
      #[NavbarLink(to="/") Home]
      | #[NavbarLink(to="/builder") Builder]
      | #[NavbarLink(to="/about") About]
   router-view
</template>

<style lang="scss">
@import "vars/scss_vars";

* {
   margin: 0;
   border: 0;
   padding: 0;
   outline: none;
}

a {
   text-decoration: none;
}
#everything {
   height: 100vh;
   padding: 30px;
}

#app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   background-color: $background-color;
}

#nav {
   padding-bottom: 30px;

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

export default defineComponent({
   components: {
      NavbarLink
   }
});
</script>
