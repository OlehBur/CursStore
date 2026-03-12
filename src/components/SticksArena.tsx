import type { JSX } from "react";
import "./SticksArena.css";
import { useState } from "react";
import Stick from "./Stick";
import type { boxSide } from "../core/boxSide.tsx"

type Cell = {
    top: boolean | null;
    right: boolean | null;
    bottom: boolean | null;
    left: boolean | null;
};

export default function SticksArena() {
    const rows = 10;
    const sticksHor = rows;
    // const sticksVer = pairs + 1;
    const result: JSX.Element[] = [];
    const [currPlayer, setPlayer] = useState<boolean>(false);
    const [gridBox, setGrid] = useState<Cell[][]>(
        Array.from({ length: rows }, () =>
            Array.from({ length: rows }, () => ({
                top: null,
                right: null,
                bottom: null,
                left: null,
            }))
        )
    );

    function onChangeBoxState(x: number, y: number, dir: boxSide): boolean | null {
        if ((x < 0 || x >= gridBox.length)
            || (y < 0 || y >= gridBox[0].length))
            return false;

        const oldCell = gridBox[x][y];
        const key = dir as keyof Cell;
        const newCell: Cell = { ...oldCell, [key]: currPlayer };

        setGrid(prev =>
            prev.map((row, i) =>
                row.map((cell, j) => (i === x && j === y ? newCell : cell))
            )
        );
        // setGrid(prev =>
        //     prev.map((row, i) =>
        //         row.map((cell, j) =>
        //             i === x && j === y
        //                 ? { ...cell, [dir as keyof Cell]: currPlayer }
        //                 : cell
        //         )
        //     )
        // );
        console.log(newCell.top + " " + newCell.right + " " + newCell.bottom + " " + newCell.left);
        // console.log(gridBox[x][y].top + " " + gridBox[x][y].right + " " + gridBox[x][y].bottom + " " + gridBox[x][y].left);

        return newCell.top != null
            && newCell.right != null
            && newCell.bottom != null
            && newCell.left != null;
    };

    function OnChangePlayer() {
        // setPlayer(!currPlayer);
        console.log("isFirstPlyr: " + currPlayer);
    }

    for (let i = 0; i < rows; i++) {
        result.push(
            <div key={11+i} className="stickRow">
                {Array(sticksHor).fill(null).map((_, j) => (
                    <Stick isConsistBox={false} isVertical={false}
                        key={j} indX={i} indY={j}
                        onChangeBoxState={onChangeBoxState}
                        onChangePlayer={OnChangePlayer}/> // <button key={j} className="stickHorizontal"></button>
                ))}
            </div>);
        result.push(
            <div key={22*i} className="stickRow">
                {Array(sticksHor).fill(null).map((_, j) => (
                    <Stick isConsistBox={false} isVertical={true}
                        key={j} indX={j} indY={i}
                        onChangeBoxState={onChangeBoxState}
                        onChangePlayer={OnChangePlayer} />
                    // <React.Fragment key={j}>
                    //     <button className="stickVertical"></button>
                    //     <div className="block">{i + "." + j}</div>
                    // </React.Fragment>
                ))}
                <Stick isConsistBox={true} isVertical={true}
                    indX={rows - 1} indY={i}
                    onChangeBoxState={onChangeBoxState}
                    onChangePlayer={OnChangePlayer} />
                {/* last vertical stick right */}
                {/* <div className="stickVertical"></div> */}

            </div>);
    };

    // last horizontal row bott
    result.push(
        <div key={33} className="stickRow">
            {Array(sticksHor).fill(null).map((_, j) => (
                <Stick isConsistBox={false} isVertical={false}
                    key={j} indX={j} indY={rows - 1}
                    onChangeBoxState={onChangeBoxState}
                    onChangePlayer={OnChangePlayer}/>
                // <button key={j} className="stickHorizontal"></button>
            ))}
        </div>
    );

    return <div className="arena">{result}</div>;
    // const stickGroups = [
    //     { className: "stickHorizontal", count: 10 },
    //     { className: "stickVertical", count: 11 },
    // ]
    // // const horizontalSticks = Array(10).fill('—');
    // // const verticalSticks = Array(10).fill('|');

    // return (
    //     <>  {stickGroups.map((group, index) => (
    //         <div key={index} className={group.className}>
    //             {Array(group.count).fill(null).map((s, i) => (
    //                 <button key={i}>{s}</button>
    //             ))}
    //         </div>
    //     ))}
    //     </>
    // <>
    //     <div className="horizontal">
    //         {horizontalSticks.map((stick, i) => (
    //             <button key={i} className="stick">{stick}</button>
    //         ))}
    //     </div>
    //     <div className="vertical">
    //         {verticalSticks.map((stick, i) => (
    //             <button key={i} className="stick">{stick}</button>
    //         ))}
    //     </div>
    // </>
    // )
}