import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default props => {
    const classes = useStyles();
    const [cement, setCement] = React.useState(props.value);

    const handleChange = (event) => {
        setCement(event.target.value);
        props.updatedCement(event.target.value);
    };

    return (
        <FormControl className={classes.formControl}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cement}
                onChange={handleChange}
            >
                {
                    props.data.map(item => (<MenuItem key={item[0]} value={item[0]}>{item[1]}</MenuItem>))
                }

            </Select>
        </FormControl>
    );
}
