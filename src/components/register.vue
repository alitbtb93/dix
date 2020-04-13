<template>
  <v-container>
    <v-card max-width="400px" class="mx-auto mt-md-6">
      <v-card-title>
        <h2 class="text-center mx-auto">ثبت نام</h2>
      </v-card-title>
      <v-alert
        dense
        text
        dismissible
        type="error"
        class="mx-3 errMessage"
        v-if="errorMessage"
      >ارتباط با سرور برقرار نشد، لطفا دوباره تلاش نمایید.</v-alert>
      <v-card-text class="d-inline-block">
        <v-form ref="form" v-model="valid">
          <v-text-field
            :loading="userNameLoad"
            color="#ff5722"
            prepend-icon="mdi-account-circle"
            v-model="userName"
            :rules="userNameRules"
            @blur="userNameValidate"
            :error-messages="userNameErrors"
            label="نام کاربری"
            required
          ></v-text-field>
          <v-text-field
            color="#ff5722"
            :type="isPassword? 'password' : 'text'"
            prepend-icon="mdi-lock"
            v-model="password"
            :rules="passwordRules"
            :append-icon="!isPassword? 'mdi-eye':'mdi-eye-off'"
            label="رمز عبور"
            @click:append="isPassword = !isPassword"
            required
          ></v-text-field>
          <v-text-field
            color="#ff5722"
            :type="isVerifyPassword? 'password' : 'text'"
            prepend-icon="mdi-lock-check"
            :rules="verifyPassRules"
            :append-icon="!isVerifyPassword? 'mdi-eye':'mdi-eye-off'"
            label="تکرار رمز عبور"
            @click:append="isVerifyPassword = !isVerifyPassword"
            required
          ></v-text-field>
          <v-text-field
            color="#ff5722"
            prepend-icon="mdi-cellphone-iphone"
            v-model="mobileNumber"
            :counter="11"
            @blur="mobileNumberValidate"
            :error-messages="mobileNumberErrors"
            :rules="mobileNumberRules"
            :loading="mobileNumberLoad"
            label="شماره موبایل"
            required
          ></v-text-field>
          <v-checkbox
            color="#ff5722"
            :rules="[v => !!v || 'باید با قوانین سایت موافقت شود!']"
            label="با تمام قوانین سایت موافقت دارم"
            required
          ></v-checkbox>
          <v-divider class="mt-2"></v-divider>
          <v-btn
            @click="registerUser"
            :disabled="!valid"
            class="white--text float-left mt-5"
            color="#ff5722"
          >ثبت نام</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script>
import md5 from "md5";
export default {
  data() {
    return {
      userName: null,
      password: null,
      mobileNumber: null,
      isPassword: true,
      isVerifyPassword: true,
      valid: true,
      userNameLoad: false,
      mobileNumberLoad: false,
      userNameErrors: [],
      mobileNumberErrors: [],
      errorMessage: false,
      verifyPassRules: [
        v => !!v || "فیلد تکرار رمز عبور الزامی است!",
        v => (v && v == this.password) || "عدم تشابه با رمزعبور"
      ],
      mobileNumberRules: [
        v => !!v || "فیلد شماره موبایل الزامی است!",
        v => /^\d+$/.test(v) || "فیلد شماره موبایل عددی است!",
        v => (v && v.length == 11) || "فیلد شماره مویابل 11 رقمی است!"
      ],
      userNameRules: [
        v => !!v || "فیلد نام کاربری الزامی است!",
        v => (v && v.length >= 6) || "حداقل طول نام کاربری 6 حرف است!",
        v =>
          /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,33}$/.test(v) ||
          "نام کاربری معتبر نیست",
        v => (v && v.length <= 32) || "حداکثر طول نام کاربری 32 حرف است!"
      ],
      passwordRules: [
        v => !!v || "فیلد رمز عبور الزامی است!",
        v => (v && v.length >= 8) || "حداقل طول رمز عبور 8 حرف است!",
        v =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(v) ||
          "حداقل یک حرف کوچک، یک حرف بزرگ و یک عدد وارد کنید",
        v => (v && v.length <= 32) || "حداکثر طول رمز عبور 32 حرف است!"
      ]
    };
  },
  methods: {
    userNameValidate($event) {
      if ($event.target.value.length >= 6) {
        this.userNameLoad = true;
        this.$http
          .get("check-username/", {
            params: {
              username: $event.target.value
            },
            headers: {
              hash: "aeca448fd126061c14ef3dc55330862c"
            }
          })
          .then(
            response => {
              if (response.data.meta.success == 1) {
                this.userNameErrors = [];
                this.userNameLoad = false;
              } else {
                this.userNameErrors = ["این نام کاربری انتخاب شده است!"];
                this.userNameLoad = false;
              }
            },
            () => {
              this.userNameErrors = [
                "ارتباط با سرور برقرار نشد! لطفا دوباره تلاش کنید."
              ];
              this.userNameLoad = false;
            }
          );
      }
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
    registerUser() {
      let hashCode = md5(this.mobileNumber + "This is salt code");
      this.$http
        .post(
          "register/",
          {
            resend: 0,
            username: this.userName,
            password: this.password
          },
          {
            headers: {
              phone: this.mobileNumber,
              hash: hashCode
            }
          }
        )
        .then(
          response => {
            if (response.data.meta.success == 1) {
              this.$store.commit("setUserName", this.userName);
              this.$store.commit("setMobileNumber", this.mobileNumber);
              this.$router.push("/verify");
            } else{
              this.errorMessage = true;
            }
          },
          error => {
            if (error.status != 400) {
              this.errorMessage = true;
            }
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