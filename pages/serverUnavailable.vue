<template>
  <div>
    <div class="hero min-h-screen">
      <div class="hero-content">
        <div class="max-w-md">
          <div class="card shadow">
            <div class="panel">
              <div class="flex justify-center">
                <div class="badge badge-lg badge-error">Сервер недоступен</div>
              </div>

              <h2 class="font-bold text-center mt-2">Ошибка получения данных с сервера<br>Обратитесь к администратору или попробуйте позже</h2>

              <div class="modal-action mt-2 justify-center">
                <NuxtLink to="/" class="btn btn-warning">На главную</NuxtLink>
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
export default {
  name: "serverUnavailable"
}
</script>

<style scoped>

</style>
