import './BurButt.css'
import { useState } from "react";

export default function BurButt() {
    //let isHere = true;//nah naj, doesnt work 
    const [isHere, setIsHere] = useState(true);//set - ch st - redraw elem

    return (
        <>
            <button onClick={() => setIsHere(!isHere)}
            >Click Bur</button >
            <h1 className={isHere ? "hH1" : "hH1 miss"}>BURRR: {isHere ? '' : 'isn`t'} here</h1>
        </>
    );
}