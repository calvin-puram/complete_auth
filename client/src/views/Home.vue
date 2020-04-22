<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <h1 v-if="getUserName" id="welcome">Welcome {{ getUserName.name }}</h1>
    <h1
      id="home-page-title"
      class="d-flex justify-content-center align-items-center mt-5"
      v-else
    >
      Fullstack Auth Application
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>
