import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import axios from "axios";
import config from "../../settings/config";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

export default props =>  {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
        let name = document.querySelector('#nameProvider').value.trim();
        if (name !== undefined && name !== null && name !== '') {
            await axios.post(`${config.urlDB}objects.json`, {name: name, provider: JSON.parse(localStorage.getItem('currentProvider')), company: JSON.parse(localStorage.getItem('currentCompany'))});
            props.fetchDataProviderCards();
        }
    };
    return (
        <div>
            <Button onClick={handleClickOpen}>
                <Card className='card'>
                    <div className='cardItem'>
                        <Typography
                            className='title'
                            gutterBottom
                        >
                            <AddIcon style={{fontSize: 100}}/>
                        </Typography>
                    </div>
                </Card>
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Название объекта</DialogTitle>
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
