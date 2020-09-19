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
  props : {
    user: Object
  },
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
  mounted () {
    // We pre-fill in the form with the info given
    if(this.user !== undefined) {
      this.form.lastname = this.user.lastname,
      this.form.firstname = this.user.firstname,
      this.form.username = this.user.username,
      this.form.active = this.user.active,
      this.form.admin = this.user.admin
    }
  },
  methods: {
    onSubmit(evt) {
      let user = {
        username: this.form.username,
        firstname: this.form.firstname,
        lastname: this.form.lastname,
        admin: this.form.admin,
        active: this.form.active
      };
      evt.preventDefault();
      this.$http.post(`/admin/user/${this.user._id}/edit/`, user)
      .then((res) => {
        this.$events.$emit('toastSuccess', res.data);
        user._id = this.user._id;
        this.$emit('modified', user);
        this.$bvModal.hide("modal-10")
      })
      .catch((err)=> {
        this.$events.$emit('toastError', 'Cannot modify such user at the moment')
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