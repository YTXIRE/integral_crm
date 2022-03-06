import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import config from './settings/config';
import axios from 'axios';
import { Icon, InlineIcon } from '@iconify/react';
import truckIcon from '@iconify/icons-mdi/truck';
import handshakeIcon from '@iconify/icons-mdi/handshake';
import dumpTruck from '@iconify/icons-mdi/dump-truck';
import tankerTruck from '@iconify/icons-mdi/tanker-truck';
import skullCrossbones from '@iconify/icons-mdi/skull-crossbones';
import truckFast from '@iconify/icons-mdi/truck-fast';
import './UI/css/Drawer.css';
import Dialog from './UI/Dialog/Dialog';
import CardCompany from "./CardCompany";
import {checkMinus, numberWithSpaces} from "./settings/fns";
import {Link, Route, Switch} from "react-router-dom";
import CardProviders from "./CardProviders";
import TableProvider from "./TableProvider";
import Export from "./Export";
import SettingsIcon from '@material-ui/icons/Settings';
import Button from "@material-ui/core/Button";
import TablePayoff from "./UI/TablePayoff";
import DrawerProjectAccounting from "./projectAccounting/Drawer";

const drawerWidth = 180;
const drawerWidthRight = 270;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#00CED1',
        textAlign: 'center'
    },
    appBar2: {
        backgroundColor: '#eee',
        top: 'auto',
        bottom: 0,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawer2: {
        width: drawerWidthRight,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerPaper2: {
        width: drawerWidthRight,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    drRoot: {
        backgroundColor: '#282c34 !important',
        height: '100vh',
        color: '#fff'
    },
    listColor: {
        color: '#fff',
    }
}));

