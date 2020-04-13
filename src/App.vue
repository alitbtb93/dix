<template>
  <v-app>
    <appHeader></appHeader>
    <v-content>
      <transition name="slide" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import appHeader from "./components/header";

export default {
  name: "App",

  components: {
    appHeader
  },

  data() {
    return {};
  },
  created() {
    this.$store.dispatch("autoLogin");
  }
};
</script>
<style lang='scss'>
html,
body {
  overflow-x: hidden !important;
  overflow-y: auto !important;
}
$mainText: #212121;
$backColor: #fff498;

@font-face {
  font-family: iranyekan;
  font-style: normal;
  font-weight: bold;
  src: url(~@/fonts/eot/iranyekanwebbold.eot);
  src: url(~@/fonts/eot/iranyekanwebbold.eot?#iefix) format("embedded-opentype"),
    /* IE6-8 */ url(~@/fonts/woff/iranyekanwebbold.woff) format("woff"),
    /* FF3.6+, IE9, Chrome6+, Saf5.1+*/ url(~@/fonts/ttf/iranyekanwebbold.ttf)
      format("truetype");
}

@font-face {
  font-family: iranyekan;
  font-style: normal;
  font-weight: 100;
  src: url(~@/fonts/eot/iranyekanwebthin.eot);
  src: url(~@/fonts/eot/iranyekanwebthin.eot?#iefix) format("embedded-opentype"),
    /* IE6-8 */ url(~@/fonts/woff/iranyekanwebthin.woff) format("woff"),
    /* FF3.6+, IE9, Chrome6+, Saf5.1+*/ url(~@/fonts/ttf/iranyekanwebthin.ttf)
      format("truetype");
}

@font-face {
  font-family: iranyekan;
  font-style: normal;
  font-weight: 300;
  src: url(~@/fonts/eot/iranyekanweblight.eot);
  src: url(~@/fonts/eot/iranyekanweblight.eot?#iefix)
      format("embedded-opentype"),
    /* IE6-8 */ url(~@/fonts/woff/iranyekanweblight.woff) format("woff"),
    /* FF3.6+, IE9, Chrome6+, Saf5.1+*/ url(~@/fonts/ttf/iranyekanweblight.ttf)
      format("truetype");
}

@font-face {
  font-family: iranyekan;
  font-style: normal;
  font-weight: normal;
  src: url(~@/fonts/eot/iranyekanwebregular.eot);
  src: url(~@/fonts/eot/iranyekanwebregular.eot?#iefix)
      format("embedded-opentype"),
    /* IE6-8 */ url(~@/fonts/woff/iranyekanwebregular.woff) format("woff"),
    /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
      url(~@/fonts/ttf/iranyekanwebregular.ttf) format("truetype");
}

@font-face {
  font-family: iranyekan;
  font-style: normal;
  font-weight: 500;
  src: url(~@/fonts/eot/iranyekanwebmedium.eot);
  src: url(~@/fonts/eot/iranyekanwebmedium.eot?#iefix)
      format("embedded-opentype"),
    /* IE6-8 */ url(~@/fonts/woff/iranyekanwebmedium.woff) format("woff"),
    /* FF3.6+, IE9, Chrome6+, Saf5.1+*/ url(~@/fonts/ttf/iranyekanwebmedium.ttf)
      format("truetype");
}

@font-face {
  font-family: iranyekan;
  font-style: normal;
  font-weight: 800;
  src: url(~@/fonts/eot/iranyekanwebextrabold.eot);
  src: url(~@/fonts/eot/iranyekanwebextrabold.eot?#iefix)
      format("embedded-opentype"),
    /* IE6-8 */ url(~@/fonts/woff/iranyekanwebextrabold.woff) format("woff"),
    /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
      url(~@/fonts/ttf/iranyekanwebextrabold.ttf) format("truetype");
}

@font-face {
  font-family: iranyekan;
  font-style: normal;
  font-weight: 900;
  src: url(~@/fonts/eot/iranyekanwebblack.eot);
  src: url(~@/fonts/eot/iranyekanwebblack.eot?#iefix)
      format("embedded-opentype"),
    /* IE6-8 */ url(~@/fonts/woff/iranyekanwebblack.woff) format("woff"),
    /* FF3.6+, IE9, Chrome6+, Saf5.1+*/ url(~@/fonts/ttf/iranyekanwebblack.ttf)
      format("truetype");
}

@font-face {
  font-family: iranyekan;
  font-style: normal;
  font-weight: 950;
  src: url(~@/fonts/eot/iranyekanwebextrablack.eot);
  src: url(~@/fonts/eot/iranyekanwebextrablack.eot?#iefix)
      format("embedded-opentype"),
    /* IE6-8 */ url(~@/fonts/woff/iranyekanwebextrablack.woff) format("woff"),
    /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
      url(~@/fonts/ttf/iranyekanwebextrablack.ttf) format("truetype");
}

html,
a,
h1,
h2,
h3,
h4,
h5,
h6,
p {
  font-family: iranyekan;
}
.v-application {
  font-family: iranyekan !important;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  color: $mainText;
}

label {
  font-size: 0.8em !important;
  color: $mainText !important;
}
main {
  background: #ecf0f1;
}
.slide-enter-active {
  animation: slide-in 200ms ease-out forwards;
}
.slide-leave-active {
  animation: slide-out 200ms ease-out forwards;
}
@keyframes slide-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slide-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>


