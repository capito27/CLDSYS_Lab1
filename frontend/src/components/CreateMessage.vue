<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-3" label="Recipient:" label-for="input-3">
        <b-form-select id="input-3" v-model="form.user" :options="users" required></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-2" label="Subject" label-for="input-2">
        <b-form-input id="input-2" v-model="form.subject" required placeholder="Subject"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-1" label="Message" label-for="input-1">
        <b-form-textarea
          id="input-1"
          v-model="form.message"
          required
          placeholder="Write your message"
          rows="5"
        ></b-form-textarea>
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
        message: "",
        subject: "",
        user: null
      },
      show: true
    };
  },
  props: {
    users: Array,
    subject: String,
    content: String,
    userID: String,
    modalName: String
  },
  mounted () {
    // If the message is a reply we fill in the fields
    if(this.subject !== null && this.content !== null) {
      this.form.message = "----------(Message précédent)-------\r" + this.content
      this.form.subject = "RE : " + this.subject
      console.log(this.users)
      this.form.user = this.userID
    }
  },
  methods: {
    // Submitted message
    onSubmit(evt) {
      evt.preventDefault();
      this.$http
        .post("/mail/send", {
          recipient: this.form.user,
          subject: this.form.subject,
          content: this.form.message
        })
        .then((res) => {
          // We use the modalName passed to hide
          this.$bvModal.hide(this.modalName);
          this.$events.$emit("toastSuccess", res.data);
        })
        .catch((err) => {
          console.log(err)
          this.$events.$emit("toastError", 'Cannot send message at the moment');
        })
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.message = "";
      this.form.subject = "";
      this.form.user = null;
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>