export default props => {
    const [providers, setProviders] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [payoff, setPayoff] = useState([]);
    const [debt, setDebt] = useState([]);
    const [total, setTotal] = useState([]);
    const rows = [];

    const updateTable = () => {
        setIsUpdate(true);
        setIsUpdate(false);
        fetchData();
    };

    function arraySum(array){
        var sum = 0;
        for(var i = 0; i < array.length; i++){
            sum += Number(array[i].payoff);
        }
        return sum;
    }

    const updateDataTable = (data) => {
        localStorage.setItem('currentProvider', JSON.stringify(data));
        fetchData();
        setIsUpdate(true);
        setTimeout(() => {
            setIsUpdate(false);
        }, 1)
    };

    async function fetchData() {
        const dataProviders = await axios.get(`${config.urlDB}providers.json`);
        let dataProviderTmp = [];
        for(let item in dataProviders.data) {
            dataProviderTmp.push([dataProviders.data[item], item]);
        }
        localStorage.setItem('provider', JSON.stringify(dataProviderTmp))
        setProviders(dataProviderTmp);

        const data = await axios.get(`${config.urlDB}payoff.json`);
        const currentProvider = JSON.parse(localStorage.getItem('currentProvider'));
        for (let item in data.data) {
            if (data.data[item].provider === currentProvider) {
                rows.push({company: data.data[item].company, payoff: data.data[item].payoff});
            }
        }

        let tempProvider = [];
        let tmpProvidersCards = [];
        const objects = await axios.get(`${config.urlDB}/objects.json`);
        for (let item in objects.data) {
            if (objects.data[item].provider === JSON.parse(localStorage.getItem('currentProvider'))) {
                tmpProvidersCards.push([objects.data[item].company, objects.data[item].name, item]);
                tempProvider.push([objects.data[item].name, item]);
            }
        }

        const providersDataPayOff = await axios.get(`${config.urlDB}providersDataPayOff.json`);
        tempProvider.map(value => {
            let subTotal = 0;
            let subTotal2 = 0;
            for (let item in providersDataPayOff.data) {
                if (providersDataPayOff.data[item].object === value[1]) {
                    subTotal += Number(providersDataPayOff.data[item].subTotal.replace(',', '.').replace(/ /g, ''))
                    if (providersDataPayOff.data[item].delivery) {
                        subTotal += Number(providersDataPayOff.data[item].delivery.replace(',', '.'));
                    }
                    if (providersDataPayOff.data[item].plain) {
                        subTotal += Number(providersDataPayOff.data[item].plain.replace(',', '.'));
                    }
                    if (providersDataPayOff.data[item].underloading) {
                        subTotal += Number(providersDataPayOff.data[item].underloading.replace(',', '.'));
                    }
                    subTotal2 += Number(providersDataPayOff.data[item].subTotal.replace(',', '.').replace(/ /g, ''))
                    if (providersDataPayOff.data[item].delivery) {
                        subTotal2 += Number(providersDataPayOff.data[item].delivery.replace(',', '.'));
                    }
                    if (providersDataPayOff.data[item].plain) {
                        subTotal2 += Number(providersDataPayOff.data[item].plain.replace(',', '.'));
                    }
                    if (providersDataPayOff.data[item].underloading) {
                        subTotal2 += Number(providersDataPayOff.data[item].underloading.replace(',', '.'));
                    }
                }

            }
            for (let i in tmpProvidersCards) {
                if (tmpProvidersCards[i][2] === value[1]) {
                    tmpProvidersCards[i][2] = subTotal;
                    tmpProvidersCards[i][3] = subTotal2;
                }
            }
        });

        let tmpCard = 0;
        let tmpCard2 = 0;
        tmpProvidersCards.map(i => {
            tmpCard += Number(i[2]);
            tmpCard2 += Number(i[3]);
        });

        setDebt(tmpCard);
        setTotal(tmpCard2);

        setPayoff(arraySum(rows) ? Math.round(tmpCard - arraySum(rows), 2) : 0);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const classes = useStyles();

    if (providers.length !== 0) {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h5">
                            CRM система Integral
                        </Typography>
                    </Toolbar>
                    <div style={{position: "absolute", top: 10, right: 10}}>
                        {/*<Link to='/projectAccounting' style={{textDecoration: 'none'}}>*/}
                        {/*    <Button style={{color: '#fff', textDecoration: 'none', fontSize: 16}} title='Суточная'>*/}
                        {/*        Суточная*/}
                        {/*    </Button>*/}
                        {/*</Link>*/}
                        <Export/>
                        <Link to='/settings'>
                            <Button style={{color: '#fff'}} title='Настройки'>
                                <SettingsIcon />
                            </Button>
                        </Link>
                    </div>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar} />
                    <List classes={{root: classes.drRoot}}>
                        {
                            providers.map((item, index) => {
                                return(
                                    <Link
                                        key={index} to={`/provider/${item[0].name}`} style={{color: '#fff', textDecoration: 'none'}} onClick={() => {updateDataTable(item[1])}}
                                    >
                                        <ListItem button key={item.name} className={JSON.parse(localStorage.getItem('currentProvider')) === item[1] ? 'isActive' : ''}>
                                            <ListItemIcon classes={{root: classes.listColor}}>
                                                {
                                                    item[0].iconType === 'car' ?
                                                        <Icon icon={truckIcon} /> :
                                                        item[0].iconType === 'handshake' ?
                                                            <Icon icon={handshakeIcon} /> :
                                                            item[0].iconType === 'dump-truck' ?
                                                                <Icon icon={dumpTruck} /> :
                                                                item[0].iconType === 'tanker-truck' ?
                                                                    <Icon icon={tankerTruck} /> :
                                                                    item[0].iconType === 'skull' ?
                                                                        <Icon icon={skullCrossbones} /> :
                                                                        <Icon icon={truckFast} />
                                                }
                                            </ListItemIcon>
                                            <ListItemText primary={item[0].name} />
                                        </ListItem>
                                    </Link>
                                );
                            })
                        }
                    </List>
                    <Dialog fetchData={fetchData}/>
                </Drawer>
                <main className={classes.content} style={{paddingLeft: 10, paddingRight: 10}}>
                    {
                        props.type !== undefined && props.type === 'index' ?
                            <CardCompany/> : null
                    }
                    {
                        props.type !== undefined && props.type === 'provider' ?
                            <CardCompany isUpdate={isUpdate}/> : null
                    }
                    {
                        props.type !== undefined && props.type === 'providerObject' ?
                            <CardProviders/> : null
                    }
                    {
                        props.type !== undefined && props.type === 'providerObjectDetail' ?
                            <TableProvider/> : null
                    }
                </main>
                <AppBar position="fixed" className={classes.appBar2}>
                    <Toolbar style={{paddingLeft: 210}}>
                        <Typography variant="h6" noWrap>
                            <span style={{color: 'green', fontWeight: 'bold'}}><b>Взяли</b>: {numberWithSpaces(debt)}</span><br/>
                            <span style={{color: checkMinus(payoff) ? 'blue' : 'red', fontWeight: 'bold'}}><b>Долг</b>: {numberWithSpaces(payoff)}</span><br/>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer2}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper2,
                    }}
                    anchor="right"
                >
                    <div className={classes.toolbar} />
                    <List classes={{root: classes.drRoot}}>
                        {
                            JSON.parse(localStorage.getItem('provider')).map(item => {
                                if (item[1] === JSON.parse(localStorage.getItem('currentProvider'))) {
                                    return(
                                        <TablePayoff providerId={item[1]} isUpdate={isUpdate} companyName={'АО НЬЮ ГРАУНД'} company={'aoNewGround'} updateTable={updateTable}/>
                                    );
                                }
                            })
                        }
                        {
                            JSON.parse(localStorage.getItem('provider')).map(item => {
                                if (item[1] === JSON.parse(localStorage.getItem('currentProvider'))) {
                                    return(
                                        <TablePayoff providerId={item[1]} isUpdate={isUpdate} companyName={'ООО НЬЮ ГРАУНД'} company={'oooNewGround'}/>
                                    );
                                }
                            })
                        }
                        {
                            JSON.parse(localStorage.getItem('provider')).map(item => {
                                if (item[1] === JSON.parse(localStorage.getItem('currentProvider'))) {
                                    return(
                                        <TablePayoff providerId={item[1]} isUpdate={isUpdate} companyName={'ООО ИНТЕГРАЛ'} company={'oooIntegral'}/>
                                    );
                                }
                            })
                        }
                    </List>
                </Drawer>
            </div>
        );
    } else {
        return null;
    }
}
