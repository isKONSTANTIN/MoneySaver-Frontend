<template>
  <div>
    <div class="hero min-h-screen">
      <div class="hero-content">
        <div class="max-w-md">
          <div class="card shadow">
            <div class="panel">
              <div class="flex justify-center">
                <div class="badge badge-lg badge-error">Срок действия аккаунта истек</div>
              </div>

              <h2 class="font-bold text-center mt-2">
                Все Ваши данные сохранены. При продлении будет использована эта учетная запись. <br> <br>
                Если это ошибка, свяжитесь с администратором
              </h2>

              <div class="modal-action mt-2 justify-center">
                <a href="https://monsave.su" class="btn btn-accent">К тарифам</a>
                <a href="https://monsave.su" class="btn btn-warning">Связаться</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-panel></footer-panel>
  </div>
</template>

<script>
import FooterPanel from "../components/panels/footerPanel";
import {actions} from "../store";
export default {
  name: "expired",
  middleware: ['serverRequired', 'nonauthed'],
  components: {FooterPanel}
}
</script>

<style scoped>
.min-h-screen {
  min-height: 90vh;
}
</style>
