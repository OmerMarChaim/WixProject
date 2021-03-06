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
let newUrl = APIRootPath.concat('?page=' + i); // a new url to effect the page property
export type ApiClient = {
    getTickets: () => Promise<Ticket[]>,
    getNewPage: (numberOfPage: number) => Promise<Ticket[]>,
    cloneTicket: (ticket_id : String ,ticket_title :String ,ticket_content :String 
        ,ticket_userEmail :String ,ticket_labels :String[] |undefined  ) =>  Promise<Ticket[]>;         
    //get property of ticket i want to save retuen a new tickets array with the clone ticket

}


export const createApiClient = (): ApiClient => {

    return {
        getTickets: () => {
            return axios.get(APIRootPath).then((res) => res.data);
        }
        , getNewPage: (numberOfPage) => {
            i++;//ask for the next page
          
        

            return axios.get(newUrl,).then((res) => res.data);
        }

        , cloneTicket: (ticket_id,ticket_title,ticket_content,ticket_userEmail,ticket_labels) => {
            //post request with the id we want to clone

            return axios.post(APIRootPath, {ticket_id,ticket_title,ticket_content,ticket_userEmail,ticket_labels })
            .then((res) => res.data);

        }

    }

}

