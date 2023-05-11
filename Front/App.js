/*
JavaScript component for App
Author: Tuan Chau
Project 2
 */
import ChartData from './Chart';
import './App.css';
import React, {useEffect, useState} from 'react';
import Selector from "./Selector";
import Item from './Item.js';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal, TextField,
    Typography
} from "@mui/material";
import * as PropTypes from "prop-types";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import {Box, Container} from "@mui/system";
import ScatterPlot from "./ScatterPlot";

let g_undo = []
let g_redo = []
const App = ()=> {
    const [selection, setSelection] = useState([]);

    const onSelect = (e) => {
        //console.log(e.target.dataPointIndex);
        if (selection.includes(e.target.dataPointIndex)) {
            let i = selection.indexOf(e.target.dataPointIndex);
            let temp = selection;
            if (i > -1) {
                temp.splice(i, 1);
                setSelection([...temp]);
            }
        }else {
            let temp = selection;
            setSelection([...temp, e.target.dataPointIndex]);
        }
    }
    //const storageList = [];
    //
    // for (let i = 0; i < localStorage.length; i++) {
    //     const key = localStorage.key(i);
    //     storageList.push(key);
    // }

    //create new js object with title and an empty list
    const [data, setData] = useState({title: '', data: [], _id: '', fileName: ''});
    const [dataKey, setDataKey] = useState(0);
    // const [undo, setUndo] = useState([]);
    const [holderC, setHolderC] = useState([]);
    // const [redo, setRedo] = useState([]);
    const [fileStored, setFileStored] = useState(storageToArray);

    function storageToArray() {
        const storageList = [];

        axios.get('http://localhost:5000/db/find').then(res => {
            for (let i = 0; i < res.data.length; i++) {
                storageList.push(res.data[i].fileName);
            }
        });
        return storageList;
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(JSON.parse(event.target.value));
    };
    const handleUndo = () => {

        if(g_undo.length > 0){

            g_redo = [...g_redo, data]
            console.log(g_undo)
            const popped = g_undo.pop();
            setData(popped)
        }
    }

    const handleRedo = () => {
        if (g_redo.length > 0)
        {
            g_undo = [...g_undo, data]
            const popped = g_redo.pop();
            setData(popped)
        }
    }
    /*
        when add new row is clicked, return the same title and a new list
     */
    const handleRowUpdate = (e) => {
        g_undo = [...g_undo, data]
        //console.log(g_undo)
        //console.log("g_undo_length" + g_undo.length)
        //console.log(undo);
        let tempID = data._id;
        setData((prevState) => {
            return {title: prevState.title, data: e, _id: tempID}});
    }

    //create a new page
    const handleNew = (e) => {
        setData({title:'', data:[]});
    }

    const handleSaveAs = (e) => {
        let fName = prompt("Enter file name: ");
            const tempObj = {title: fName, data: data.data, _id: '', fileName: fName};
            //console.log(tempObj);
            setData(tempObj);
            axios.post('http://localhost:5000/db/createNew/', tempObj)
                .then(res => {
                    console.log(res.data);
                })
        storageToArray();

    }

    const handleSave = (e) => {
        //if the file name is blank then prompts for file name. need fix
        if (data.title === '') {
            handleSaveAs();
        }
        else {

            const tempObj = {title: data.title, data: data.data, _id: data._id, fileName: data.title};
            console.log(tempObj);
            axios.post('http://localhost:5000/db/update/' + tempObj._id, tempObj)
                .then(res => {
                    //console.log(res.data);
                })
            storageToArray();
        }
    }


    const handleLoad = (e) => {


    }

    //Dialog Box for Load
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(localStorage[1]);

    //when Load button is clicked
    const handleClickOpen = () => {
        storageToArray();
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    const loadData = (key, ind) => {
        axios.get('http://localhost:5000/db/find').then(res => {
            //setData(title: data[ind].title, data: data[ind].data);
            let tempObj = {title: res.data[ind].title, data: res.data[ind].data, _id: res.data[ind]._id, fileName: res.data[ind].title};
            setData(tempObj);
            //setData(res.data[ind]);
        });

    }
    console.log(data);



    function SimpleDialog(props) {
        const { onClose, open } = props;

        const handleClose = () => {
            onClose(selectedValue);
        };

        const handleListItemClick = (value) => {
            onClose(value);
        };

        return (

            <Dialog onClose={handleClose} open={open}>

                <DialogTitle>Choose a file to load: </DialogTitle>
                {fileStored.map((key, ind) => (
                    <ListItem key={ind} onClick={() => {loadData(key, ind)}}>
                        <ListItemText primary={key} />
                    </ListItem>
                ))}
            </Dialog>
        );
    }

    SimpleDialog.propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,

    };

    const editData = (e) => {

        let currentData = data.data;
        if (e.name.includes("xValue")) {
            currentData[e.id].x = e.data;
        }
        else {
            currentData[e.id].y = e.data;
        }
        setData({title: data.title, data: currentData});
        setDataKey(dataKey + 1);
    }

    const handleFocus = () => {
        console.log(data);
        g_undo = [...g_undo, data];
    }
    const handleEdit = (e) => {

        console.log(g_undo);
        const {name, value, id} = e.target;
        //setInput({x: name, y: value});
        editData({name:  name, id: id, data: value})

    }

    //cut,copy and paste
    const handleCut = (e) => {
        // setHolderC(data.data);
        // //holderC = data.data;
        // console.log(holderC);
        // handleNew();
        console.log("HERE")
        let tempSelected = [];
        let tempNotSelected = [];

        for (let i = 0; i < data.data.length; i++) {
            if (selection.includes(i) === true) {
                tempSelected.push(data.data[i]);
            }
            else {
                tempNotSelected.push(data.data[i]);
            }
        }

        setHolderC(tempSelected);
        setData({title: data.title, data: tempNotSelected, _id: data._id, fileName: data.title});
    }
    const handleCopy = (e) => {
        //setHolderC(data.data); old
        let tempArr = [];
        for (let i = 0; i < selection.length; i++) {
            for (let j = 0; j < data.data.length; j++) {
                if (selection[i] === j) {
                    tempArr.push(data.data[j]);
                }
            }
        }
        setHolderC(tempArr);
    }
    const handlePaste = (e) => {
        g_undo = [...g_undo, data]
        console.log(g_undo);
        setData((prevState) => {return {title: prevState.title, data: data.data.concat(holderC) }});
        console.log(data);
    }


    /*
    props is everything that get passed in
    Pass the list into Chart and Selector
     */
    return (
        <Container className="App" >

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }} >
                <Item>
                    <PieChart dataset={data} selection={selection} onSelect={onSelect} sx={{
                        bgcolor: 'white', width: '100%', height: '100%'
                    }}></PieChart>
                </Item>
                <Item>
                    <BarChart dataset={data} selection={selection} onSelect={onSelect} sx={{
                        bgcolor: 'white', width: '100%', height: '100%'
                    }}>
                    </BarChart>
                </Item>
                <Item>
                    <ScatterPlot dataset={data} selection={selection} onSelect={onSelect} sx={{
                        bgcolor: 'white', width: '100%', height: '100%'
                    }}></ScatterPlot>
                </Item>
            </Box>
            <Selector data={data} tableData={data.data} addRow={handleRowUpdate} handleNew={handleNew}
                      handleSave={handleSave} handleSaveAs={handleSaveAs} handleLoad={handleLoad}
                      handleClickOpen={handleClickOpen} editData={editData} setData={setData} dataKey={dataKey}
                      setDataKey={setDataKey} handleUndo={handleUndo} handleRedo={handleRedo}
                      handleCut={handleCut} handleCopy={handleCopy} handlePaste={handlePaste} handleFocus={handleFocus} handleEdit={handleEdit}/>

            <div><br />
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                />
            </div>
        </Container>
  );
}

export default App;
