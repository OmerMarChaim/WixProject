import React, { useState, useEffect } from 'react';
import { Component, MouseEvent } from 'react';

import { createApiClient, Ticket } from './api';


export type TicketProps = {

    ticket: Ticket,
}



export class TicketWindow extends React.PureComponent<TicketProps, []> {


    render() {

        return (
            <div>
                <h5 className='title'>{this.props.ticket.title}</h5>
                <div className='content'> {this.props.ticket.content}</div>
                {/* add the labels display */}
                { this.props.ticket.labels ? this.props.ticket.labels.map((item, index) => <label className='labels' key={index}> {item} </label>) : null }
                    
            <footer>
                <div className='meta-data'>By {this.props.ticket.userEmail} | {new Date(this.props.ticket.creationTime).toLocaleString()}</div>
            </footer>
          
         </div >
             

        )
    }
}
