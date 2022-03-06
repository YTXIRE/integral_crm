import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import './css/CardProvider.css'
import DialogCardProviders from "./UI/Dialog/DialogCardProviders";
import axios from "axios";
import config from "./settings/config";
import {inArray, numberWithSpaces} from "./settings/fns";

export default props => {
    const [provider, setProvider] = useState([]);
    const [company, setCompany] = useState([]);
    const [providerName, setProviderName] = useState([]);
    const [total, setTotal] = useState(0);
    let tmpProvidersCards = [];
    let tempProvider = [];

    const fetchDataProviderCards = async () => {
        const data = await axios.get(`${config.urlDB}/objects.json`);
        for (let item in data.data) {
            if (data.data[item].provider === JSON.parse(localStorage.getItem('currentProvider')) && data.data[item].company === JSON.parse(localStorage.getItem('currentCompany'))) {
                tmpProvidersCards.push([data.data[item].name]);
                tempProvider.push([data.data[item].name, item]);
            }
        }
        localStorage.setItem('objects', JSON.stringify(tempProvider));

        const dataCompany = await axios.get(`${config.urlDB}/company.json`);
        for (let item in dataCompany.data) {
            if (dataCompany.data[item].title === JSON.parse(localStorage.getItem('currentCompany'))) {
                setCompany(dataCompany.data[item].name);
            }
        }

        let tmp = JSON.parse(localStorage.getItem('provider'));
        tmp.map(item => {
            if (item[1] === JSON.parse(localStorage.getItem('currentProvider'))) {
                setProviderName(item[0].name);
            }
        });

        const providersDataPayOff = await axios.get(`${config.urlDB}providersDataPayOff.json`);
        tempProvider.map(value => {
            let subTotal = 0;
            for (let item in providersDataPayOff.data) {
                if (providersDataPayOff.data[item].object === value[1]) {
                    if (!providersDataPayOff.data[item].comment.toLowerCase().includes('долг')) {
                        subTotal += Number(providersDataPayOff.data[item].subTotal);
                        if (providersDataPayOff.data[item].delivery) {
                            subTotal += Number(providersDataPayOff.data[item].delivery.replace(',', '.'));
                        }
                        if (providersDataPayOff.data[item].plain) {
                            subTotal += Number(providersDataPayOff.data[item].plain.replace(',', '.'));
                        }
                        if (providersDataPayOff.data[item].underloading) {
                            subTotal += Number(providersDataPayOff.data[item].underloading.replace(',', '.'));
                        }
                    }
                }
            }
            for (let i in tmpProvidersCards) {
                if (tmpProvidersCards[i][0] === value[0]) {
                    tmpProvidersCards[i][1] = subTotal;
                }
            }

        });
        setProvider(tmpProvidersCards);
    };

    useEffect(() => {
        fetchDataProviderCards();
    }, []);

    return (
        <div style={{marginBottom: 100}}>
            <p>
                {
                    JSON.parse(localStorage.getItem('currentCompanyName')) !== null ? JSON.parse(localStorage.getItem('currentCompanyName')) : null
                }
            </p>
            <DialogCardProviders fetchDataProviderCards={fetchDataProviderCards}/>
            {
                provider.map(item => {
                    return(
                        <Link
                            to={`/provider/${providerName}/${company}/${item[0]}`}
                            key={Math.random()}
                            onClick={() => {
                                localStorage.setItem('currentObject', JSON.stringify(item[0]));
                            }}
                        >
                            <Button>
                                <Card className='card'>
                                    <div className='cardItem'>
                                        <Typography
                                            className='title'
                                            gutterBottom
                                        >
                                            {item[0]}
                                            <Typography className='cardSum' color="textSecondary">
                                                <b>Взяли</b>: <span style={{color: 'green', fontWeight: 'bold'}}>{numberWithSpaces(item[1])}</span>
                                            </Typography>
                                        </Typography>
                                    </div>
                                </Card>
                            </Button>
                        </Link>
                    );
                })
            }
        </div>
    );
}
