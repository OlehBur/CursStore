export interface Product {
    Id: number;
    Name: string;
    Description: string;
    Price: number;
    ImageUrl: string;
    VideoUrl: string;
    CC: number;
    Weight: number;
    HP: number;
    NM: number;
    Popularity: number;
    ShopId: number;

    Quantity?: number; //onl for cart
}