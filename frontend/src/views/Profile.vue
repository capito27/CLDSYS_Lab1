<template>
  <div id="profile">
    <p>Firstname : {{ user.firstname }}</p>
    <p>Lastname : {{ user.lastname }}</p>
    <p>Username : {{ user.username }}</p>
    <b-card style="width: 35rem;" title="Modify your password :">
      <b-card-body>
        <b-form @submit="onSubmit">
          <b-form-group id="input-group-3" label="New Password" label-for="input-3">
            <b-form-input
              id="input-3"
              v-model="form.password"
              type="password"
              required
              placeholder="Password"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="Confirm password" label-for="input-4">
            <b-form-input
              id="input-4"
              v-model="form.confirmPass"
              type="password"
              required
              placeholder="Password"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "profile",
  data() {
    return {
      form: {
        confirmPass: "",
        password: ""
      }
    };
  },

  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    onSubmit() {
      if (this.form.confirmPass === this.form.password) {
        this.$http
          .post("/user/edit", {
            firstname: this.user.firstname,
            lastname: this.user.lastname,
            password: this.form.password
          })
          .then(res => {
            this.$events.$emit("toastSuccess", res.data);
          })
          .catch(err => {
            this.$events.$emit("toastError", err);
          });
      } else {
          this.$events.$emit('toastError', 'Passwords doesn\'t match')
      }
    }
  }
};
</script>