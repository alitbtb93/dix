<template>
  <v-card class="mx-auto my-10" max-width="300px">
    <v-list class="pb-0">
      <h3 class="text-center py-4">لیست بازیکنان</h3>
      <v-subheader class="gamecode">کد بازی: {{getGameCode}}</v-subheader>
      <v-list-item :disabled="!item.is_connected"  class="userslist"  v-for="(item,index) in players" :key="index">
        
          
          {{index+1+'.'}}<v-icon v-if="item.is_connected" class="mr-1 mb-1" color="green">mdi-account-check</v-icon>
          <v-icon :disabled="!item.is_connected" v-if="!item.is_connected" class="mr-1 mb-1" color="red">mdi-account-remove</v-icon>
        

        <v-list-item-content class="d-flex">
          <v-list-item-title v-text="item.name"></v-list-item-title>
          
        </v-list-item-content>
        
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import io from "socket.io-client";
export default {
  data() {
    return {
      socket: {},
      players: []
    };
  },
  computed: {
    ...mapGetters([
      "getUserId",
      "getGameCode",
      "getPlayersNumber",
      "getUserName",
      "getCreateGame"
    ])
  },
  mounted() {
    let localGameCode = localStorage.getItem("gameCode");
    if (!this.getGameCode && localGameCode) {
      this.$store.commit("setGameCode", localGameCode);
    }
    this.socket = io("213.233.180.121:8080");
    if (this.getCreateGame) {
      this.socket.emit("create_game", {
        game_code: this.getGameCode,
        number_of_players: this.getPlayersNumber,
        user_id: this.getUserId,
        username: this.getUserName
      });
    }else{
      this.socket.emit("join_game", {
      game_code: this.getGameCode,
      user_id: this.getUserId,
      username:this.getUserName
    });
    }
    this.socket.on("get_state", data => {
      this.$store.commit("setGameStep", data.step);
      this.players = data.players;
      if(data.step==1){
        this.$router.push('/game')
      }
      console.log(data);
    });
  }
};
</script>

<style lang="scss" scoped>
.userslist{
  direction: ltr;
  border-bottom:solid 2px #ccc;
  &:last-child{
    border-bottom: none;
  }
}
.gamecode{
   border-bottom:solid 2px #ccc;
}
</style>