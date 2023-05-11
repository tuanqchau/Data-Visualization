/*
 * Project 1
 * Selector component JavaScript
 *
 * Author: Tuan Chau
 *
 */

import './Selector.css'
import React, {Fragment, useRef, useState} from "react";
import {InputLabel, TextField} from "@mui/material";
import {Button} from "@mui/material";
import {Select} from "@mui/material";
import {MenuItem} from "@mui/material";

//onChange: changing the temp type will call updateMinMax
const Selector = (props) =>  {

    let dataList = props.tableData;

    //function to handle when "Add new row" button is clicked
    const [newX, setNewX] = useState('');
    const [newY, setNewY] = useState('');
    const [input, setInput] = useState({x: '', y: ''});
    let keyID = 0;
    // const handleEdit = (e) => {
    //
    //     console.log("handleEdit");
    //     console.log(e);
    //     console.log(dataList);
    //     const {name, value, id} = e.target;
    //     setInput({x: name, y: value});
    //     props.editData({name:  name, id: id, data: value})
    //
    // }

    const handleRemove = (e) => {

        dataList.splice(e.target.id, 1);

        props.setData((prevState) => {return {title: prevState.title, data: dataList, _id: props.data._id }})
        props.setDataKey(props.dataKey+1);
    }

    let elements = dataList.map((ele, index) => {
        return (
            <div key={index} className="element-container">
                <div >

                    <TextField className="x-ele" name={"xValue" + index} id={index.toString()} variant="filled"
                               defaultValue={ele[Object.keys(ele)[0]]} label="x"
                                onBlur={props.handleEdit}
                    />
                    <TextField className="y-ele" name={"yValue" + index} id={index.toString()} variant="filled"
                               defaultValue={ele[Object.keys(ele)[1]]} label="y" onFocus={props.handleFocus}
                               onBlur={props.handleEdit}
                    />
                    <Button className="remove-button" variant ="outlined" id={index} onClick={handleRemove}>Remove</Button>
                </div>
            </div>
        )})
    const handleClickAddRow = () => {
        keyID++;
        const newObject = {x: newX, y: newY, id: keyID}
        const data = props.tableData
        //addRow takes 2 parameters of the old list plus a newly added object
        props.addRow([...data, newObject])
    }

    const handleNewX = (e) => {
        setNewX(e.target.value);

    }

    const handleNewY = (e) => {
        setNewY(e.target.value);
    }



        return(
            <div className="selector">
                <div className="selector-container">


                    <div className="file-edit">
                        <div className="file-edit-title">
                            <h2 className="file-title">File</h2>
                            <h2 className="edit-title">Edit</h2>
                        </div>
                        <div className="file-edit-container">
                            <div className="File">
                                <Button className="file-button" variant ="outlined" onClick={props.handleNew}>New</Button>
                                <Button className="file-button" variant ="outlined" onClick={props.handleClickOpen}>Load</Button>
                                <Button className="file-button" variant ="outlined" onClick={props.handleSave}>Save</Button>
                                <Button className="file-button" variant ="outlined" onClick={props.handleSaveAs}>Save As</Button>
                            </div>


                            <div className="Edit">
                                <Button variant ="outlined" onClick={props.handleUndo}>Undo</Button>
                                <Button variant ="outlined" onClick={props.handleRedo}>Redo</Button>
                                <Button variant ="outlined" onClick={props.handleCut}>Cut</Button>
                                <Button variant ="outlined" onClick={props.handleCopy}>Copy</Button>
                                <Button variant ="outlined" onClick={props.handlePaste}>Paste</Button>
                            </div>
                        </div>
                    </div>
                    <div className="addNew">
                        <TextField className="x-input" id="new-year" label="x" variant="outlined" type="number" onChange={handleNewX}/>
                        <TextField className="y-input" id="new-population" label="y" variant="outlined" type="number" onChange={handleNewY}/>

                    </div>

                    <div className="add-button-container">
                        <Button className="add-button" variant ="outlined" onClick={() => handleClickAddRow()}>Add New Row</Button>
                    </div>
                    <div className="dataElement">{elements}</div>

                

                </div>
            </div>
        );

}

export default Selector;
