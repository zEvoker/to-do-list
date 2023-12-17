import React, { useState } from "react";
import Item from "./Item";

function App() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    function handleChange(event) {
        const newValue = event.target.value;
        setTask(newValue);
    }
    function handleDown(event) {
        if (event.key === 'Enter')
            addToList();
    }
    function addToList() {
        setTasks((prevTasks) => {
            return [...prevTasks, task];
        })
        setTask("");
    }
    function deleteItem(id) {
        setTasks((prevTasks) => {
            return prevTasks.filter((item, index) => {
                return index !== id;
            })
        })
    }
    return (
        <div className="container">
            <div className="heading">
                <h1>to-do list</h1>
            </div>
            <div className="form">
                <input onChange={handleChange} onKeyDown={handleDown} type="text" value={task} />
                <button onClick={addToList}>
                    <span>add</span>
                </button>
            </div>
            <div>
                <ul>
                    {tasks.map((items, index) => {
                        return <Item key={index} id={index} text={items} onChecked={deleteItem} />
                    })}
                </ul>
            </div>
        </div>
    );
}

export default App;
