export interface LastBid {
    id: number;
    amount: string; 
    lot: number;    
    bidder: number; 
  }
  
export interface Lot {
    id: number;
    title: string;
    description: string;
    starting_price: string; 
    is_reserve: boolean;
    reserve_price: string; 
    start_datetime: string; 
    end_datetime: string;   
    seller: number; 
    last_bid: LastBid | null; 
}
  
export interface LotsResponse {
    count: number;
    results: Lot[];
}