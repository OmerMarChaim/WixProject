import React, { useState, useEffect } from 'react';
import { Component, MouseEvent } from 'react';
import './App.scss';

import { createApiClient, Ticket } from './api';

export type TicketState = {
    seeMore: boolean
}
export type TicketProps = {

    ticket: Ticket,
}


export class TicketWindow extends React.PureComponent<TicketProps, TicketState> {

    state: TicketState = {
        seeMore: false

    }
    changeSeeMore = (event: MouseEvent) => {
        this.setState({
            seeMore: !(this.state.seeMore)
        });
    }

    render() {
        return (
            <div>
                <h5 className='title'>{this.props.ticket.title}</h5>
                {/*                 see more see less */}
                <div className='content'> {this.state.seeMore ? this.props.ticket.content : this.props.ticket.content.substring(0, 228)}</div>
                <a onClick={this.changeSeeMore} > {this.state.seeMore ? 'See Less' : 'See More'}</a>
                {/* add the labels display */}
                { this.props.ticket.labels ? this.props.ticket.labels.map((item, index) => <label className='labels' key={index}> {item} </label>) : null}
                <footer>
                    <div className='meta-data'>By {this.props.ticket.userEmail} | {new Date(this.props.ticket.creationTime).toLocaleString()}</div>
                </footer>

            </div >


        )
    }
}
