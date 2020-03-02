<template>
  <h1 class="text-center text-secondary mt-5">Confirming Account...</h1>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: mapGetters(['getErrors']),
  methods: {
    ...mapActions(['confirmAccount'])
  },
  mounted() {
    this.confirmAccount({ token: this.$route.params.token }).then(res => {
      if (res && res.data.success) {
        this.setAuth(res.data);
        this.$noty.success('Your Account has been confirmed');
      } else {
        this.$noty.error(this.getErrors);
        this.$router.push('/');
      }
    });
  }
};
</script>
