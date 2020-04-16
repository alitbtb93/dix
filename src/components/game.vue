<template>
  <v-container>
    <div class="fix-bar px-5 py-3 d-flex flex-column">
      <div class="d-flex justify-center my-1">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="leftsideicons" v-on="on">mdi-poll</v-icon>
          </template>
          <span>رتبه بندی</span>
        </v-tooltip>
      </div>
      <div class="d-flex justify-center my-1">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="leftsideicons" v-on="on">mdi-clipboard-text-outline</v-icon>
          </template>
          <span>قوانین</span>
        </v-tooltip>
      </div>
      <div class="d-flex justify-center my-1">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="leftsideicons" v-on="on">mdi-comment-processing-outline</v-icon>
          </template>
          <span>راهنما</span>
        </v-tooltip>
      </div>
      <div class="d-flex justify-center my-1">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="leftsideicons" v-on="on">mdi-clock-outline</v-icon>
          </template>
          <span>زمان</span>
        </v-tooltip>
      </div>
    </div>
    <div class="d-flex justify-center">
      <div
        v-for="(player,index) in otherPlayers"
        :key="index"
        class="othercards mx-5 mt-5 pb-1 pl-10 d-flex flex-row justify-center"
      >
        <v-card
          hover
          flat
          :class="{chosencard:chosenCard==card}"
          class="othercard"
          max-width="25px"
          v-for="(card,index) in player.in_hand_cards"
          :key="index"
        >
          <v-img :src="`http://127.0.0.1:8887/cards/backcard.jpg`"></v-img>
        </v-card>

        <div class="otheravatar" :class="{active:activePlayer==player.id}">
          <v-badge class="scorebadge" color="orange" :content="player.score.toString()"></v-badge>
          <v-img class="avatar-icon" :src="`http://127.0.0.1:8887/avatar/${player.color}.png`"></v-img>
        </div>
        <div flat class="othernamechip namechip ma-2" :class="{active:activePlayer==player.id}">
          <v-avatar v-if="player.game_creator" right>
            <v-icon class="mb-1" color="yellow" dark>mdi-star</v-icon>
          </v-avatar>
          {{player.name}}
        </div>
      </div>
    </div>
    <v-row class="mt-10">
      <v-col cols="12" md="3">
        <h4 class="text-center pb-0 mb-2">داستان:</h4>
        <v-divider></v-divider>
        <p class="storybox pt-3">{{mainStory}}</p>
      </v-col>
      <v-col cols="12" md="9">
        <div
          v-if="getGameStep>2"
          flat
          class="chosencards pa-4 pl-10 pb-8 d-flex flex-row justify-center"
        >
          <v-card
            flat
            hover
            :disabled="chosenCards.includes(card.toString())==true"
            :class="{chosencard:chosenCard==card}"
            class="mx-1 theircard"
            max-width="80px"
            v-for="(card,index) in closestCards"
            :key="index"
          >
            <v-img @click="showVote(card)" :src="`http://127.0.0.1:8887/cards/${card}.jpg`"></v-img>
            <div class="avatar" v-if="getGameStep==4">
              <v-img class="avatar-icon" :src="`http://127.0.0.1:8887/avatar/${card.color}.png`"></v-img>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <v-card flat class="mycards pa-4 pl-10 pb-8 d-flex flex-row justify-space-between">
          <v-card
            flat
            hover
            :disabled="(storyCard && chosenCard==card) || (storyCard && chosenCards.includes(card))"
            :class="{chosencard:chosenCard==card}"
            class="mx-1 mycard"
            max-width="95px"
            v-for="(card,index) in currentCards"
            :key="index"
          >
            <v-img @click="showImage(card)" :src="`http://127.0.0.1:8887/cards/${card}.jpg`">
              <v-btn
                v-if="(getGameStep==1 && role=='storyTeller') || (getGameStep==2 && role=='other' && !storyCard)"
                x-small
                class="choose"
                :class="{green: chosenCard==card || chosenCards.includes(card)}"
                fab
              >
                <v-icon color="white" medium>mdi-check</v-icon>
              </v-btn>
            </v-img>
          </v-card>

          <div class="avatar" :class="{active:activePlayer==currentPlayer.id}">
            <v-badge class="myscorebadge" color="orange" :content="currentPlayer.score.toString()"></v-badge>
            <v-img
              class="avatar-icon"
              :src="`http://127.0.0.1:8887/avatar/${currentPlayer.color}.png`"
            ></v-img>
          </div>
          <div class="namechip ma-2" :class="{active:activePlayer==currentPlayer.id}">
            <v-avatar v-if="currentPlayer && currentPlayer.game_creator" right>
              <v-icon class="mb-1" color="yellow" dark>mdi-star</v-icon>
            </v-avatar>
            {{getUserName}}
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="3">
        <div class="d-flex flex-column justify-center story" style="height:100%">
          <v-textarea
            v-if="role=='storyTeller' && !storyCard"
            :disabled="storyCard"
            v-model="story"
            outlined
            name="input-7-4"
            placeholder="داستانت رو تعریف کن!"
            background-color="white"
            filled
            color="green"
            hide-details
            class="mb-3"
          ></v-textarea>
          <v-btn
            :disabled="!chosenCard || !story"
            v-if="role=='storyTeller' && getGameStep==1 && !storyCard"
            width="100%"
            @click="submit"
            class="storybtn"
            color="green"
            large
          >ثبت داستان و کارت</v-btn>
          <v-btn
            :disabled="chosenCards==0"
            v-if="role=='other' && getGameStep==2 && !storyCard"
            width="100%"
            @click="submit"
            class="storybtn"
            color="green"
            large
          >انتخاب کارت مشابه</v-btn>
          <v-btn
            :disabled="!vote"
            v-if="role=='other' && getGameStep==3 && !voteStatus"
            width="100%"
            @click="sendVote"
            class="storybtn"
            color="green"
            large
          >انتخاب کارت قصه گو</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="fullImage" width="370" class="fullimage">
      <v-img
        class="fullimg"
        @click="chooseCard(fullCard)"
        contain
        max-height="90vh"
        :src="`http://127.0.0.1:8887/cards/${fullCard}.jpg`"
      >
        <v-icon @click="fullImage=false" class="closebtn" color="white">mdi-close</v-icon>
        <v-btn
          v-if="chooseTurn"
          class="choose"
          :class="{green: chosenCard==fullCard || chosenCards.includes(fullCard)}"
          fab
        >
          <v-icon
            v-if="chosenCard==fullCard || chosenCards.includes(fullCard)"
            color="white"
            x-large
          >mdi-check</v-icon>
        </v-btn>
      </v-img>
    </v-dialog>
    <v-dialog v-model="fullVote" width="370" class="fullimage">
      <v-img
        class="fullimg"
        @click="chooseVote(voteImg)"
        contain
        max-height="90vh"
        :src="`http://127.0.0.1:8887/cards/${voteImg}.jpg`"
      >
        <v-icon @click="fullImage=false" class="closebtn" color="white">mdi-close</v-icon>
        <v-btn v-if="role!='storyTeller' && !voteStatus" class="choose" :class="{green: vote==voteImg}" fab>
          <v-icon color="white" x-large>mdi-check</v-icon>
        </v-btn>
      </v-img>
    </v-dialog>
  </v-container>
