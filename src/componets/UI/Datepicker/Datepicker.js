import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

const getDate = () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();

    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(month)) {
        month = '0' + month;
    }
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(day)) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
};

export default () => {
    const classes = useStyles();

    return (
        <form className={classes.container} noValidate>
            <TextField
                label="Дата платежа"
                type="date"
                defaultValue={getDate()}
                id="date-picker-inline"
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </form>
    );
}
