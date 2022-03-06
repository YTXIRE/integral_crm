import React, {forwardRef, useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {firstLetterToLowerCase, numberWithSpaces} from "./settings/fns";
import axios from "axios";
import config from "./settings/config";
import Select from './UI/Select/Select';
import Button from "@material-ui/core/Button";

export default () => {
    const [state, setState] = useState({});
    const [providersDataPayOffs, setProvidersDataPayOffs] = useState({});
    const [total, setTotal] = useState(0);
    const [isLoad, setIsLoad] = useState(true);
    const [updateCement, setUpdateCement] = useState('');

    function sortBy(arr) {
        return arr.sort((a, b) => {
            return a[1] > b[1] ? 1 : -1;
        });
    }

    function sortByDate(arr) {
        return arr.sort((a, b) => {
            let t = a.period.split('.');
            let aDate = `${t[2]}-${t[1]}-${t[0]}`;
            t = b.period.split('.');
            let bDate = `${t[2]}-${t[1]}-${t[0]}`;
            return new Date(aDate) > new Date(bDate) ? 1 : -1;
        });
    }

    const summ = () => {
        let volume = document.getElementById('volume').value;
        let price = document.getElementById('pricePerOneTon').value;
        let element = document.querySelector('#subTotal');
        let parent = element.parentElement;
        let newElement = document.createElement('input');
        newElement.id = element.id;
        newElement.style = element.style.cssText;
        newElement.placeholder = element.placeholder;
        if (volume.includes(',')) {
            volume = volume.replace(',', '.').replace(' ', '')
        }
        if (price.includes(',')) {
            price = price.replace(',', '.').replace(' ', '')
        }
        newElement.value = (Number(volume) * Number(price)).toFixed(2);
        document.querySelector('#subTotal').remove();
        parent.append(newElement);
    };

    const sumErcon = (count, id) => {
        let delivery = document.querySelectorAll('#delivery');
        let underloading = document.querySelectorAll('#underloading');
        let plain = document.querySelectorAll('#plain');
        let countLabel = document.querySelectorAll('#count');
        for (let item of delivery) {
            if (item.dataset.id === id) {
                delivery = Number(item.value);
            }
        }
        for (let item of underloading) {
            if (item.dataset.id === id) {
                underloading = Number(item.value);
            }
        }
        for (let item of plain) {
            if (item.dataset.id === id) {
                plain = Number(item.value);
            }
        }
        if (count.includes(',') || count.includes(' ')) {
            count = Number(count.replace(',', '.').replace(/\s/ig, ''));

        }
        for (let item of countLabel) {
            if (item.className === id) {
                let parent = item.parentElement;
                let newElement = document.createElement('label');
                newElement.id = 'count';
                newElement.className = id;
                newElement.textContent = numberWithSpaces(count + delivery + underloading + plain);
                document.querySelector(`.${id}`).remove();
                parent.append(newElement);
            }
        }
    };

    const saveAdditionalData = (id) => {
        let delivery = document.querySelectorAll('#delivery');
        let underloading = document.querySelectorAll('#underloading');
        let plain = document.querySelectorAll('#plain');
        for (let item of delivery) {
            if (item.dataset.id === id) {
                delivery = item.value.replace(',', '.').replace(/\s/ig, '');
            }
        }
        for (let item of underloading) {
            if (item.dataset.id === id) {
                underloading = item.value.replace(',', '.').replace(/\s/ig, '');
            }
        }
        for (let item of plain) {
            if (item.dataset.id === id) {
                plain = item.value.replace(',', '.').replace(/\s/ig, '');
            }
        }
        axios.patch(`${config.urlDB}providersDataPayOff/${id}.json`, {delivery: delivery, underloading: underloading, plain: plain}).then(res => {
            fetchDictionaryCement();
        });
    };

    const formatData = (subTotal, delivery, underloading, plain) => {
        let s = 0;
        let d = 0;
        let u = 0;
        let p = 0;
        if (subTotal.includes(',') || subTotal.includes(' ')) {
            s = Number(subTotal.replace(',', '.').replace(/\s/ig, ''));
        }
        if (delivery !== undefined) {
            d = Number(delivery);
        } else {
            d = 0;
        }
        if (underloading !== undefined) {
            u = Number(underloading);
        } else {
            u = 0;
        }
        if (plain !== undefined) {
            p = Number(plain);
        } else {
            p = 0;
        }
        return numberWithSpaces(s + d + u + p);
    }

    const fetchDictionaryCement = async (t = null) => {
        const data = await axios.get(`${config.urlDB}dictionaryCement.json`);
        let dataTmpCement = {};
        let dataTmpCement2 = [];
        let dataTmpCement3 = [];
        let dataTmpCement4 = [];
        let providersDataPayOffTmp = [];
        let providersDataPayOffTemp = [];
        let subTotalTmp = 0;
        for (let item in data.data) {
            dataTmpCement2.push([item, data.data[item].name]);
            dataTmpCement3.push([item, data.data[item].name, data.data[item].price]);
        }

        let tmp = sortBy(dataTmpCement2);
        let tmp2 = sortBy(dataTmpCement3);

        tmp.map(item => {
            dataTmpCement[item[0]] = item[1];
        });

        tmp2.map(item => {
            dataTmpCement4[item[0]] = [item[1], item[2]];
        });

        const updatedCement = (cement) => {
            setUpdateCement(cement);
            // let parent = document.querySelector('#pricePerOneTon').parentElement;
            // let element = document.querySelector('#pricePerOneTon');
            // let newElement = document.createElement('input');
            // newElement.id = element.id;
            // newElement.style = element.style.cssText;
            // newElement.placeholder = element.placeholder;
            // newElement.value = dataTmpCement4[cement][1];
            // document.querySelector('#pricePerOneTon').remove();
            // parent.append(newElement);
            summ();
        };

        const providersDataPayOff = await axios.get(`${config.urlDB}providersDataPayOff.json`);
        for (let item in providersDataPayOff.data) {
            if (localStorage.getItem('objects')) {
                JSON.parse(localStorage.getItem('objects')).map(value => {
                    if (JSON.parse(localStorage.getItem('currentProvider')) === providersDataPayOff.data[item].provider) {
                        if (value[0] === JSON.parse(localStorage.getItem('currentObject')) && value[1] === providersDataPayOff.data[item].object) {
                            if (!providersDataPayOff.data[item].comment.toLowerCase().includes('долг')) {
                                subTotalTmp += Number(providersDataPayOff.data[item].subTotal.replace(',', '.'));
                                if (providersDataPayOff.data[item].delivery) {
                                    subTotalTmp += Number(providersDataPayOff.data[item].delivery.replace(',', '.'));
                                }
                                if (providersDataPayOff.data[item].plain) {
                                    subTotalTmp += Number(providersDataPayOff.data[item].plain.replace(',', '.'));
                                }
                                if (providersDataPayOff.data[item].underloading) {
                                    subTotalTmp += Number(providersDataPayOff.data[item].underloading.replace(',', '.'));
                                }
                            }
                            providersDataPayOff.data[item].volume = (Number(providersDataPayOff.data[item].volume)  !== 'NaN' && Number(providersDataPayOff.data[item].volume) !== 0) ? numberWithSpaces(providersDataPayOff.data[item].volume.replace(',', '.')) : providersDataPayOff.data[item].volume;
                            providersDataPayOff.data[item].pricePerOneTon = (Number(providersDataPayOff.data[item].pricePerOneTon)  !== 'NaN' && Number(providersDataPayOff.data[item].pricePerOneTon)  !== 0) ? numberWithSpaces(providersDataPayOff.data[item].pricePerOneTon.replace(',', '.')) : providersDataPayOff.data[item].pricePerOneTon;
                            providersDataPayOff.data[item].subTotal = (Number(providersDataPayOff.data[item].subTotal)  !== 'NaN' && Number(providersDataPayOff.data[item].subTotal)  !== 0) ? numberWithSpaces(providersDataPayOff.data[item].subTotal.replace(',', '.')) : providersDataPayOff.data[item].subTotal;
                            providersDataPayOff.data[item].comment = (providersDataPayOff.data[item].comment) ? firstLetterToLowerCase(providersDataPayOff.data[item].comment) : providersDataPayOff.data[item].comment;
                            providersDataPayOff.data[item].id = item;

                            providersDataPayOffTmp.push({id: item, data: providersDataPayOff.data[item]});
                            providersDataPayOffTemp.push(providersDataPayOff.data[item]);
                        }
                    }
                });
            }
        }
        // sortByDate(providersDataPayOffTemp);

        setTotal(subTotalTmp);
        setProvidersDataPayOffs(providersDataPayOffTmp);

        setState({
            columns: [
                {
                    title: 'Марка цемента / бетона',
                    field: 'brandCement',
                    emptyValue: '',
                    headerStyle: {
                        textAlign: 'center'
                    },
                    cellStyle: {
                        fontSize: 'small',
                        padding: '0px'
                    },
                    lookup: dataTmpCement,
                    editComponent: props => {
                        let tmp = [];
                        for (let item in dataTmpCement) {
                            tmp.push([item, dataTmpCement[item]]);
                        }
                        return(
                            <Select data={tmp} value={props.value} updatedCement={updatedCement}/>
                        )
                    }
                },
                {
                    title: 'Период',
                    field: 'period',
                    emptyValue: '',
                    headerStyle: {
                        textAlign: 'center'
                    },
                    cellStyle: {
                        fontSize: 'small',
                        padding: '0px',
                        textAlign: 'center'
                    }
                },
                {
                    title: 'Объем',
                    field: 'volume',
                    emptyValue: '',
                    headerStyle: {
                        textAlign: 'center'
                    },
                    cellStyle: {
                        fontSize: 'small',
                        padding: '0px',
                        textAlign: 'center'
                    },
                    editComponent: props => (
                        <input
                            type="text"
                            style={{border: 'none', borderBottom: '1px solid #ccc', outline: 'none', marginTop: '5px', paddingBottom: '6px', width: '50px'}}
                            value={props.value}
                            id="volume"
                            placeholder='Объем'
                            onChange={e => {
                                props.onChange(e.target.value);
                                if (e.target.value !== '') {
                                    summ();
                                }
                            }}
                        />
                    )
                },
                {
                    title: 'Цена за 1 тонну',
                    field: 'pricePerOneTon',
                    emptyValue: '',
                    headerStyle: {
                        textAlign: 'center'
                    },
                    cellStyle: {
                        fontSize: 'small',
                        padding: '0px',
                        textAlign: 'center'
                    },
                    editComponent: props => (<input
                        type="text"
                        style={{border: 'none', borderBottom: '1px solid #ccc', outline: 'none', marginTop: '5px', paddingBottom: '6px', width: '100px'}}
                        value={props.value}
                        id={`pricePerOneTon`}
                        placeholder='Цена за 1 тонну'
                        onChange={e => {
                            props.onChange(e.target.value);
                            if (e.target.value !== '') {
                                summ();
                            }
                        }}
                    />)
                },
                {
                    title: 'Итого',
                    field: 'subTotal',
                    emptyValue: '',
                    headerStyle: {
                        textAlign: 'center'
                    },
                    cellStyle: {
                        fontSize: 'small',
                        padding: '0px',
                        textAlign: 'center'
                    },
                    editComponent: props => (
                        <input
                            type="text"
                            style={{border: 'none', borderBottom: '1px solid #ccc', outline: 'none', marginTop: '5px', paddingBottom: '6px', width: '150px'}}
                            value={props.value}
                            id="subTotal"
                            placeholder='Итого'
                            onChange={e => {
                                props.onChange(e.target.value)
                            }}
                        />
                    )
                },
                {
                    title: 'Доки',
                    field: 'availabilityOfDocuments',
                    emptyValue: '',
                    headerStyle: {
                        textAlign: 'center'
                    },
                    cellStyle: {
                        fontSize: 'small',
                        padding: '0px',
                        textAlign: 'center'
                    },
                    lookup: {
                        1: 'Скан',
                        2: 'Оригинал',
                        3: 'Нет'
                    }
                },
                {
                    title: 'Комментарий',
                    emptyValue: '',
                    headerStyle: {
                        textAlign: 'center'
                    },
                    field: 'comment',
                    cellStyle: comment => {
                        return comment !== undefined && comment !== null && comment !== '' && comment.toString().toLowerCase().includes('данные не') ? {color: 'red', fontSize: 'small', padding: '10px 10px 10px 0'} : {fontSize: 'small', padding: '10px 10px 10px 0'};
                    }
                },
            ],
            data: providersDataPayOffTemp
        });
        setIsLoad(false);
    };

    useEffect(() => {
        fetchDictionaryCement();
    }, []);

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

    return (
        <div style={{paddingBottom: 60}}>
            <MaterialTable
                icons={tableIcons}
                localization={{
                    header: {
                        actions: 'Действия',
                    },
                    body: {
                        emptyDataSourceMessage: 'Пока что нет новых записей',
                        filterRow: {
                            filterTooltip: 'Фильтр'
                        },
                        addTooltip: 'Добавить',
                        deleteTooltip: 'Удалить',
                        editTooltip: 'Редактировать',
                        editRow: {
                            deleteText: 'Вы действительно хотите удалить эту запись?',
                            cancelTooltip: 'Отмена',
                            saveTooltip: 'Сохранить'
                        }
                    },
                    grouping: {
                        placeholder: 'Перетащите заголовок...'
                    },
                    toolbar: {
                        addRemoveColumns: 'Добавление и удаление столбцов',
                        nRowsSelected: '{0} запись(ей) выбрано',
                        showColumnsTitle: 'Показать столбцы',
                        showColumnsAriaLabel: 'Показать столбцы',
                        exportTitle: 'Экспорт',
                        exportAriaLabel: 'Экспорт',
                        exportName: 'Экспорт в формате CSV',
                        searchTooltip: 'Поиск',
                        searchPlaceholder: 'Поиск',
                    },
                    pagination: {
                        labelDisplayedRows: '{from}-{to} из {count}',
                        labelRowsSelect: 'строк',
                        labelRowsPerPage: 'Строк на странице:',
                        firstAriaLabel: 'Первая страница',
                        firstTooltip: 'Первая страница',
                        previousAriaLabel: 'Предыдущая страница',
                        previousTooltip: 'Предыдущая страница',
                        nextAriaLabel: 'Следующая страница',
                        nextTooltip: 'Следующая страница',
                        lastAriaLabel: 'Последняя полоса',
                        lastTooltip: 'Последняя полоса',
                    },
                }}
                title={JSON.parse(localStorage.getItem('currentObject'))}
                columns={state.columns}
                data={state.data}
                options={{
                    sorting: false,
                    selection: false,
                    grouping: false,
                    filtering: false,
                    exportButton: true,
                    pageSizeOptions: [5],
                    draggable: false,
                    exportAllData: true,
                }}
                detailPanel={rowData => {
                    if (JSON.parse(localStorage.getItem('currentProvider')) === '-M3ytpeFI7Cry9gqb6c9') {
                        return (
                            <div style={{width: '800px', margin: '10px auto'}}>
                                <Button style={{marginRight: 15}} variant="contained" onClick={() => saveAdditionalData(rowData.id)}>Сохранить</Button>
                                <input
                                    type="text"
                                    style={{border: 'none', borderBottom: '1px solid #ccc', outline: 'none', marginTop: '5px', paddingBottom: '6px', width: '150px', marginRight: '10px'}}
                                    defaultValue={rowData.delivery ? numberWithSpaces(rowData.delivery) : ''}
                                    id="delivery"
                                    placeholder='Доставка'
                                    data-Id={rowData.id}
                                    onChange={() => sumErcon(rowData.subTotal, rowData.id)}
                                />
                                <input
                                    type="text"
                                    style={{border: 'none', borderBottom: '1px solid #ccc', outline: 'none', marginTop: '5px', paddingBottom: '6px', width: '150px', marginRight: '10px'}}
                                    defaultValue={rowData.underloading ? numberWithSpaces(rowData.underloading) : ''}
                                    id="underloading"
                                    placeholder='Недогруз'
                                    data-Id={rowData.id}
                                    onChange={() => sumErcon(rowData.subTotal, rowData.id)}
                                />
                                <input
                                    type="text"
                                    style={{border: 'none', borderBottom: '1px solid #ccc', outline: 'none', marginTop: '5px', paddingBottom: '6px', width: '150px', marginRight: '20px'}}
                                    defaultValue={rowData.plain ? numberWithSpaces(rowData.plain) : ''}
                                    id="plain"
                                    placeholder='Простой'
                                    data-Id={rowData.id}
                                    onChange={() => sumErcon(rowData.subTotal, rowData.id)}
                                />
                                <span>
                                    <label>Итого: </label>
                                    <label id='count' className={rowData.id}>
                                        {
                                            formatData(rowData.subTotal, rowData.delivery, rowData.underloading, rowData.plain)
                                        }
                                    </label>
                                </span>
                            </div>
                        )
                    }
                }}
                onRowClick={(event, rowData, togglePanel) => {
                    if (JSON.parse(localStorage.getItem('currentProvider')) === '-M3ytpeFI7Cry9gqb6c9') {
                        togglePanel();
                    }
                }}
                isLoading={isLoad}
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    if (localStorage.getItem('objects')) {
                                        JSON.parse(localStorage.getItem('objects')).map(item => {
                                            if (item[0] === JSON.parse(localStorage.getItem('currentObject'))) {
                                                if (newData['availabilityOfDocuments'] === undefined) {
                                                    newData['availabilityOfDocuments'] = '';
                                                }
                                                if (newData['brandCement'] === undefined) {
                                                    newData['brandCement'] = '';
                                                }
                                                if (newData['comment'] === undefined) {
                                                    newData['comment'] = '';
                                                }
                                                if (newData['pricePerOneTon'] === undefined) {
                                                    newData['pricePerOneTon'] = '';
                                                }
                                                if (newData['volume'] === undefined) {
                                                    newData['volume'] = '';
                                                }
                                                newData['isAccounting'] = false;
                                                newData['delivery'] = '';
                                                newData['plain'] = '';
                                                newData['underloading'] = '';
                                                newData['whoCompany'] = '';
                                                newData['brandCement'] = updateCement;
                                                newData['volume'] = (String(newData['volume']).includes(',') || String(newData['volume']).includes(' ')) ? newData['volume'].replace(',', '.').replace(/ /g, '') : newData['volume'];
                                                newData['pricePerOneTon'] = (document.getElementById('pricePerOneTon').value.includes(',') || document.getElementById('pricePerOneTon').value.includes(' ')) ? newData['pricePerOneTon'].replace(',', '.').replace(/ /g, '') : document.getElementById('pricePerOneTon').value;
                                                newData['subTotal'] = (document.getElementById('subTotal').value.includes(',') || document.getElementById('subTotal').value.includes(' ')) ? document.getElementById('subTotal').value.replace(',', '.').replace(/ /g, '') : document.getElementById('subTotal').value;
                                                newData['object'] = item[1];
                                                newData['provider'] = JSON.parse(localStorage.getItem('currentProvider'));
                                                axios.post(`${config.urlDB}providersDataPayOff.json`, newData).then(res => {
                                                    fetchDictionaryCement();
                                                });
                                            }
                                        });
                                    }
                                    data.push(newData);
                                    return { ...prevState, data };
                                });
                            }, 600);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                if (oldData) {
                                    setState((prevState) => {
                                        const data = [...prevState.data];
                                        providersDataPayOffs.map(item => {
                                            if (item.data === data[data.indexOf(oldData)]) {
                                                let t = {};
                                                if (String(newData['volume']).includes(',') || String(newData['volume']).includes(' ')) {
                                                    newData['volume'] = newData['volume'].replace(',', '.').replace(/ /g, '');
                                                }

                                                if (document.getElementById('pricePerOneTon').value !== '' || document.getElementById('pricePerOneTon').value.includes(',') || document.getElementById('pricePerOneTon').value.includes(' ')) {
                                                    newData['pricePerOneTon'] = document.getElementById('pricePerOneTon').value.replace(',', '.').replace(/ /g, '');
                                                }
                                                if (document.getElementById('subTotal').value !== '' || document.getElementById('subTotal').value.includes(',') || document.getElementById('subTotal').value.includes(' ')) {
                                                    newData['subTotal'] = document.getElementById('subTotal').value.replace(',', '.').replace(/ /g, '');
                                                }

                                                newData['brandCement'] = (updateCement !== '') ? updateCement : oldData.brandCement;
                                                newData['whoCompany'] = '';
                                                newData['isAccounting'] = false;
                                                newData['delivery'] = oldData.delivery ?? '';
                                                newData['plain'] = oldData.plain ?? '';
                                                newData['underloading'] = oldData.underloading ?? '';
                                                t[item.id] = newData;
                                                axios.patch(`${config.urlDB}providersDataPayOff.json`, {...t}).then(res => {
                                                    fetchDictionaryCement();
                                                });
                                            }
                                        });
                                        data[data.indexOf(oldData)] = newData;
                                        return { ...prevState, data };
                                    });
                                }
                            }, 600);
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    providersDataPayOffs.map(item => {
                                        if (item.data === data[data.indexOf(oldData)]) {
                                            axios.delete(`${config.urlDB}providersDataPayOff/${item.id}.json`).then(res => {
                                                fetchDictionaryCement();
                                            });
                                        }
                                    });
                                    data.splice(data.indexOf(oldData), 1);
                                    return { ...prevState, data };
                                });
                            }, 600);
                        }),
                }}
            />
            <p>Итого: {numberWithSpaces(total)}</p>
        </div>
    );
}
