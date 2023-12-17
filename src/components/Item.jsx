import React, { useState } from "react";

function Item(props) {
    const [done, setDone] = useState(false);
    function strike() {
        setDone(prevValue => {
            return !prevValue;
        });
    }
    return (
        <li onClick={strike} style={{ textDecoration: done && "line-through" }} >{props.text}
            {done && <button onClick={() => { props.onChecked(props.id) }}><span>-</span></button>}
        </li>
    )
}

export default Item;