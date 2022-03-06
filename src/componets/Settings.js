import React, {useEffect, useState} from "react";
import axios from "axios";
import config from "./settings/config";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogAddCement from "./UI/Dialog/DialogAddCement";
import {numberWithSpaces} from "./settings/fns";

export default () => {
    const [cement, setCement] = useState([]);
    const [provider, setProvider] = useState([]);
    const [objects, setObjects] = useState([]);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            backgroundColor: theme.palette.background.paper,
            width: 800,
        },
        table: {
            minWidth: 800,
        },
    }));

    function sortBy(arr) {
        return arr.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
    }

    const fetchDataCement = async () => {
        const getCement = await axios.get(`${config.urlDB}dictionaryCement.json`);
        let tmpCement = [];
        for (let item in getCement.data) {
            tmpCement.push({
                id: item,
                name: getCement.data[item].name,
                price: numberWithSpaces(getCement.data[item].price)
            });
        }
        sortBy(tmpCement);
        setCement(tmpCement);
    };

    const fetchDataProvider = async () => {
        const getProvider = await axios.get(`${config.urlDB}providers.json`);
        let tmpProvider = [];
        for (let item in getProvider.data) {
            tmpProvider.push({
                id: item,
                name: getProvider.data[item].name
            });
        }
        setProvider(tmpProvider);
    };

    const fetchDataObjects = async () => {
        const getObjects = await axios.get(`${config.urlDB}objects.json`);
        let tmpObjects = [];
        for (let item in getObjects.data) {
            tmpObjects.push({
                id: item,
                name: getObjects.data[item].name,
                provider: getObjects.data[item].provider,
                company: getObjects.data[item].company,
            });
        }
        setObjects(tmpObjects);
    };

    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    useEffect(() => {
        fetchDataCement();
        fetchDataProvider();
        fetchDataObjects();
    }, []);

    const saveCement = cement => {
        let element = document.querySelectorAll(`#${cement}`);
        if (element[1].value.includes(',') || element[1].value.includes('.')) {
            element[1].value = element[1].value.replace(' ', '').replace(',', '.');
        }
        let t = {};
        t[element[0].id] = {
            name: element[0].value,
            price: element[1].value
        };
        axios.patch(`${config.urlDB}dictionaryCement.json`, {...t}).then(res => {
            fetchDataCement();
            alert('Данные успешно сохранены');
        });
    };

    const saveProvider = provider => {
        let element = document.getElementById(provider);
        let t = {};
        t[element.id] = {name: element.value, iconType: 'default'};
        axios.patch(`${config.urlDB}providers.json`, {...t}).then(res => {
            fetchDataProvider();
            alert('Данные успешно сохранены');
        });
    };

    const saveObject = (object, provider, company) => {
        let element = document.getElementById(object);
        let t = {};
        t[element.id] = {name: element.value, company: company, provider: provider};
        axios.patch(`${config.urlDB}objects.json`, {...t}).then(res => {
            fetchDataObjects();
            alert('Данные успешно сохранены');
        });
    };

    return(
        <div className={classes.root} style={{marginTop: 30, marginBottom: 80}}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Марка цемента/бетона" {...a11yProps(0)} />
                    <Tab label="Постащики" {...a11yProps(1)} />
                    <Tab label="Объекты" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <DialogAddCement fetchData={fetchDataCement}/>
                    <br/>
                    <table>
                        {
                            cement.map(item => {
                                return(
                                    <tr key={item.id} >
                                        <td>
                                            <TextField id={item.id} variant="outlined" defaultValue={item.name} style={{width: 430, marginRight: 20}}/>
                                        </td>
                                        <td>
                                            <TextField id={item.id} variant="outlined" defaultValue={item.price} style={{width: 150, marginRight: 20}}/>
                                        </td>
                                        <td>
                                            <Button variant="contained" style={{backgroundColor: 'rgba(0,206,209, .7)', color: '#fff'}} onClick={() => {saveCement(item.id)}}>
                                                Сохранить
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <table>
                        {
                            provider.map(item => {
                                return(
                                    <tr key={item.id} >
                                        <td>
                                            <TextField id={item.id}  variant="outlined" defaultValue={item.name} style={{width: 600, marginRight: 20}}/>
                                        </td>
                                        <td>
                                            <Button variant="contained" style={{backgroundColor: 'rgba(0,206,209, .7)', color: '#fff'}} onClick={() => {saveProvider(item.id)}}>
                                                Сохранить
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <table>
                        {
                            objects.map(item => {
                                return(
                                    <tr key={item.id} >
                                        <td>
                                            <TextField id={item.id} variant="outlined" defaultValue={item.name} style={{width: 600, marginRight: 20}}/>
                                        </td>
                                        <td>
                                            <Button variant="contained" style={{backgroundColor: 'rgba(0,206,209, .7)', color: '#fff'}} onClick={() => {saveObject(item.id, item.provider, item.company)}}>
                                                Сохранить
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}