<template>
  <div>
    <v-app-bar class="desktop-nav d-none d-md-block" color="#fff498" height="70px">
      <v-container>
        <v-row>
          <v-col cols="5">
            <nav>
              <ul>
                <li>
                  <router-link exact to='/'>خانه</router-link>
                </li>
                <li>
                  <a href>قوانین</a>
                </li>
                <li>
                  <a href>راهنما</a>
                </li>
              </ul>
            </nav>
          </v-col>
          <v-col cols="2">
            <a href>
              <img class="mt-2" src="../assets/dixit-logo.jpg" alt="Dixit" />
            </a>
          </v-col>
          <v-col cols="5">
            <nav class="second-nav">
              <ul>
                <li v-if="!getUserToken">
                  <router-link to='/register'>ثبت نام</router-link>
                </li>
                <li v-if="!getUserToken">
                  <router-link to='/login'>ورود</router-link>
                </li>
                <li v-if="getUserToken">
                  <a href>{{getUserName}}<v-icon class="mb-1">mdi-account-circle</v-icon></a>
                </li>
                <li v-if="getUserToken">
                  <a href @click="logOut">خروج</a>
                </li>
              </ul>
            </nav>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-app-bar class="mobile-navi d-md-none" color="#fff498" height="70px">
      <v-app-bar-nav-icon class="mobile-nav" @click.stop="mobileMenu = !mobileMenu"></v-app-bar-nav-icon>
      <a class="mobile-logo" href>
        <img class="mt-2" src="../assets/dixit-logo.jpg" alt="Dixit" />
      </a>
    </v-app-bar>
    <v-navigation-drawer color="#fff498" v-model="mobileMenu" absolute right temporary>
      <a class="mobile-menu-logo mx-auto d-block" href>
        <img class="mt-2" src="../assets/dixit-logo.jpg" alt="Dixit" />
      </a>

      <v-list class="mobile-menu">
        <v-list-item-group>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to='/'>خانه</router-link>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-clipboard-text</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <a href>قوانین</a>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-help-box</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <a href>راهنما</a>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item v-if="getUserToken">
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to='/'>{{getUserName}}</router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="!getUserToken">
            <v-list-item-icon>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to='/register'>ثبت نام</router-link>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item v-if="!getUserToken">
            <v-list-item-icon>
              <v-icon>mdi-login-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
               <router-link to='/login'>ورود</router-link>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item v-if="getUserToken">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link @click="logOut" to='/'>خروج</router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      mobileMenu: false
    };
  },
  computed:{
    ...mapGetters([
      'getUserToken','getUserName'
    ])
  },
  methods:{
    logOut(){
      this.$store.dispatch('logOut')
    }
  }
};
</script>


<style lang="scss" scoped>
$mainText: #212121;
$mainHover: #ff5722;
ul {
  list-style: none;
  display: flex;
  li {
    a {
      text-decoration: none;
      padding: 0 20px;
      color: $mainText;
      font-weight: 800;
      font-size: 0.9em;
      transition: all 0.3s;
      &:hover {
        i{
          color: $mainHover;
        }
        color: $mainHover;
      }
      &.router-link-active{
        color: $mainHover;
      }
    }
  }
}
nav {
  margin-top: 28px;
}
.second-nav {
  float: left;
  ul {
    padding-left: 0;
  }
}
.mobile-logo {
  position: absolute;
  left: 50%;
  top: -5px;
  transform: translateX(-50%);
}
.mobile-nav {
  i {
    font-size: 35px !important;
    color: $mainText !important;
  }
}
.mobile-menu-logo {
  width: fit-content;
}
.mobile-menu {
  a {
    color: $mainText;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9em;
  }
  i {
    color: rgba(0, 0, 0, 0.7) !important;
  }
}
.desktop-nav {
  z-index: 2;
  position: relative;
  .v-toolbar__content {
    width: 100% !important;
  }
}
.mobile-navi {
  z-index: 2;
  position: relative;
}
</style>