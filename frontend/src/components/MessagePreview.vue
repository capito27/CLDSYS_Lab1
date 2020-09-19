<template>
  <div class="message-preview">
    <b-card v-if="message" :title="`Subject : ${message.subject}`" :sub-title="fromUser">
      <pre v-html="message.content"></pre>
      <template v-slot:footer>
        <small class="text-muted">Received {{ messageDate }}</small>
      </template>
    </b-card>
    <p v-else>No message selected for preview</p>
  </div>
</template>

<script>
export default {
  name: "message-preview",
  props: {
    message: Object,
    users: Map
  },
  computed: {
    fromUser() {
      let returnVal = ""
      if(this.users.get(this.message.author) == null) {
        returnVal = "Deleted User"
      } else {
        returnVal = `From : ${this.users.get(this.message.author).firstname} ${this.users.get(this.message.author).lastname}`
      }
      return returnVal
    },
    messageDate() {
      // Have a meaningful date for the users
      var moment = require("moment");
      return moment(this.message.date).format('MMMM Do YYYY, H:mm:ss a');
    }
  }
};
</script>