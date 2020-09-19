<template>
  <div id="app">
    <div id="nav">
      <router-link v-if="!isLogged" to="/">Login</router-link>
      <router-link v-if="isLogged" to="/home">Home</router-link>
      <router-link v-if="isLogged" to="/profile">Profile</router-link>
      <router-link v-if="isAdmin" to="/adminPanel">Admin Panel</router-link>
      
      <a v-if="isLogged" v-on:click="logout" href="#">Logout</a>
    </div>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from '@/store';

export default {
  name: "app",
  mounted () {
    // Getting the toastError and toastSuccess event and toast messages via bootstrap vue
    this.$events.$on('toastError', (message) => {
      /*eslint-disable*/
      this.$bvToast.toast(message, { autoHideDelay : 3000, title: 'Error', variant: 'danger', solid: true})
      /*eslint-enable*/
    });
    this.$events.$on('toastSuccess', (message) => {
      /*eslint-disable*/
      this.$bvToast.toast(message, { autoHideDelay : 3000, title: 'Success', variant: 'success', solid: true})
      /*eslint-enable*/
    });
  },
  computed: {
    // Getting the currently connected informations from VueX
    ...mapGetters(["user"]),
    isAdmin() {
      if (this.user) {
        if (this.user.admin) {
          return this.user.admin;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    isLogged () {
      if (this.user.active) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    logout() {
      document.cookie = "x-auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      store.dispatch('removeUser')
      window.location.replace('/')
    }
  }
}
</script>

<style>
  body {
    overflow: scroll;
  }
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 10px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
