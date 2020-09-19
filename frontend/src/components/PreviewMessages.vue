<template>
  <div class="preview-messages">
    <b-modal id="modal-2" title="New Message">
      <create-message :users="apiUsers" :subject="currentSubject" :content="currentContent" :userID="currentUser" modalName="modal-2"/>
    </b-modal>
    <div v-if="messages.length !== 0" class="message">
      <b-card
        :bg-variant="isSelected === message._id ? 'secondary' : message.read ? 'light' : 'primary'"
        :text-variant="isSelected === message._id ? 'white' : 'dark'"
        :sub-title-text-variant="isSelected === message._id ? 'white' : 'dark'"
        class="messagePreview"
        v-for="(message, index) in messages"
        :key="message._id"
        v-on:click="onSelect(message._id)"
        :title="message.subject"
        :sub-title="subTitle(message)"
      >
        <template v-slot:footer>
          <small :class="isSelected === message._id ? 'text-white' : 'text-muted'">Received {{ messageDate(message) }}</small>
          <b-button @click="replyMessage(message.subject, message.content, message.author)" style="float:right">Reply</b-button>
          <b-button v-if="isInbox" v-on:click="removeMessage(message._id, index)" style="float:right" variant="danger">Remove</b-button>
        </template>
      </b-card>
    </div>
    <p v-else>No messages yet</p>
  </div>
</template>

<script>
import CreateMessage from "@/components/CreateMessage.vue";
export default {
  name: "preview-messages",
  components: {
    CreateMessage
  },
  props: {
    messages: Array,
    users: Map,
    apiUsers: Array,
    isInbox: Boolean
  },
  data() {
    return {
      isSelected: 0,
      currentContent: "",
      currentSubject: "",
      currentUser: ""
    };
  },
  mounted() {
    if (this.messages.length != 0) {
      this.isSelected = this.messages[0]._id;
    }
  },
  methods: {
    // Emit event to select message for Home component
    onSelect(id) {
      this.$emit("select-message", id);
      this.isSelected = id;
    },
    // Format the date for user friendly format
    messageDate(message) {
      var moment = require("moment");
      return moment(message.date).fromNow();
    },
    // Pass message to creteMessage
    replyMessage(subject, content, userId) {
      this.currentContent = content;
      this.currentSubject = subject;
      this.currentUser = userId
      this.$bvModal.show("modal-2");
    },
    removeMessage(id, index) {
      this.$http
              .delete(`/mail/${id}`)
              .then(res => {
                console.log(res.data);
                this.$events.$emit('toastSuccess', 'Deleted mail');
                this.$emit('delete-mail', id);
                this.messages.splice(index, 1);
              })
              .catch(err => {
                console.log(err);
                this.$events.$emit('toastError', 'Cannot delete this mail.')
              });
    },
    subTitle(message) {
      let returnVal = ""
      if(this.users.get(message.author) == null) {
        returnVal = "Deleted User"
      } else {
        returnVal = `From : ${this.users.get(message.author).firstname} ${this.users.get(message.author).lastname}`
      }
      return returnVal
    }
  }
};
</script>