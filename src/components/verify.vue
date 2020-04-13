<template>
  <v-card max-width="400" class="mx-auto mt-md-6">
    <v-card-title>
      <h2 class="text-center mx-auto">تایید شماره موبایل</h2>
    </v-card-title>
    <v-card-text class="d-inline-block">
      <transition name="slide" mode="out-in">
        <v-alert
          dense
          text
          :color="alertColor"
          type="info"
          class="mt-3 errMessage"
          v-if="message"
        >{{message}}</v-alert>
      </transition>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-if="!changeMobile"
          color="#ff5722"
          prepend-icon="mdi-check-circle"
          v-model="verify"
          label="کد تایید"
          required
        ></v-text-field>
        <div class="timer-div d-flex justify-end">زمان باقی مانده: {{minutes}}:{{seconds}}</div>
        <v-text-field
          color="#ff5722"
          prepend-icon="mdi-cellphone-iphone"
          v-model="mobileNumber"
          :counter="11"
          v-if="changeMobile"
          @blur="mobileNumberValidate"
          :error-messages="mobileNumberErrors"
          :rules="mobileNumberRules"
          :loading="mobileNumberLoad"
          label="شماره موبایل"
          required
        ></v-text-field>
        <v-btn
          v-if="!changeMobile"
          :disabled="!verify"
          @click="verifyUser"
          class="white--text float-left mt-5"
          color="#ff5722"
        >تایید</v-btn>
        <v-btn
          v-if="changeMobile"
          :disabled="!valid"
          @click="changeMobileRequest"
          class="white--text float-left mt-5"
          color="#ff5722"
        >تغییر شماره</v-btn>
        <v-btn
          :disabled="hasTime"
          depressed
          class="my-text px-2 mt-6"
          color="#212121"
          text
          small
          @click="changeMobileNumber"
        >تغییر موبایل</v-btn>
        <v-btn
          :disabled="hasTime"
          @click="resend"
          depressed
          class="my-text px-2 mt-6"
          color="#212121"
          text
          small
        >ارسال مجدد</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>


<script>
import { mapGetters } from "vuex";
import md5 from "md5";
export default {
  data() {
    return {
      verify: "",
      timeLeft: 110000,
      minutes: 1,
      seconds: 50,
      hasTime: true,
      message: "",
      alertColor: "",
      changeMobile: false,
      mobileNumber: null,
      valid: true,
      mobileNumberLoad: false,
      mobileNumberErrors: [],
      mobileNumberRules: [
        v => !!v || "فیلد شماره موبایل الزامی است!",
        v => /^\d+$/.test(v) || "فیلد شماره موبایل عددی است!",
        v => (v && v.length == 11) || "فیلد شماره مویابل 11 رقمی است!"
      ]
    };
  },
  computed: {
    ...mapGetters(["getUserName", "getMobileNumber"])
  },
  methods: {
    verifyUser() {
      let hashCode = md5(
        this.verify + this.getMobileNumber + "This is salt code"
      );
      this.$http
        .post("verify/", null, {
          headers: {
            phone: this.getMobileNumber,
            hash: hashCode
          }
        })
        .then(
          response => {
            this.$store.commit("setUserToken", response.data.data.token)
            this.$store.commit("setUserId", response.data.data.user_id)
            localStorage.setItem('userId',response.data.data.user_id)
            localStorage.setItem('userName',this.getUserName)
            localStorage.setItem('userToken',response.data.data.token)
            let expireDuration=response.data.data.token_expire_duration*1000
            let today=new Date()
            let expireDate=(today.getTime())+expireDuration
            let tokenExpireDate=new Date(expireDate)
            localStorage.setItem('userTokenExpire',tokenExpireDate)
            this.$router.push("/")
          },
          () => {
            this.message =
              "ارتباط با سرور برقرار نشد، لطفا دوباره تلاش نمایید.";
            setTimeout(() => {
              this.message = "";
            }, 3000);
          }
        );
    },
    timer() {
      var myTimer = setInterval(() => {
        if (this.timeLeft == 0) {
          clearInterval(myTimer);
          this.minutes = 0;
          this.seconds = 0;
          this.timeLeft = 110000;
          this.hasTime = false;
        }
        this.minutes = Math.floor(
          (this.timeLeft % (1000 * 60 * 60)) / (1000 * 60)
        );
        var timerSeconds = Math.floor((this.timeLeft % (1000 * 60)) / 1000);
        if (timerSeconds < 10) {
          this.seconds = "0" + timerSeconds;
        } else {
          this.seconds = timerSeconds;
        }
        this.timeLeft -= 1000;
      }, 1000);
    },
    mobileNumberValidate($event) {
      if ($event.target.value.length >= 11) {
        this.mobileNumberLoad = true;
        this.$http
          .get("check-phone/", {
            params: {
              phone: $event.target.value
            },
            headers: {
              hash: "aeca448fd126061c14ef3dc55330862c"
            }
          })
          .then(
            response => {
              if (response.data.meta.success == 1) {
                this.mobileNumberErrors = [];
                this.mobileNumberLoad = false;
              } else {
                this.mobileNumberErrors = ["شماره موبایل تکراری است!"];
                this.mobileNumberLoad = false;
              }
            },
            () => {
              this.mobileNumberErrors = [
                "ارتباط با سرور برقرار نشد! لطفا دوباره تلاش کنید."
              ];
              this.mobileNumberLoad = false;
            }
          );
      }
    },
    resend() {
      let hashCode = md5(this.getMobileNumber + "This is salt code");
      this.$http
        .post(
          "register/",
          {
            resend: 1,
            username: this.getUserName
          },
          {
            headers: {
              phone: this.getMobileNumber,
              hash: hashCode
            }
          }
        )
        .then(
          response => {
            if (response.data.meta.success == 1) {
              this.timer();
              this.alertColor = "green";
              this.message = "کد تایید مجددا ارسال شد.";
            } else {
              this.alertColor = "red";
              this.message =
                "ارتباط با سرور برقرار نشد، لطفا دوباره تلاش نمایید.";
            }
            console.log(response);
          },
          () => {
            this.alertColor = "red";
            this.message =
              "ارتباط با سرور برقرار نشد، لطفا دوباره تلاش نمایید.";
          }
        );
      setTimeout(() => {
        this.message = "";
      }, 3000);
    },
    changeMobileNumber() {
      this.changeMobile = true;
    },
    changeMobileRequest() {
      this.changeMobile = false;
      this.$store.commit("setMobileNumber", this.mobileNumber);
      this.resend();
    }
  },
  beforeMount() {
    this.timer();
  }
};
</script>


<style lang='scss' scoped>
$mainHover: #ff5722;
h2 {
  font-size: 1em;
}
.timer-chip {
  font-size: 0.85em !important;
}
.my-text {
  transition: all 0.3s !important;
  &:hover {
    background: transparent !important;
    color: $mainHover !important;
  }
  &:before {
    opacity: 0 !important;
  }
}
.errMessage {
  font-size: 0.8em !important;
  i {
    font-size: 18px !important;
  }
}
.timer-div {
  margin-top: -5px;
  font-size: 0.85em;
}
</style>