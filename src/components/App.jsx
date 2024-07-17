import './App.css'
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function App() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const [canvasCTX, setCanvasCTX] = useState(null);
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(7);
    const [todo, setTodo] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        setCanvasCTX(ctx);
    }, [canvasRef]);

    const SetPos = (e) => {
        setMouseData({
            x: e.clientX,
            y: e.clientY,
        });
    };
    const setTouchPos = (e) => {
        const touch = e.touches[0];
        setMouseData({
            x: touch.clientX,
            y: touch.clientY,
        });
    };

    const Draw = (e) => {
        if (e.buttons !== 1) return;
        const ctx = canvasCTX;
        ctx.beginPath();
        ctx.moveTo(mouseData.x+4, mouseData.y-20);
        setMouseData({
            x: e.clientX,
            y: e.clientY,
        });
        ctx.lineTo(e.clientX+4, e.clientY-20);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.stroke();
    };
    const drawOnTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const ctx = canvasCTX;

        ctx.beginPath();
        ctx.moveTo(mouseData.x, mouseData.y);
        setMouseData({
            x: touch.clientX,
            y: touch.clientY,
        });
        ctx.lineTo(touch.clientX, touch.clientY);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.stroke();
    };

    function handleChange(event) {
        const newValue = event.target.value;
        setTask(newValue);
    }
    function handleDown(event) {
        if (event.key === 'Enter')
            addToList();
    }
    function addToList() {
        if (task === "") return
        setTasks((prevTasks) => {
            return [...prevTasks, [task, false]];
        })
        setTask("");
    }
    function strike(id) {
        setTasks((prevTasks) => {
            if (prevTasks && id >= 0 && id < prevTasks.length) {
                const updatedTasks = [...prevTasks];
                updatedTasks[id][1] = !updatedTasks[id][1];
                return updatedTasks;
            } else {
                return prevTasks;
            }
        });
    }
    function deleteItem(id) {
        setTasks((prevTasks) => {
            if (prevTasks && id >= 0 && id < prevTasks.length) {
                const updatedTasks = [...prevTasks];
                updatedTasks.splice(id, 1);
                return updatedTasks;
            } else {
                return prevTasks;
            }
        });
    }

    const handleDragDrop = (results) => {
        if (!results) return;
        const { source, destination, type } = results;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (type === 'group') {
            const reorderedTasks = [...tasks];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedTask] = reorderedTasks.splice(sourceIndex, 1);
            reorderedTasks.splice(destinationIndex, 0, removedTask);
            return setTasks(reorderedTasks);
        }
    }

    return (
        <div className="cover">
            <canvas className="canva"
                ref={canvasRef}
                onMouseEnter={(e) => SetPos(e)}
                onMouseMove={(e) => { SetPos(e); Draw(e); }}
                onMouseDown={(e) => SetPos(e)}
                onTouchStart={(e) => setTouchPos(e)}
                onTouchMove={(e) => drawOnTouchMove(e)}
            ></canvas>
            <div className="controlpanel">
                <button onClick={() => setTodo(!todo)}>{todo ? "draw" : "list"}</button>
                <input type="range" value={size} max={40} onChange={(e) => { setSize(e.target.value); }} />
                <input type="color" id="favcolor" value={color} onChange={(e) => { setColor(e.target.value); }} style={{ display: 'none' }} />
                <label for="favcolor"><FontAwesomeIcon icon={faPalette} className='chTheme' /></label>
                <button
                    onClick={() => { const ctx = canvasCTX; ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); }}>
                    erase
                </button>
            </div>
            {todo && <div className="container">
                <div className="heading">
                    <h1>to-do list</h1>
                </div>
                <div className="form">
                    <input onChange={handleChange} onKeyDown={handleDown} type="text" value={task} />
                    <button onClick={addToList}>
                        <span>add</span>
                    </button>
                </div>
                <DragDropContext onDragEnd={(results) => { handleDragDrop(results) }}>
                    <Droppable droppableId="ROOT" type="group">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                <ul>
                                    {tasks.map((items, index) => (
                                        <Draggable draggableId={index.toString()} key={index} index={index}>
                                            {(provided) => (
                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                    <li className="taskcont" style={{ textDecoration: items[1] && "line-through" }} >
                                                        <span onClick={() => strike(index)}>{items[0]}</span>
                                                        {items[1] && <button onClick={() => { deleteItem(index) }}><span><FontAwesomeIcon icon={faTrashAlt} /></span></button>}
                                                    </li>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>}
        </div>
    );
}

export default App;
