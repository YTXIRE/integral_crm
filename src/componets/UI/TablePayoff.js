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
import {firstLetterToLowerCase, numberWithSpaces} from "../settings/fns";
import axios from 'axios';
import config from "../settings/config";

export default props => {
    const [state, setState] = React.useState({});
    const [providersDataPayOffs, setProvidersDataPayOffs] = React.useState({});
    const [total, setTotal] = React.useState(0);
    const [isLoad, setIsLoad] = React.useState(true);

    const [payoff, setPayoff] = useState([]);
    const rows = [];

    useEffect(() => {
        fetchDataTable()
    }, []);

    function sortByDate(arr) {
        return arr.sort((a, b) => {
            let t = a.date.split('.');
            let aDate = `${t[2]}-${t[1]}-${t[0]}`;
            t = b.date.split('.');
            let bDate = `${t[2]}-${t[1]}-${t[0]}`;
            return new Date(aDate) < new Date(bDate) ? 1 : -1;
        });
    }

    async function fetchDataTable () {
        const data = await axios.get(`${config.urlDB}payoff.json`);
        for (let item in data.data) {
            data.data[item].payoff = (Number(data.data[item].payoff) !== 'NaN') ? numberWithSpaces(data.data[item].payoff) : data.data[item].payoff;
            if (data.data[item].company === props.company && data.data[item].provider === props.providerId) {
                let dateModified = data.data[item].date.split('.');
                rows.push({
                    id: item,
                    date: `${dateModified[2]}-${dateModified[1]}-${dateModified[0]}`,
                    payoff: data.data[item].payoff,
                    company: data.data[item].company,
                    provider: data.data[item].provider
                })
            }
        }

        sortByDate(rows);

        setState({
            columns: [
                {
                    title: '???????? ????????????',
                    field: 'date',
                    emptyValue: '',
                    type: 'date',
                    cellStyle: {
                        fontSize: 'small',
                        padding: '0px'
                    },
                },
                {
                    title: '??????????',
                    field: 'payoff',
                    emptyValue: '',
                    cellStyle: {
                        fontSize: 'small',
                        padding: '0px',
                        textAlign: 'center'
                    }
                },
            ],
            data: rows
        });
        setIsLoad(false);
        setPayoff(rows);
    }

    if (props.isUpdate) {
        fetchDataTable();
    }

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
            <MaterialTable
                style={{borderRadius: 0}}
                icons={tableIcons}
                localization={{
                    header: {
                        actions: '????????????????',
                    },
                    body: {
                        emptyDataSourceMessage: '???????? ?????? ?????? ?????????? ??????????????',
                        filterRow: {
                            filterTooltip: '????????????'
                        },
                        addTooltip: '????????????????',
                        deleteTooltip: '??????????????',
                        editTooltip: '??????????????????????????',
                        editRow: {
                            deleteText: '???? ?????????????????????????? ???????????? ?????????????? ?????? ?????????????',
                            cancelTooltip: '????????????',
                            saveTooltip: '??????????????????'
                        }
                    },
                    grouping: {
                        placeholder: '???????????????????? ??????????????????...'
                    },
                    toolbar: {
                        addRemoveColumns: '???????????????????? ?? ???????????????? ????????????????',
                        nRowsSelected: '{0} ????????????(????) ??????????????',
                        showColumnsTitle: '???????????????? ??????????????',
                        showColumnsAriaLabel: '???????????????? ??????????????',
                        exportTitle: '??????????????',
                        exportAriaLabel: '??????????????',
                        exportName: '?????????????? ?? ?????????????? CSV',
                        searchTooltip: '??????????',
                        searchPlaceholder: '??????????',
                    },
                    pagination: {
                        labelDisplayedRows: '{from}-{to} ???? {count}',
                        labelRowsSelect: '??????????',
                        labelRowsPerPage: '?????????? ???? ????????????????:',
                        firstAriaLabel: '???????????? ????????????????',
                        firstTooltip: '???????????? ????????????????',
                        previousAriaLabel: '???????????????????? ????????????????',
                        previousTooltip: '???????????????????? ????????????????',
                        nextAriaLabel: '?????????????????? ????????????????',
                        nextTooltip: '?????????????????? ????????????????',
                        lastAriaLabel: '?????????????????? ????????????',
                        lastTooltip: '?????????????????? ????????????',
                    },
                }}
                title={props.companyName}
                columns={state.columns}
                data={state.data}
                options={{
                    sorting: false,
                    selection: false,
                    grouping: false,
                    filtering: false,
                    exportButton: false,
                    pageSizeOptions: [5],
                    draggable: false,
                    search: false,
                    columnsButton: false,
                    doubleHorizontalScroll: false,
                    emptyRowsWhenPaging: false,
                    exportAllData: false,
                    header: true,
                    showEmptyDataSourceMessage: false,
                    showFirstLastPageButtons: false,
                    showSelectAllCheckbox: false,
                    showTextRowsSelected: false,
                    tableLayout: 'fixed',
                }}
                isLoading={isLoad}
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    newData['payoff'] = newData['payoff'].replace(',', '.').replace(/ /g, '');
                                    data.push(newData);
                                    axios.post(`${config.urlDB}payoff.json`, {date: new Date(newData.date).toLocaleDateString(), payoff: newData.payoff, company: props.company, provider: props.providerId}).then(res => {
                                        fetchDataTable();
                                    });
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
                                        let t = {};
                                        newData['payoff'] = newData['payoff'].replace(',', '.').replace(/ /g, '');
                                        t[oldData.id] = {date: new Date(newData.date).toLocaleDateString(), payoff: newData.payoff, company: props.company, provider: props.providerId};
                                        axios.patch(`${config.urlDB}payoff.json`, {...t}).then(res => {
                                            fetchDataTable();
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
                                    axios.delete(`${config.urlDB}payoff/${oldData.id}.json`).then(res => {
                                        fetchDataTable();
                                    });
                                    data.splice(data.indexOf(oldData), 1);
                                    return { ...prevState, data };
                                });
                            }, 600);
                        }),
                }}
            />
    );
}
