<template>
  <div class="backColor">
    <v-container class="pt-0 d-none d-sm-block">
      <div class="position-relative mx-auto">
        <img
          class="main-banner d-none d-sm-block"
          src="../assets/dixit-banner.jpg"
          alt="dixit banner"
        />
        <div class="d-flex flex-column action-buttons-desktop">
          <v-btn @click="createGameBtn" class="mb-2" color="#ff5722" x-large dark>ساخت بازی</v-btn>
          <v-dialog v-model="createGameDialog" max-width="340">
            <v-card>
              <v-card-title>ساخت بازی جدید</v-card-title>
              <v-divider></v-divider>
              <p class="pa-3 mb-0">تعداد نفرات بازی را انتخاب کنید:</p>
              <v-card-text class="pb-0">
                <v-select
                  :outlined="true"
                  :dense="true"
                  :error-messages="error"
                  color="#ff5722"
                  v-model="playersNumber"
                  :items="items"
                ></v-select>
              </v-card-text>
              <v-card-actions class="mt-0 pt-0">
                <v-spacer></v-spacer>
                <v-btn color="#ff5722" dark @click="createGame">انتخاب</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn color="#ff5722" @click="startGameBtn" x-large dark>ورود به بازی</v-btn>
          <v-dialog v-model="startGameDialog" max-width="340">
            <v-card>
              <v-card-title>ورود به بازی</v-card-title>
              <v-divider></v-divider>
              <p class="pa-3 mb-0">کد بازی را وارد کنید:</p>
              <v-card-text class="pb-0">
                <v-text-field dense v-model="gameCode" color="#ff5722" label="کد بازی" :outlined="true"></v-text-field>
              </v-card-text>
              <v-card-actions class="mt-0 pt-0">
                <v-spacer></v-spacer>
                <v-btn color="#ff5722" dark @click="startGame">ورود</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-container>

    <div class="position-relative d-sm-none">
      <img class="d-sm-none main-banner" src="../assets/dixit-banner-mobile.jpg" alt="dixit banner" />
      <div class="d-flex flex-column action-buttons">
        <v-btn class="mb-2" @click="createGameBtn" color="#ff5722" x-large dark>ساخت بازی</v-btn>
        <v-btn color="#ff5722" @click="startGameBtn" x-large dark>ورود به بازی</v-btn>
      </div>
    </div>
  </div>
</template>


<script>
import md5 from "md5";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      createGameDialog: false,
      startGameDialog: false,
      items: [3, 4, 5, 6],
      error: "",
      playersNumber: 3,
      gameCode: null
    };
  },
  computed: {
    ...mapGetters(["getUserId", "getUserToken"])
  },
  methods: {
    createGame() {
      const hashCode = md5(
        this.getUserId + this.getUserToken + "This is salt code"
      );
      this.$store.commit("setPlayersNumber", this.playersNumber);
      this.$http
        .post(
          "http://213.233.180.121:8000/api/game/create/",
          {
            number_of_players: this.playersNumber
          },
          {
            headers: {
              hash: hashCode,
              userid: this.getUserId.toString(),
              token: this.getUserToken
            }
          }
        )
        .then(
          response => {
            if (response.data.meta.success == 1) {
              this.$store.commit("setGameId", response.data.data.game.id);
              this.$store.commit("setGameCode", response.data.data.game.code);
              localStorage.setItem("gameCode", response.data.data.game.code);
              this.$store.commit("setCreateGame",true)
              this.$router.push("/lobby");
            }
          },
          () => {
            this.error = "ارتباط با سرور برقرار نشد!";
            setTimeout(() => {
              this.error = "";
            }, 3000);
          }
        );
    },
    createGameBtn() {
      if (this.getUserToken) {
        this.createGameDialog = true;
      } else {
        this.$router.push("/login");
      }
    },
    startGameBtn() {
      if (this.getUserToken) {
        this.startGameDialog = true;
      } else {
        this.$router.push("/login");
      }
    },
    startGame() {
      const hashCode = md5(
        this.getUserId + this.getUserToken + "This is salt code"
      );
      this.$store.commit("setGameCode", this.gameCode);
      this.$http
        .post(
          "http://213.233.180.121:8000/api/game/enter/",
          {
            game_code: this.gameCode
          },
          {
            headers: {
              hash: hashCode,
              userid: this.getUserId.toString(),
              token: this.getUserToken
            }
          }
        )
        .then(
          response => {
            if (response.data.meta.success == 1) {
              this.$store.commit("setGameId", response.data.data.game.id);
              this.$store.commit("setGameCode", response.data.data.game.code);
              localStorage.setItem("gameCode", response.data.data.game.code);
              this.$router.push("/lobby");
            }
          },
          () => {
            this.error = "ارتباط با سرور برقرار نشد!";
            setTimeout(() => {
              this.error = "";
            }, 3000);
          }
        );
    }
  }
};
</script>

<style lang='scss' scoped>
$backColor: #fff498;
$mainHover: #ff5722;
.backColor {
  background: $backColor !important;
}
.main-banner {
  display: block;
  max-width: 100%;
  height: auto;
}
.position-relative {
  position: relative;
  max-width: 1186px;
}
.action-buttons {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
}
.action-buttons-desktop {
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 10%;
}
main {
  background: $backColor;
}
</style>