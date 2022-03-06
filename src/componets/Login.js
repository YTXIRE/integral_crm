import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import  './css/Login.css';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import  axios from "axios";
import config from "./settings/config";
import md5 from 'md5';
import Drawer from "./Drawer";
import DrawerProjectAccounting from "./projectAccounting/Drawer";

export default () => {
    const [data, setData] = useState({
        token: '',
        login: ''
    });

    async function loginHandler(event)  {
        if (event.key === 'Enter' || event.key === undefined) {
            const users = await axios.get(`${config.urlDB}users.json`);
            for (let item in users.data) {
                if (users.data[item].login === data.login && users.data[item].password === md5(data.password)) {
                    let t = md5(users.data[item].login + users.data[item].password + new Date());
                    localStorage.setItem('token', JSON.stringify(t))
                    localStorage.setItem('login', JSON.stringify(users.data[item].login));
                    setData({
                        ...data,
                        token: t,
                        login: users.data[item].login
                    });
                }
            }
        }
    }

    if (data.token || localStorage.getItem('token')) {
        if (data.login === 'adder' || JSON.parse(localStorage.getItem('login')) === 'adder') {
            return (
                <Drawer type={'index'}/>
            );
        } else if (data.login === 'adder' || JSON.parse(localStorage.getItem('login')) === 'adder' || data.login === 'accounting' || JSON.parse(localStorage.getItem('login')) === 'accounting'){
            return (
                <DrawerProjectAccounting type={'indexProjectAccounting'}/>
            );
        }
    } else {
        return(
            <div className='Auth'>
                <h1>Авторизация</h1>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <div>
                        <TextField
                            id="outlined-email-input"
                            label="Login"
                            type="email"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            variant="outlined"
                            onKeyPress={loginHandler}
                            onChange={e => setData({...data, login: e.target.value})}
                        /><br/>
                        <TextField
                            id="outlined-email-input"
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="password"
                            margin="normal"
                            variant="outlined"
                            onKeyPress={loginHandler}
                            onChange={e => setData({...data, password: e.target.value})}
                        /><br/>
                        <Button
                            variant="outlined"
                            color="primary"
                            className='btnAuth'
                            onClick={loginHandler}
                        >
                            Войти
                        </Button>
                    </div>
                </Grid>
            </div>
        );
    }
};
