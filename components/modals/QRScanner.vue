<template>
  <div class="modal">
    <div class="modal-box">
      <h2 class="font-bold mb-1">Сканировать QR-код</h2>
      <hr class="mb-4">

      <div v-if="error !== ''" class="alert alert-error">
        <div class="flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
          </svg>
          <label>{{error}}</label>
        </div>
      </div>

      <permission-checker v-if="enabled" :constants="{video: { facingMode: { exact: 'environment' } }}"></permission-checker>

      <div v-if="enabled" class="form-control">
        <qrcode-stream v-if="!mode" @decode="onDecode" :torch="torchActive" @init="onInit" ></qrcode-stream>
        <qrcode-capture v-if="mode" @decode="onDecode" @init="onInit" ></qrcode-capture>
      </div>

      <div class="mt-6 flex justify-between w-full">
        <button v-if="torchSupported" @click="torchActive = !torchActive" class="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          </svg>
        </button>
        <div v-else></div>
        <div>
          <label @click="$store.commit('hideModal', 'qr-scanner')" class="btn btn-ghost">
            Отменить
          </label>
          <label @click="selectMode()" class="btn btn-success">
            {{!mode ? 'Выбрать файл' : 'Камера'}}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import PermissionChecker from "../utils/permissionChecker";
export default {
  name: "QRScanner",
  components: {PermissionChecker},
  data() {
    return {
      mode: false,
      enabled: false,
      torchActive: false,
      torchSupported: false,
      error: "",
      resultFunc: (s) => {}
    }
  },

  created() {
    this.$store.commit("setModalShowEvent", {name: 'qr-scanner', func: (data) => {
        this.resultFunc = data.resultFunc;
        this.enabled = true;
      }
    })
  },

  methods: {
    selectMode() {
      this.mode = !this.mode;
      this.error = "";
    },

    onDecode(text) {
      this.$store.commit('hideModal', 'qr-scanner')
      this.enabled = false
      this.resultFunc(text)
    },

    async onInit (promise) {
      try {
        const { capabilities } = await promise
        this.torchSupported = capabilities.torch
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "Ошибка: требуется разрешение на использование камеры"
        } else if (error.name === 'NotFoundError') {
          this.error = "Ошибка: камера не найдена"
        } else if (error.name === 'NotSupportedError') {
          this.error = "Ошибка: требуется защищенное соединение"
        } else if (error.name === 'NotReadableError') {
          this.error = "Ошибка: камера уже используется?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "Ошибка: установленные камеры не подходят"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "Ошибка: браузер не поддерживает функцию"
        } else if (error.name === 'InsecureContextError') {
          this.error = 'Ошибка: требуется защищенное соединение';
        } else {
          this.error = `Ошибка: (${error.name})`;
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
