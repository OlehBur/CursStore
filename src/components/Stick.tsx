import type { JSX } from "react";
import { useState } from "react";
import "./SticksArena.css"
import type { boxSide } from "../core/boxSide.tsx"

type StickProps = {
    isVertical: boolean;
    // isConsistBox: boolean;
    indX: number;
    indY: number;
    isFirstPlayer: boolean;
    onChangeBoxState: (x: number, y: number, dir: boxSide, x1: number, y1: number, dir1: boxSide) => boolean | null;
    onChangePlayer: () => boolean;
};


export default function Stick(prop: StickProps) {
    const elem: JSX.Element[] = [];
    const [isClicked, setClick] = useState<boolean | null>(null);
    // const [isBoxCLicked, setBoxClick] = useState<boolean | null>(null);
    // const [isFirstPlayer, setPlayer] = useState<boolean>(false);
    let boxClickRes: boolean | null = null;
    const backCol = isClicked == null ? "#cbcbcb" : isClicked ? "#9eff5d" : "#ff7ce5";

    function handleClick() {
        if (isClicked != null)
            return;

        setClick(prop.isFirstPlayer);
        // console.log('clicked!');
        // setPlayer(true);

        if (prop.isVertical)
            boxClickRes = prop.onChangeBoxState(prop.indX, prop.indY, "left", prop.indX - 1, prop.indY, "right");
        else
            boxClickRes = prop.onChangeBoxState(prop.indX, prop.indY, "top", prop.indX, prop.indY - 1, "bottom");

        if (!boxClickRes)
            // setBoxClick(boxClickRes);
        // else//fail
            prop.onChangePlayer()// setPlayer(prop.onChangePlayer());

        // console.log("isFirstPlyr: " + prop.isFirstPlayer);
        // console.log("є?: " + boxClickRes);
    }

    if (prop.isVertical) {
        elem.push(<button key={1}
            className={"stickVertical"}
            onClick={handleClick}
            style={{ backgroundColor: backCol }}
        ></button>);
        // if (!prop.isConsistBox)
        // elem.push(<div className="block" key={2}
        // style={{ backgroundColor: isBoxCLicked == null ? "#7e7e7e" : isBoxCLicked ? "#9eff5d" : "#ff7ce5" }}>
        // </div >);
    } else {
        elem.push(<button key={3}
            className={"stickHorizontal"}
            onClick={handleClick}
            style={{ backgroundColor: backCol }}
        ></button>);
    }

    return elem;
}