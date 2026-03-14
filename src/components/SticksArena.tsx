import type { JSX } from "react";
import "./SticksArena.css";
import React, { useState } from "react";
import Stick from "./Stick";
import type { boxSide } from "../core/boxSide.tsx"
import Block from "./Block.tsx";

type Cell = {
    top: boolean | null;
    right: boolean | null;
    bottom: boolean | null;
    left: boolean | null;
    lastPlayer: boolean;
};

type arenaProps = {
    setMainScore: (s: number) => void;
    // setMainScore1: (s: number) => void;
    // setMainScore2: (s: number) => void;
    setPlayer: (s: boolean) => void;
    // onUpdate: (s1: number, s2: number, isFirstPl: boolean) => void;
};

export default function SticksArena(prop: arenaProps) {
    const rows = 10;
    const sticksHor = rows;
    // const sticksVer = pairs + 1;
    const result: JSX.Element[] = [];
    // const [score1, setS1] = useState(0);
    // const [score2, setS2] = useState(0);
    const [currPlayer, setPlayer] = useState<boolean>(false);
    const [gridBox, setGrid] = useState<Cell[][]>(
        Array.from({ length: rows }, () =>
            Array.from({ length: rows }, () => ({
                top: null,
                right: null,
                bottom: null,
                left: null,
                lastPlayer: false,
            }))
        )
    );
    // const [stickDetector, setStickDet] = useState<boolean

    function onChangeBoxState(x: number, y: number, dir: boxSide, x1: number, y1: number, dir1: boxSide): boolean | null {
        const IsValidInd = (x_: number, y_: number) => {
            return x_ >= 0 && x_ < gridBox.length
                && y_ >= 0 && y_ < gridBox[0].length;
        }

        // if ((x < 0 || x >= gridBox.length)
        //     || (y < 0 || y >= gridBox[0].length))
        //     return false;
        const isExistFirst = IsValidInd(x, y);
        const isExistSecond = IsValidInd(x1, y1);
        const newCell: Cell | null = isExistFirst ? { ...gridBox[x][y], [dir as keyof Cell]: currPlayer, lastPlayer: currPlayer } : null;
        const newCell1: Cell | null = isExistSecond ? { ...gridBox[x1][y1], [dir1 as keyof Cell]: currPlayer, lastPlayer: currPlayer } : null;

        setGrid(prev =>
            prev.map((row, i) =>
                row.map((cell, j) => {
                    if (/*isExistFirst && */newCell != null && i === x && j === y) {
                        // console.log(newCell.top + " " + newCell.right + " " + newCell.bottom + " " + newCell.left);
                        return newCell;
                    } else if (/*isExistSecond && */newCell1 != null && i === x1 && j === y1) {
                        // console.log(newCell1.top + " " + newCell1.right + " " + newCell1.bottom + " " + newCell1.left);
                        return newCell1;
                    }
                    else
                        return cell;
                }
                ))
        );

        const IsBoxFilled = (c: Cell | null): boolean => {
            return c != null
                && c.top != null
                && c.right != null
                && c.bottom != null
                && c.left != null;
        }
        const firstBoxFill = IsBoxFilled(newCell);
        const secondBoxFill = IsBoxFilled(newCell1);
        const isBoxFilled = firstBoxFill || secondBoxFill;
        let score = (firstBoxFill ? 1 : 0) + (secondBoxFill ? 1 : 0);

        // if (!currPlayer)
        //     setS1(score1 + score);
        // else
        //     setS2(score2 + score);
        prop.setMainScore(score);

        // prop.setMainScore1(score1 + score);
        // prop.setMainScore2(score2 + score);

        console.log(gridBox[0][0].top + " " + gridBox[0][0].right + " " + gridBox[0][0].bottom + " " + gridBox[0][0].left)
        return isBoxFilled;
    };

    function OnChangePlayer() {
        setPlayer(!currPlayer);
        // console.log("isFirstPlyr: " + currPlayer);
        prop.setPlayer(currPlayer);
        // prop.onUpdate(score1, score2, currPlayer);
        return currPlayer;
    }

    for (let i = 0; i < rows; i++) {
        result.push(//hor
            <div key={11 + i} className="stickRow">
                {Array(sticksHor).fill(null).map((_, j) => (
                    <Stick isVertical={false}
                        key={j} indX={j} indY={i}
                        onChangeBoxState={onChangeBoxState}
                        onChangePlayer={OnChangePlayer}
                        isFirstPlayer={currPlayer} /> // <button key={j} className="stickHorizontal"></button>
                ))}
            </div>);
        result.push(//vert
            <div key={22 * i} className="stickRow">
                {Array(sticksHor).fill(null).map((_, j) => (
                    <React.Fragment key={j}>
                        <Stick isVertical={true}
                            key={j} indX={j} indY={i}
                            onChangeBoxState={onChangeBoxState}
                            onChangePlayer={OnChangePlayer}
                            isFirstPlayer={currPlayer} />
                        <Block top={gridBox[j][i].top} right={gridBox[j][i].right}
                            bottom={gridBox[j][i].bottom}
                            left={gridBox[j][i].left}
                            isFirstPlayer={gridBox[j][i].lastPlayer}
                            str={j + "+" + i}
                        />
                    </React.Fragment>
                    // <React.Fragment key={j}>
                    //     <button className="stickVertical"></button>
                    //     <div className="block">{i + "." + j}</div>
                    // </React.Fragment>
                ))}
                <Stick isVertical={true}//t last vertical stick right 
                    indX={rows} indY={i}
                    onChangeBoxState={onChangeBoxState}
                    onChangePlayer={OnChangePlayer}
                    isFirstPlayer={currPlayer} />

                {/* <div className="stickVertical"></div> } */}
                {/* {Array(sticksHor).fill(null).map((_, j) => (<>
                    <Stick isVertical={true}
                        key={j}
                        indX={j}
                        indY={i}
                        onChangeBoxState={onChangeBoxState}
                        onChangePlayer={OnChangePlayer}
                        isFirstPlayer={currPlayer} />
                    <div className="block" style={{
                        backgroundColor: (() => {
                            const cell = gridBox[j][i];
                            if (cell.top === null || cell.right === null ||
                                cell.bottom === null || cell.left === null)
                                return "#7e7e7e";
                            return cell.top ? "#9eff5d" : "#ff7ce5";
                        })()
                    }} />                </>))} */}
            </div>);
    };

    // last horizontal row bott
    result.push(
        <div key={33} className="stickRow">
            {Array(sticksHor).fill(null).map((_, j) => (
                <Stick isVertical={false}
                    key={j} indX={j} indY={rows}
                    onChangeBoxState={onChangeBoxState}
                    onChangePlayer={OnChangePlayer}
                    isFirstPlayer={currPlayer} />
                // <button key={j} className="stickHorizontal"></button>
            ))}
        </div>
    );

    return <div className="sticksArena">{result}</div>;
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