import React, {useState} from 'react';

const Card = (props) => {
    const [state, setState] = useState({
        showCard:false,
        val:'',
        bgColor:'',
    })

    const handleClick = () => {
        if(state.showCard === false) {
            setState(prevState => ({
                ...prevState,
                showCard:true,
                bgColor:'',
            }));
            props.onMove({coordinate: props.coordinate, value: props.value, hide: hide, correct:correct});
            setTimeout(() => {
                setState(prevState => ({
                    ...prevState,
                    val:props.value,
                }));
            }, 400);
        }
    }

    const hide = () => {
        setState(prevState => ({
            ...prevState,
            bgColor:'bg-wrong',
        }));
        setTimeout(() => { 
            setState(prevState => ({
                ...prevState,
                showCard:false,
                bgColor:'',
                val:'',
            }));
        }, 1000);
    }

    const correct = () => {
        setState(prevState => ({
            ...prevState,
            bgColor:'bg-correct',
        }));
    }

    return (
        <div className="card" onClick={() => handleClick()}>
            {state.showCard ?
                <div className={"cardFront "+ state.bgColor}>{state.val}</div>
            :
                <div className="cardBack"></div>
            }
        </div>
    )
}

export default Card;