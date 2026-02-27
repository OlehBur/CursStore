import { useState } from 'react';

export default function CartButtons() {
    const [itemsCnt, setItemsCnt] = useState(0);

    function AddItemsCnt() {///*isIncrease: boolean*/)
        setItemsCnt(itemsCnt + 1);
    };

    function DecreaseItemsCnt() {
        setItemsCnt(itemsCnt - 1);
    }

    return (
        <>
            <CartButton actText="Add" itemsCnt={itemsCnt} onClickF={AddItemsCnt} />
            <CartButton actText="Remove" itemsCnt={itemsCnt} onClickF={DecreaseItemsCnt} />
            <CartButton actText="Add" itemsCnt={itemsCnt} onClickF={AddItemsCnt} />
            <CartButton actText="Add" itemsCnt={itemsCnt} onClickF={AddItemsCnt} />
        </>
    );
}

function CartButton({ actText, itemsCnt, onClickF }: {
    actText?: string, itemsCnt: number, onClickF: () => void
}) {/*(isIncrease: boolean) =>*/
    return (
        <button onClick={onClickF}>
            {actText + ` Item To Cart (${itemsCnt})`}
        </button>
    )
}