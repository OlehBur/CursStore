
export default function BurList() {
    const goods = [
        { id: 1, name: 'bbb', price: 100 },
        { id: 2, name: 'aaa', price: 50 },
        { id: 3, name: 'red aaa', price: 150 },
        { id: 4, name: 'ggg', price: 200 }];
    const goodsList = goods.map(g => <li key={g.id}>{g.name}: {g.price}</li>);

    return (
        <>
            <ul>{goodsList}</ul>
        </>
    );
}