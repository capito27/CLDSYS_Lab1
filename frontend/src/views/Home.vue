<template>
  <div class="home">
    <b-modal id="modal-1" title="New Message">
      <create-message :users="usersFromAPI" :subject="null" :content="null" :userID="null" modalName="modal-1"/>
    </b-modal>
    <b-container class="container">
      <b-row>
        <b-col cols="2">
          <b-card :bg-variant="isInbox ? 'secondary' : 'light'" :text-variant="isInbox ? 'white' : 'black'" v-on:click="onFetchInbox">Inbox  <b-badge variant="info">{{ numberUnread }}</b-badge></b-card>
          <b-card :bg-variant="!isInbox ? 'secondary' : 'light'" :text-variant="!isInbox ? 'white' : 'black'" v-on:click="onFetchOutbox" >Outbox</b-card>
          <b-button v-b-modal.modal-1 variant="outline-info" :block="true">New Message</b-button>
        </b-col>
        <b-col cols="4">
          <PreviewMessages :isInbox="isInbox" v-on:delete-mail="deleteMail" v-on:select-message="onSelectMessage" :users="users" :apiUsers="usersFromAPI" :messages="messages" />
        </b-col>
        <b-col cols="6">
          <MessagePreview :users="users" :message="selectedMessage" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="css">
  .messagePreview {
    margin-bottom: 10px;
  }
</style>

<script>
import PreviewMessages from "@/components/PreviewMessages.vue";
import MessagePreview from "@/components/MessagePreview.vue";
import CreateMessage from '@/components/CreateMessage.vue';

export default {
  name: "home",
  components: {
    PreviewMessages,
    MessagePreview,
    CreateMessage
  },
  data() {
    return {
      messages: [],
      selectedMessage: null,
      usersFromAPI: [{text : 'Select one', value : null}],
      isInbox: true,
      users: null
    };
  },
  created() {
    this.$http
      .get("/inbox")
      .then((res) => {
        this.messages = res.data;
        this.selectedMessage = this.messages[0];
      })
      .catch(err => {
        this.selectedMessage = this.messages[0];
        console.log(err)
        this.$events.$emit('toastError', 'Cannot retrieve messages at the moment')
      });
    this.$http
      .get("/users")
      .then((res) => {
        this.users = new Map()
        for (let currentUser of res.data) {
          this.users.set(currentUser._id, currentUser)
          this.usersFromAPI.push({text: currentUser.firstname + " " + currentUser.lastname, value: currentUser._id})
        }
      }).catch((err) => {
        console.log(err)
        this.$events.$emit('toastError', 'Cannot retrieve users at the moment')
      })
  },
  methods: {
    onSelectMessage: function(idSelected) {
      this.$http
        .get("/mail/" + idSelected)
        .then(res => {
          this.selectedMessage = res.data;
          // Just to be sure to update unread messages
          if(this.isInbox) {
            this.onFetchInbox()
          } else {
            this.onFetchOutbox()
          }
        })
        .catch(err => {
          console.log(err)
        });
    },
    onFetchInbox: function() {
      this.isInbox = true
      this.$http
        .get("/inbox")
        .then(res => {
          this.messages = res.data;
          //this.selectedMessage = this.messages[0];
        })
        .catch(err => {
          console.log(err);
        });
    },
    onFetchOutbox: function() {
      this.isInbox = false
      this.$http
        .get("/outbox")
        .then(res => {
          this.messages = res.data;
          //this.selectedMessage = this.messages[0];
        })
        .catch(err => {
          console.log(err)
          this.$events.$emit('toastError', 'Cannot retrieve messages at the moment')
        });
    },
    deleteMail(id) {
      console.log(id);
      if(this.selectedMessage._id === id) {
        this.selectedMessage = null;
      }
    }
  },
  computed : {
    numberUnread () {
      let unread = 0
      if(this.isInbox){
        for(let currentMessage of this.messages) {
          if(currentMessage.read != true) {
            unread++
          }
        }
      }
      return unread
    }
  },
  watch: {
    isInbox: function() {
      this.selectedMessage = null
    }
  }
};
</script>
