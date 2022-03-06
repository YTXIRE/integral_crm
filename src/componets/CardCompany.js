import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import config from "./settings/config";
import {checkMinus, numberWithSpaces} from "./settings/fns";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        minWidth: 100,
    },
    title: {
        fontSize: 14,
    },
});

export default props => {
    const [payoff, setPayoff] = useState([]);
    const [company, setCompany] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const rows = [];
    const companyTmp = [];

    useEffect(() => {
        fetchDataCompany()
    }, []);

    function arraySum(array){
        var aoNewGround = 0;
        var oooNewGround = 0;
        var oooIntegral = 0;
        for(var i = 0; i < array.length; i++){
            if (array[i].company === 'aoNewGround') {
                aoNewGround += Number(array[i].payoff);
            }
            if (array[i].company === 'oooNewGround') {
                oooNewGround += Number(array[i].payoff);
            }
            if (array[i].company === 'oooIntegral') {
                oooIntegral += Number(array[i].payoff);
            }
        }
        return {
            aoNewGround: (Math.round(aoNewGround)),
            oooNewGround: (Math.round(oooNewGround)),
            oooIntegral: (Math.round(oooIntegral))
        };
    }

    async function fetchDataCompany () {
        const dataCompany = await axios.get(`${config.urlDB}/company.json`);
        for (let item in dataCompany.data) {
            companyTmp.push(dataCompany.data[item])
        }

        const data = await axios.get(`${config.urlDB}payoff.json`);
        for (let item in data.data) {
            if (JSON.parse(localStorage.getItem('currentProvider')) === data.data[item].provider) {
                rows.push({company: data.data[item].company, payoff: data.data[item].payoff});
            }
        }
        setPayoff(arraySum(rows));

        let tmpName = JSON.parse(localStorage.getItem('provider'));
        tmpName.map(item => {
            if (item[1] === JSON.parse(localStorage.getItem('currentProvider'))) {
                setCompanyName(item[0].name)
            }
        });

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
                    if (!providersDataPayOff.data[item].comment.toLowerCase().includes('долг')) {
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

        let tmpCard = {};
        let tmpCard2 = {};
        tmpProvidersCards.map(i => {
            if (tmpCard[i[0]]) {
                tmpCard[i[0]] += i[2];
            } else {
                tmpCard[i[0]] = i[2];
            }
            if (tmpCard2[i[0]]) {
                tmpCard2[i[0]] += i[3];
            } else {
                tmpCard2[i[0]] = i[3];
            }
        });

        for (let item in companyTmp) {
            companyTmp[item]['total'] = tmpCard[companyTmp[item].title] ?? 0;
            companyTmp[item]['total2'] = tmpCard2[companyTmp[item].title] ?? 0;
        }
        setCompany(companyTmp);
    }

    if (props.isUpdate) {
        fetchDataCompany();
    }

    const setCurrentCompany = (title, name) => {
        localStorage.setItem('currentCompany', JSON.stringify(title));
        localStorage.setItem('currentCompanyName', JSON.stringify(name));
    };

    const classes = useStyles();
    return (
        <table>
            <tbody>
                <tr>
                    {
                        company.map(item => {
                            return(
                                <td style={{width: '100vw'}}>
                                    <Link
                                        to={`/provider/${companyName}/${item.name}`} style={{color: 'rgba(0, 0, 0, 0.87)', textDecoration: 'none'}} onClick={() => {setCurrentCompany(item.title, item.name);}}
                                    >
                                        <Card className={classes.root}>
                                            <CardContent>
                                                <Typography variant="h5" component="h2"><p>{item.name}</p></Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom><b>Взяли</b>: <span style={{color: 'green', fontWeight: 'bold'}}>{numberWithSpaces(item.total)}</span></Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom><b>Долг</b>: <span style={{color: checkMinus(item.total2 - payoff[item.title]) ? 'blue' : 'red', fontWeight: 'bold'}}>{numberWithSpaces(Math.round(item.total2 - payoff[item.title]), 2)}</span></Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </td>
                            );
                        })
                    }
                </tr>
            </tbody>
        </table>
    );
}
