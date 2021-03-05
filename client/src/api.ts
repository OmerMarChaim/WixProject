import axios from 'axios';
import { APIRootPath } from '@fed-exam/config';
import { cloneElement } from 'react';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type ApiClient = {
    getTickets: () => Promise<Ticket[]>,
    cloneTicket: (ticket_id: String) => void
   // Promise<Ticket[]>;
}

export const createApiClient = (): ApiClient => {

    return {
        getTickets: () => {
            return axios.get(APIRootPath).then((res) => res.data);
        }

        , cloneTicket: (ticket_id) => {
console.log(ticket_id)
             axios.post(APIRootPath, ticket_id).then((res) =>
                console.log(res.data),(error)=> console.log(error));
            
        }

    }

}

