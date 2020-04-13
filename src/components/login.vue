<template>
  <v-container>
    <v-card max-width="400px" class="mx-auto mt-md-6">
      <v-card-title>
        <h2 class="text-center mx-auto">ورود</h2>
      </v-card-title>
      <v-card-text class="d-inline-block">
        <transition name="slide" mode="out-in">
        <v-alert
          dense
          text
          color="red"
          type="info"
          class="mt-3 errMessage"
          v-if="message"
        >{{message}}</v-alert>
      </transition>
        <v-form ref="form" v-model="valid">
          <v-text-field
            color="#ff5722"
            prepend-icon="mdi-account-circle"
            v-model="userName"
            label="نام کاربری"
            required
          ></v-text-field>
          <v-text-field
            color="#ff5722"
            :type="isPassword? 'password' : 'text'"
            prepend-icon="mdi-lock"
            v-model="password"
            :append-icon="!isPassword? 'mdi-eye':'mdi-eye-off'"
            label="رمز عبور"
            @click:append="isPassword = !isPassword"
            required
          ></v-text-field>
          <v-divider class="mt-2"></v-divider>
          <v-btn @click="loginUser" class="white--text float-left mt-5" color="#ff5722">ورود</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script>
import md5 from "md5";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      userName: null,
      password: null,
      valid: true,
      isPassword: true,
      message:'',
      alertColor: "",
    };
  },
  computed: {
    ...mapGetters(["getUserName"])
  },
  methods: {
    loginUser() {
      let hashCode = md5("This is salt code");
      this.$http
        .post(
          "login/",
          {
            username: this.userName,
            password: this.password
          },
          {
            headers: {
              hash: hashCode
            }
          }
        )
        .then(
          response => {
            this.$store.commit("setUserToken", response.data.data.token);
            this.$store.commit("setUserId", response.data.data.user_id);
            this.$store.commit("setUserName", this.userName);
            localStorage.setItem("userId", response.data.data.user_id);
            localStorage.setItem("userName", this.getUserName);
            localStorage.setItem("userToken", response.data.data.token);
            let expireDuration =
              response.data.data.token_expire_duration * 1000;
            let today = new Date();
            let expireDate = today.getTime() + expireDuration;
            let tokenExpireDate = new Date(expireDate);
            localStorage.setItem("userTokenExpire", tokenExpireDate);
            this.$router.push("/");
          },
          (error) => {
            this.message =error.data.meta.message;
            setTimeout(() => {
              this.message = "";
            }, 3000);
          }
        );
    }
  }
};
</script>


<style lang="scss" scoped>
h2 {
  font-size: 1em;
}
.errMessage {
  font-size: 0.8em !important;
  i {
    font-size: 18px !important;
  }
}
</style>