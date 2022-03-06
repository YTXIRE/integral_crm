import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
import config from "../../settings/config";

export default props =>  {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
        let numberPayoff = document.querySelector('#numberPayoff').value;
        let price = document.querySelector('#price').value;
        if (numberPayoff !== undefined && numberPayoff !== null && numberPayoff !== '' && price !== undefined && price !== null && price !== '') {
            await axios.post(`${config.urlDB}dictionaryCement.json`, {name: numberPayoff, price: price});
            props.fetchData();
        }
    };
    return (
        <div>
            <Button variant="contained" style={{backgroundColor: 'rgba(0,206,209, .7)', color: '#fff', width: '100%'}} onClick={handleClickOpen}>
                Добавить
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Название цемента/бетона</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="numberPayoff"
                        label="Название цемента/бетона"
                        type="string"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="price"
                        label="Стоимость"
                        type="string"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
