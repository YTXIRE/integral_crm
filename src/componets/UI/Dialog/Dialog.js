import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import axios from "axios";
import config from "../../settings/config";

export default props =>  {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
        let name = document.querySelector('#nameProvider').value.trim();
        if (name !== undefined && name !== null && name !== '') {
            await axios.post(`${config.urlDB}providers.json`, {name: name, iconType: 'default'});
            props.fetchData();
        }
    };
    return (
        <div>
            <div style={{backgroundColor: '#282c34'}}>
                <IconButton style={{color: '#fff', marginLeft: 130, marginBottom: 10, backgroundColor: '#00CED1'}} aria-label="delete" color="default" onClick={handleClickOpen}>
                    <AddIcon/>
                </IconButton>
            </div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Наименование поставщика</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nameProvider"
                        label="Имя"
                        type="email"
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
