import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    userId: null,
    userToken: null,
    userName: null,
    mobileNumber: null,
    gameId:null,
    gameCode:null,
    playersNumber:null,
    gameStep:null,
    createGame:false
  },
  getters: {
    getUserName: state => {
      return state.userName;
    },
    getMobileNumber: state => {
      return state.mobileNumber;
    },
    getUserId: state => {
      return state.userId;
    },
    getUserToken: state => {
      return state.userToken;
    },
    getGameId:state=>{
        return state.gameId
    },
    getGameCode:state=>{
        return state.gameCode
    },
    getPlayersNumber:state=>{
      return state.playersNumber
    },
    getGameStep:state=>{
      return state.gameStep
    },
    getCreateGame:state=>{
      return state.createGame
    }
  },
  mutations: {
    setUserName(state, username) {
      state.userName = username;
    },
    setGameId(state,id){
        state.gameId=id
    },
    setGameCode(state,code){
        state.gameCode=code
    },
    setMobileNumber(state, number) {
      state.mobileNumber = number;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setUserToken(state, token) {
      state.userToken = token;
    },
    setPlayersNumber(state,number){
      state.playersNumber=number
    },
    setGameStep(state,code){
      state.gameStep=code
    },
    setCreateGame(state,create){
      state.createGame=create
    }
  },
  actions: {
    logOut({ commit }) {
      commit("setUserName", null);
      commit("setMobileNumber", null);
      commit("setUserId", null);
      commit("setUserToken", null);
      localStorage.removeItem("userId");
      localStorage.removeItem("userToken");
      localStorage.removeItem("userTokenExpire");
      localStorage.removeItem("userName");
    },
    autoLogin({ commit }) {
      const tokenExpireDate = localStorage.getItem("userTokenExpire")
      const tokenExpire=new Date(tokenExpireDate)
      const todayDate = new Date()
      if (!tokenExpire) {
        return;
      }
      if (tokenExpire <= todayDate) {
        return;
      }

      commit("setUserName", localStorage.getItem("userName"));
      commit("setUserId", parseInt(localStorage.getItem("userId")));
      commit("setUserToken", localStorage.getItem("userToken"));
    }
  }
});
