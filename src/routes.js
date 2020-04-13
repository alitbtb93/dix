import home from './components/home'
import register from './components/register'
import verify from './components/verify'
import login from './components/login'
import lobby from './components/lobby'
import game from './components/game'
export const routes=[
    {path:'/',component:home},
    {path:'/register',component:register},
    {path:'/verify',component:verify},
    {path:'/login',component:login},
    {path:'/lobby',component:lobby},
    {path:'/game',component:game}
]