</template>


<script>
import io from "socket.io-client";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      socket: null,
      currentPlayer: null,
      currentCards: [],
      fullImage: false,
      fullVote: false,
      fullCard: null,
      chosenCard: null,
      chosenCards: [],
      activePlayer: null,
      otherPlayers: [],
      message: "",
      story: "",
      mainStory: "",
      storyCard: false,
      numberOfPlayers: null,
      closestCards: null,
      vote: null,
      voteImg: null,
      role: null,
      voteStatus: false
    };
  },
  mounted() {
    this.sokcetInit();
  },
  watch: {},
  computed: {
    ...mapGetters([
      "getUserId",
      "getGameCode",
      "getPlayersNumber",
      "getUserName",
      "getCreateGame",
      "getGameStep"
    ]),
    chooseTurn() {
      if (this.getGameStep == 1 && this.activePlayer == this.getUserId) {
        console.log("case 1");
        return true;
      } else if (this.getGameStep == 2 && this.activePlayer != this.getUserId) {
        console.log("case 2");
        return true;
      }
      console.log("case 3");
      return false;
    }
  },
  methods: {
    sokcetInit() {
      let localGameCode = localStorage.getItem("gameCode");
      if (!this.getGameCode && localGameCode) {
        this.$store.commit("setGameCode", localGameCode);
      }
      this.socket = io("213.233.180.121:8080");
      this.socket.emit("join_game", {
        game_code: this.getGameCode,
        user_id: this.getUserId,
        username: this.getUserName
      });
      this.socket.on("get_state", data => {
        this.$store.commit("setGameStep", data.step);
        this.numberOfPlayers = data.number_of_players;
        this.players = data.players;
        this.mainStory = data.story;
        this.closestCards = data.closest_cards;
        if(this.getGameStep==4){
          this.otherPlayers=[]
        }
        this.players.forEach((item, index) => {
          if (item.id == this.getUserId) {
            this.currentPlayer = this.players[index];
          } else {
            if (this.otherPlayers.length != data.players.length - 1) {
              this.otherPlayers.push(item);
            }
          }
        });
        this.currentCards = this.currentPlayer.in_hand_cards;
        this.activePlayer = data.active_user_id;
        if (this.activePlayer == this.getUserId) {
          this.role = "storyTeller";
        } else {
          this.role = "other";
        }
        if(this.getGameStep==4){
          this.socket.emit("next_round", {
          game_code: this.getGameCode
        });
        this.newRound()
        }
        console.log(data);
        this.generateMessage();
      });
    },
    showImage(card) {
      this.fullImage = true;
      this.fullCard = card;
    },
    showVote(card) {
      this.fullVote = true;
      this.voteImg = card;
    },
    chooseCard(card) {
      if (this.numberOfPlayers == 3) {
        if (this.getGameStep == 2) {
          if (this.currentCards.includes(card)) {
            let pastCard = this.currentCards.indexOf(card);
            this.currentCards.splice(pastCard, 1);
          } else {
            this.chosenCards.push(card);
          }
        }
      } else {
        if (this.getGameStep == 2) {
          this.chosenCards = [card];
        }
      }
      if (this.getGameStep == 1) {
        this.chosenCard = card;
      }
    },
    generateMessage() {
      console.log(this.getUserId);
      console.log(this.activePlayer);
      if (this.getUserId == this.activePlayer) {
        switch (this.getGameStep) {
          case 1:
            this.message =
              "کارتت رو انتخاب کن و داستانت رو برای بقیه بنویس و ارسال کن.";
            break;
          case 2:
            this.message = "";
            break;
          case 3:
            this.message = "";
            break;
        }
      } else {
        switch (this.getGameStep) {
          case 1:
            this.message = "";
            break;
          case 2:
            this.message =
              "کارتی که فکر میکنی بیشترین شباهت به داستان داره رو انتخاب کن.";
            break;
          case 3:
            this.message = " کارتی که فکر میکنی مال قصه گو بوده رو انتخاب کن.";
            break;
        }
      }
    },
    submit() {
      if (this.getGameStep == 1) {
        console.log("tellstory");
        this.socket.emit("tell_story", {
          game_code: this.getGameCode,
          user_id: this.getUserId,
          story: this.story,
          story_card: parseInt(this.chosenCard)
        });
      } else {
        console.log("closecard");
        this.socket.emit("send_close_card", {
          game_code: this.getGameCode,
          user_id: this.getUserId,
          close_card: this.chosenCards
        });
      }
      this.storyCard = true;
    },
    chooseVote(vote) {
      this.vote = vote;
    },
    sendVote() {
      this.socket.emit("send_vote", {
        game_code: this.getGameCode,
        user_id: this.getUserId,
        vote_card: this.vote
      });
      this.voteStatus = true;
    },
    newRound(){
      this.currentPlayer= null,
      this.currentCards= [],
      this.fullImage= false,
      this.fullVote= false,
      this.fullCard= null,
      this.chosenCard= null,
      this.chosenCards= [],
      this.activePlayer= null,
      this.otherPlayers= [],
      this.message= "",
      this.story= "",
      this.mainStory= "",
      this.storyCard= false,
      this.numberOfPlayers= null,
      this.closestCards= null,
      this.vote= null,
      this.voteImg= null,
      this.role= null,
      this.voteStatus= false
    }
  }
};
</script>

