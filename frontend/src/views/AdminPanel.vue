<template>
  <div class="adminPanel">
    <b-modal id="modal-1" title="Create a user">
      <create-user v-on:created="onCreateUser"/>
    </b-modal>

    <b-modal id="modal-10" title="Modify a user">
      <modify-user v-on:modified="onModified" :user="user"/>
    </b-modal>

    <b-container>
      <b-row>
        <b-col cols="6" offset="3">
          <h1 v-if="this.users.length == 0">No users !</h1>
          <user-item v-on:edit-user="onEditUser" v-else v-for="(currentUser, index) in users" :key="currentUser._id" :user="currentUser" @deleted="onDeleteUser(index)"/>
        </b-col>
        <b-col cols="2">
          <b-button v-b-modal.modal-1 variant="info">Add user</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="css">
  .userItem {
    margin-bottom: 20px;
  }
  .userItem .card-footer{
    text-align: right;
  }
  .userItem .card-footer button {
    margin: 0 5px;
  }

</style>

<script>
import userItem from "../components/userItem.vue";
import CreateUser from '@/components/CreateUser.vue'
import ModifyUser from '@/components/ModifyUser.vue'


export default {
  name: "adminPanel",
  data() {
    return {
      users: [],
      user: null
    };
  },
  created() {
    this.$http
      .get("/users")
      .then(response => {
        this.users = response.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  components: {
    userItem,
    CreateUser,
    ModifyUser
  },
  methods: {
    onDeleteUser(index) {
      this.users.splice(index, 1);
    },
    onCreateUser(user) {
      this.users.push(user);
    },
    onEditUser: function (userToEdit) {
      this.user = userToEdit
      this.$bvModal.show("modal-10")
    },
    onModified(userEdited) {
      let count = 0
      for(let currentUser of this.users) {
        if(currentUser._id === userEdited._id){
          this.users[count] = userEdited
        }
        count++
      }
      this.$forceUpdate()
    }
  }
};
</script>