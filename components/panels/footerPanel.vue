<template>
  <div class="footer text-base-content footer-center">
    <div class="rounded-box p-2">
      <div class="flex flex-start items-center">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 240 240"><defs><style>.cls-1{fill:#71cde2;}.cls-2{fill:#e5d573;}.cls-3{fill:url(#linear-gradient);}</style><linearGradient id="linear-gradient" x1="29.07" y1="182.65" x2="57.35" y2="210.93" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#71cde2"/><stop offset="1" stop-color="#e5d573"/></linearGradient></defs><path class="cls-1" d="M124.93,34.66a4.57,4.57,0,0,0-.05-.52c0-.16-.07-.31-.11-.47a3.88,3.88,0,0,0-.14-.45c-.06-.15-.13-.3-.2-.45s-.14-.28-.22-.41l-.27-.39c-.1-.13-.2-.25-.31-.37a3.61,3.61,0,0,0-.35-.33,3.37,3.37,0,0,0-.36-.3,4.43,4.43,0,0,0-.46-.29c-.08-.05-.15-.11-.24-.16l-.14-.05c-.16-.07-.33-.13-.51-.19l-.43-.14-.46-.07-.53-.06H120a2.85,2.85,0,0,0-.29,0,4.53,4.53,0,0,0-.53,0l-.47.11a3.88,3.88,0,0,0-.45.14l-.45.2-.41.22L117,31a3.47,3.47,0,0,0-.37.3c-.12.11-.23.23-.34.35s-.2.23-.29.36a4.43,4.43,0,0,0-.29.46c0,.08-.11.15-.16.24L77.48,108.91,39.4,32.74A5,5,0,0,0,30,35V183.78a5,5,0,0,0,9.92,0V56L73,122.22a5,5,0,0,0,8.88,0L115,56v64a5,5,0,0,0,9.92,0V35C125,34.86,124.94,34.76,124.93,34.66Z"/><path class="cls-2" d="M183.78,136.3H120a5,5,0,1,0,0,9.92h63.78a5,5,0,1,0,0-9.92Z"/><path class="cls-2" d="M183.78,157.56H120c-1.68,0-16.33-.62-16.33-16.3S118.35,125,120,125h63.78a5,5,0,1,0,0-9.92H120c-9.07,0-26.22,5.48-26.22,26.22s17.15,26.22,26.22,26.22h63.76c1.67,0,16.32.63,16.32,16.3s-14.65,16.28-16.3,16.3H56.22a5,5,0,0,0,0,9.92H183.78c9.07,0,26.22-5.48,26.22-26.22S192.85,157.56,183.78,157.56Z"/><path class="cls-3" d="M56.22,210C47.15,210,30,204.52,30,183.78a5,5,0,0,1,9.92,0c0,6.88,2.58,11.51,7.89,14.17a21.61,21.61,0,0,0,8.41,2.13,5,5,0,1,1,0,9.92Z"/></svg>
        <p>MoneySaver v{{version()}}</p>
      </div>
      <p>Copyright © 2022 - All right reserved by <a href="https://knst.su" class="underline">isKonstantin</a></p>
    </div>
  </div>
</template>

<script>
import pkg from '../../package.json'

export default {
  name: "footerPanel",

  methods: {
    version(){
      return pkg.version
    }
  }
}
</script>

<style scoped>

</style>