<style lang="scss" scoped>
.mycards {
  border-radius: 5px;
  border: dashed 2px #2c3e50;
}
.othercards {
  min-width: 169px;
  position: relative;
}
.mycard {
  transition: all 0.3s;
  &:hover {
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
  }
  &.chosencard {
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
  }
}
.namechip {
  border-radius: 5px;
  border: dashed 2px #2c3e50;
  background: white;
  position: absolute;
  font-size: 16px;
  bottom: -30px;
  font-weight: 500;
  height: 44px;
  left: 113px;
  width: 155px;
  display: flex;
  align-items: center;
  direction: ltr;
  padding-left: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  transform: translateX(-50%);

  &.active {
    border: solid 4px green;
  }
}
.othernamechip {
  font-size: 14px;
  left: 85px;
  padding-left: 30px;
  height: 30px;
  box-shadow: none;
  border: dashed 2px #2c3e50;
  border-radius: 5px;
  padding-top: 2px;
}
.closebtn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}
.fullimage {
  position: relative;
  background: white;
}
.fullimg {
  cursor: pointer;
}
.avatar {
  z-index: 2;
  position: absolute;
  left: -51px;
  width: 100px;
  bottom: -50px;
  background: white;
  border-radius: 50% !important;
  border: dashed 2px #2c3e50;
  &.active {
    border: solid 5px green;
  }

  .avatar-icon {
    font-size: 100px;
  }
}
.otheravatar {
  z-index: 2;
  position: absolute;
  left: -15px;
  width: 50px;
  bottom: -33px;
  background: white;
  border: dashed 2px #2c3e50;
  border-radius: 50% !important;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  &.active {
    border: solid 5px green;
  }
}
.choose {
  position: absolute;
  left: 10px;
  bottom: 10px;
}
.othercard {
  margin: 0 -17px;
  transform: rotate(20deg);
  cursor: default;
  &:nth-child(odd) {
    left: -11px;
  }
  &:nth-child(even) {
    right: 11px;
  }
}
.hint {
  font-size: 14px;
}
.storyfield {
  max-width: 400px;
  height: 44px;
}
.scorebadge {
  position: absolute;
  top: -3px;
  z-index: 1;
}
.myscorebadge {
  position: absolute;
  top: -5px;
  z-index: 1;
  right: 20px;
}
.storybox {
  min-height: 100px;
}
.fix-bar {
  position: fixed;
  left: 30px;
  top: 110px;
  background: white;
  width: 35px;
  font-size: 13px;
  border-radius: 5px;
}
.leftsideicons {
  cursor: pointer;
  font-size: 26px;
  transition: all 0.3s;
  &:hover {
    color: green;
  }
}
.storybtn {
  color: white;
}
.theircard {
  position: relative;
  border: solid 3px white;
  .avatar {
    position: absolute;
    bottom: -19px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 40px;
    border: solid 2px white;
  }
}
</style>

