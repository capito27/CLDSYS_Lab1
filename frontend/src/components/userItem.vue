<template>
  <div class="userItem">
    <b-card
            :title="humanReadable"
            :sub-title="getDate"
            :bg-variant="this.user.active ? 'light' : 'dark'"
            :text-variant="this.user.active ? 'black' : 'white'"
            :sub-title-text-variant="this.user.active ? 'black' : 'white'"
    >
      <template v-slot:footer>
        <b-button v-on:click="onClickedChange" variant="info">Edit</b-button>
        <b-button v-on:click="sendDelete" variant="danger">Remove</b-button>
      </template>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "userItem",
  props: {
    user: Object
  },
  computed: {
    humanReadable() {
      return `${this.user.username} (${this.user.firstname} ${this.user.lastname})${this.user.active ? "" : " [INACTIVE]"}`;
    },
    getDate() {
      let moment = require('moment');
      return moment(this.user.membersince).format('MMMM Do YYYY, H:mm:ss');
    }
  },
  methods: {
    sendDelete: function() {
      this.$http
        .delete(`/admin/user/${this.user._id}`, {
          admin: this.user.admin,
          active: this.user.active
        })
        .then(res => {
          this.$events.$emit('toastSuccess', 'Deleted User');
          this.$emit('deleted');
        })
        .catch(err => {
          this.$events.$emit('toastError', 'Cannot delete User')
        });
    },
    onClickedChange: function() {
      this.$emit('edit-user', this.user);
    }
  }
};
</script>