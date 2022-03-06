import React from 'react';
import './App.css';
import {Route, Switch, withRouter} from 'react-router-dom';
import Drawer from "./componets/Drawer";
import DrawerProjectAccounting from "./componets/projectAccounting/Drawer";
import Settings from './componets/Settings';
import Login from './componets/Login';

const DrawerMain = () => {
    return <Drawer type={'index'}/>
};

const ProjectAccountingDrawerMain = () => {
    return <DrawerProjectAccounting type={'indexProjectAccounting'}/>
};

const DrawerProvider = () => {
    return <Drawer type={'provider'}/>
};

const ProjectAccountingDrawerProvider = () => {
    return <DrawerProjectAccounting type={'providerProjectAccounting'}/>
};

const DrawerProviderObject = () => {
    return <Drawer type={'providerObject'}/>
};

const ProjectAccountingDrawerProviderObject = () => {
    return <DrawerProjectAccounting type={'providerObjectProjectAccounting'}/>
};

const DrawerProviderObjectDetail = () => {
    return <Drawer type={'providerObjectDetail'}/>
};

const ProjectAccountingDrawerProviderObjectDetail = () => {
    return <DrawerProjectAccounting type={'providerObjectDetailProjectAccounting'}/>
};

function App() {
    if (JSON.parse(localStorage.getItem('token'))) {
        return(
            <div className="App">
                <header className="App-header">
                    <Drawer />
                    <Switch>
                        <Route exact path='/' component={DrawerMain}/>
                        <Route exact path='/projectAccounting/' component={ProjectAccountingDrawerMain}/>
                        <Route exact path='/provider/:name' component={DrawerProvider}/>
                        <Route exact path='/projectAccounting/provider/:name' component={ProjectAccountingDrawerProvider}/>
                        <Route exact path='/provider/:name/:companyName' component={DrawerProviderObject}/>
                        <Route exact path='/projectAccounting/provider/:name/:companyName' component={ProjectAccountingDrawerProviderObject}/>
                        <Route exact path='/provider/:name/:companyName/:objectName' component={DrawerProviderObjectDetail}/>
                        <Route exact path='/projectAccounting/provider/:name/:companyName/:objectName' component={ProjectAccountingDrawerProviderObjectDetail}/>
                        <Route exact path='/settings' component={Settings}/>
                    </Switch>
                </header>
            </div>
        );
    } else {
        return (
            <div className="App">
                <header className="App-header">
                    <Login />
                </header>
            </div>
        );
    }

}

export default withRouter(App)