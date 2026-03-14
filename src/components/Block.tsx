import { useState } from "react";
import "./SticksArena.css"

type StickProps = {
    top: boolean | null;
    right: boolean | null;
    bottom: boolean | null;
    left: boolean | null;
    isFirstPlayer: boolean;
    str: string;
}

export default function Block(prop: StickProps) {
    // const [isBoxFilled, setBoxFilled] = useState<boolean | null>(null);
    // setBoxFilled(prop.bottom != null && prop.left != null && prop.right != null && prop.top != null);
    const isFilled = prop.top !== null
        && prop.right !== null
        && prop.bottom !== null
        && prop.left !== null;

    const color = isFilled
        ? (prop.isFirstPlayer ? "#76bd46" : "#c75eb2")
        : "#7e7e7e";


    return (<div className="block" style={{ backgroundColor: color }
    }>{prop.str} </div >);
};