<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">

      <b-form-group id="input-group-3" label="Username" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.username"
          required
          placeholder="Username"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Password" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="form.password"
          type="password"
          required
          placeholder="Password"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Firstname" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.firstname"
          required
          placeholder="Put your fisrtname"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-1" label="Lastname" label-for="input-1">
        <b-form-input id="input-1" v-model="form.lastname" required placeholder="Put your lastname"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-6" label="Admin user" label-for="checkbox-1">
        <b-form-checkbox
          id="checkbox-1"
          v-model="form.admin"
          name="checkbox-1"
        >User is admin</b-form-checkbox>
      </b-form-group>

      <b-form-group id="input-group-5" label="Active user" label-for="checkbox-2">
        <b-form-checkbox
          id="checkbox-2"
          v-model="form.active"
          name="checkbox-2"
        >User is active</b-form-checkbox>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        lastname: "",
        firstname: "",
        username: "",
        password: "",
        admin: false,
        active: false
      },
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      let user = {
        username: this.form.username,
        password: this.form.password,
        firstname: this.form.firstname,
        lastname: this.form.lastname,
        admin: this.form.admin,
        active: this.form.active
      };
      evt.preventDefault();
      this.$http.post('/admin/user/new', user)
      .then((res) => {
        user._id = res.data;
        this.$events.$emit('toastSuccess', 'User successfully added.');
        this.$emit('created', user);
        this.$bvModal.hide("modal-1");
      })
      .catch((err)=> {
        this.$events.$emit('toastError', 'Cannot create such user')
      });
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.lastname = "";
      this.form.firstname = "";
      this.form.username = "";
      this.form.password = "";
      this.form.admin = false;
      this.form.active = false;
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>