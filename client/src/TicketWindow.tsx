import React, { useState, useEffect } from 'react';
import { Component, MouseEvent } from 'react';

import { createApiClient, Ticket } from './api';

export type TicketState = {

    show: boolean; 		//state of hide:
}
export type TicketProps = {

    ticket: Ticket,
}



export class TicketWindow extends React.PureComponent<TicketProps, TicketState> {

    state: TicketState = {
        show: true,
    };
    render() {
        return (
         <div>
   <h5 className='title'>{this.props.ticket.title}</h5>
                <div className='content'> {this.props.ticket.content}</div>

                {/*  <div className='content'> { splitLabels}</div>*/}
                <footer>
                    <div className='meta-data'>By {this.props.ticket.userEmail} | {new Date(this.props.ticket.creationTime).toLocaleString()}</div>
                </footer>
         </div>
             

        )
    }
}
