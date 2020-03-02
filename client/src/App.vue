<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" exact class="navbar-brand">MEVN</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor02"
        aria-controls="navbarColor02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor02">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link to="/" exact class="nav-link">Home</router-link>
          </li>
          <li class="nav-item" v-if="!auth">
            <router-link to="/register" exact class="nav-link"
              >Register</router-link
            >
          </li>
          <li class="nav-item" v-if="!auth">
            <router-link to="/login" exact class="nav-link">Login</router-link>
          </li>
          <li class="nav-item" v-if="auth">
            <a class="nav-link" href="#" @click.prevent="unsetAuth">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
a {
  font-size: 18px;
}
</style>
