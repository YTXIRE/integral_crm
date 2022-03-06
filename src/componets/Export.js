import React, {useEffect, useState} from 'react';
import axios from "axios";
import config from "./settings/config";
import ReactExport from "react-export-excel";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import Button from "@material-ui/core/Button";
import {numberWithSpaces} from "./settings/fns";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default props => {
    const [sum, setSum] = useState([]);
    const rows = [];
    const companyTmp = [];

    function arraySum(array, f = true){
        var aoNewGround = 0;
        var oooNewGround = 0;
        var oooIntegral = 0;
        for(var i = 0; i < array.length; i++){
            if (f) {
                if (array[i][0] === 'aoNewGround') {
                    aoNewGround += Number(array[i][1]);
                }
                if (array[i][0] === 'oooNewGround') {
                    oooNewGround += Number(array[i][1]);
                }
                if (array[i][0] === 'oooIntegral') {
                    oooIntegral += Number(array[i][1]);
                }
            } else {
                if (array[i][0] === 'aoNewGround') {
                    aoNewGround += Number(array[i][1]) + Number(array[i][2]) + Number(array[i][3]) + Number(array[i][4]);
                }
                if (array[i][0] === 'oooNewGround') {
                    oooNewGround += Number(array[i][1]) + Number(array[i][2]) + Number(array[i][3]) + Number(array[i][4]);
                }
                if (array[i][0] === 'oooIntegral') {
                    oooIntegral += Number(array[i][1]) + Number(array[i][2]) + Number(array[i][3]) + Number(array[i][4]);
                }
            }
        }
        return {
            aoNewGround: aoNewGround,
            oooNewGround: oooNewGround,
            oooIntegral: oooIntegral
        };
    }

    const saveData = async x => {
        const dataCompany = await axios.get(`${config.urlDB}/company.json`);
        for (let item in dataCompany.data) {
            companyTmp.push(dataCompany.data[item])
        }

        const data = await axios.get(`${config.urlDB}payoff.json`);
        JSON.parse(localStorage.getItem('provider')).map(i => {
            for (let item in data.data) {
                if (i[1] === data.data[item].provider) {
                    rows.push({company: data.data[item].company, payoff: Number(data.data[item].payoff), provider: i[0].name});
                }
            }
        });

        let tmpSum = {};
        let totalSumTmp = [];
        let tmp = [];
        rows.map(item => {
            if (tmpSum[item.provider]) {
                tmpSum[item.provider].push([item.company, item.payoff]);
            } else {
                tmpSum[item.provider] = [[item.company, item.payoff]];
            }
        });

        for (let item in tmpSum) {
            totalSumTmp[item] = arraySum(tmpSum[item]);
        }


        let tmpData = [];
        let tempData = [];
        let sumTempData = [];
        const providersDataPayOff = await axios.get(`${config.urlDB}providersDataPayOff.json`);
        const getCompany = await axios.get(`${config.urlDB}objects.json`);
        for (let item in providersDataPayOff.data) {
            JSON.parse(localStorage.getItem('provider')).map(i => {
                if (i[1] === providersDataPayOff.data[item].provider) {
                    for (let company in getCompany.data) {
                        if (company === providersDataPayOff.data[item].object) {
                            tmpData.push({
                                provider: i[0].name,
                                subTotal: providersDataPayOff.data[item].subTotal,
                                company: getCompany.data[company].company,
                                delivery: providersDataPayOff.data[item].delivery,
                                plain: providersDataPayOff.data[item].plain,
                                underloading: providersDataPayOff.data[item].underloading,
                            });
                        }
                    }
                }
            });
        }

        tmpData.map(item => {
            if (tempData[item.provider]) {
                tempData[item.provider].push([item.company, item.subTotal, item.delivery ?? 0, item.plain ?? 0, item.underloading ?? 0]);
            } else {
                tempData[item.provider] = [[item.company, item.subTotal, item.delivery ?? 0, item.plain ?? 0, item.underloading ?? 0]];
            }
        });

        for (let item in tempData) {
            sumTempData[item] = arraySum(tempData[item], false);
        }

        for (let item in sumTempData) {
            for (let i in sumTempData[item]) {
                companyTmp.map(c => {
                    if (c.title === i) {
                        tmp.push({
                            provider: item,
                            company: c.name,
                            debt: numberWithSpaces(
                                Math.round(
                                    Number(sumTempData[item] !== undefined ? sumTempData[item][i] : 0) -
                                    Number(totalSumTmp[item] !== undefined ? totalSumTmp[item][i] : 0),
                                    2
                                )
                            )
                        })
                    }
                });
            }
        }

        setSum(tmp);
    };

    return(
        <ExcelFile filename={`Отчет по всем объектам ${new Date()}`} element={<Button style={{color: '#fff'}} onClick={saveData} title='Скачать отчет'><SaveAltIcon /></Button>}>
            <ExcelSheet data={sum.length !== 0 ? sum : saveData()} name="Debt Provider">
                <ExcelColumn label="Поставщик" value="provider"/>
                <ExcelColumn label="Компания" value="company"/>
                <ExcelColumn label="Долг" value="debt"/>
            </ExcelSheet>
        </ExcelFile>
    );
}