export interface Lesson {
  id: number;                
  tutor: number;             
  student: number;           
  subject: string;           
  date: string;              
  duration: string;          
  notes?: string | null;     

  isConfirmed?: boolean | null;      
  confirmationTime?: string | null;  

  isCancelled?: boolean | null;      
  cancellationTime?: string | null;  

  isConducted?: boolean | null;      
}

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

export interface CreateLotData {
    title: string;
    description: string;
    starting_price: number;
    is_reserve: boolean;
    reserve_price?: number;
    start_datetime: string;
    end_datetime: string;
    image?: {
      uri: string;
      type: string;
      fileName: string;
    };
  }

  export interface User {
    email: string;
    first_name: string;
    last_name: string;
  }
  
  export interface Tutor {
    id: number;
    about: string;
    birth_date: string; // Формат ISO 8601, например, "YYYY-MM-DD"
    education: string;
    links: string; // Ссылки в виде строки, разделённой запятыми
    age: number;
  }
  
  export interface Profile {
    user: User;
    is_tutor: boolean;
    tutor?: Tutor | undefined; // Поле может быть необязательным, если пользователь не репетитор
  }
  