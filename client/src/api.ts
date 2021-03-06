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
let i = 1;
export type ApiClient = {
    getTickets: () => Promise<Ticket[]>,
    getNewPage: (numberOfPage: number) =>Promise<Ticket[]>,
    cloneTicket: (ticket_id: String) =>  Promise<Ticket[]>; //real one
   
}

export const createApiClient = (): ApiClient => {

    return {
        getTickets: () => {
            return axios.get(APIRootPath).then((res) => res.data);
        }
        , getNewPage: (numberOfPage) => {
            let newUrl = APIRootPath.concat('?page=' + i); // a new url to effect the page property
            i++;//ask for the next page
         
            return axios.get(newUrl,).then((res) => res.data);
        }

        , cloneTicket: (ticket_id) => {
            //post request with the id we want to clone

            return axios.post(APIRootPath, { ticket_id }).then((res) => res.data);

        }

    }

}

