<template>
  <div id="login">
    <b-card style="width: 35rem;">
      <div class="card-body">
        <h4 class="card-title mb-4 mt-1">Sign in</h4>
        <div class="form-group">
          <label>Your username</label>
          <input class="form-control" :class="{'is-invalid' : isInvalid}" v-model="user" placeholder="Username" type="username" />
        </div>
        <!-- form-group// -->
        <div class="form-group">
          <!-- <router-link class="float-right" to="/reset">Forgot?</router-link> -->
          <label>Your password</label>
          <input class="form-control" :class="{'is-invalid' : isInvalid}" v-model="pass" placeholder="******" type="password" />
        </div>
        <!-- form-group// -->
        <div class="form-group">
          <button type="submit" v-on:click="login" class="btn btn-primary btn-block">Login</button>
        </div>
      </div>
    </b-card>
    <!-- card.// -->
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      user : null,
      pass : null,
      isInvalid : null
    }
  },
  methods : {
    login ()  {
      this.$http.post('/login', { username: this.user, password: this.pass })
      .then((res) => {
        if(res.data != 'fail') {
          this.$router.push('home')
        } else {
          this.$events.$emit('toastError', res.data);
          this.isInvalid = true
        }
      }).catch((err) => {
        this.$events.$emit('toastError', err)
        this.isInvalid = true
      })
    }
  }
};
</script>
<style>
    .card {
        margin-right: auto;
        margin-left: auto;
        text-align: left;
    }
</style>