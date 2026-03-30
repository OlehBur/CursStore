export interface Product {
    Id: number;
    Name: string;
    Price: number;
    ImageUrl: string;
    CC: number;
    Weight: number;
    HP: number;
    NM: number;
    Popularity: number;

    Quantity?: number; //onl for cart
}