import React, { cloneElement, useState, useEffect } from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { setSyntheticLeadingComments } from 'typescript';
import { count } from 'console';

import { Component, MouseEvent } from 'react';
import { TicketWindow } from './TicketWindow';
import { KeyObject } from 'crypto';
import { SSL_OP_NO_TLSv1_1 } from 'constants';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	idsToHide: string[],
	ticketAfterClone: Ticket[]; // add an array to store the new tickets
}
let PageCounter = 1;
const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		idsToHide: [],
		ticketAfterClone: []
	}


	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
		});
	}
	handleHideClick = (event: MouseEvent) => { // add handle click Hide button funcstion 
		event.preventDefault();
		var joined = this.state.idsToHide.concat((event.target as Element).id);
		//every id is Uniqe
		this.setState({
			idsToHide: joined
		});
	}
	handleLink = (event: MouseEvent) => { // add handle click on link Restore funcstion 
		this.setState({
			idsToHide: [] // set the list to empty = restore the hide action		
		});
	}
	createNewCryptoId = () => {  //set new id for the clone ticket
		//our id structure is <8>-<4>-<4>-<4>-<12>
		let crypto = require("crypto");
		let newIdsApart = [];
		let j = 0;
		/* 	for ( let i in [4, 2, 2, 2, 6]) {
				newIdsApart[j] = crypto.randomBytes(Number(i)).toString('hex');
			
			} */
		newIdsApart[0] = crypto.randomBytes(4).toString('hex');
		newIdsApart[1] = crypto.randomBytes(2).toString('hex');
		newIdsApart[2] = crypto.randomBytes(2).toString('hex');
		newIdsApart[3] = crypto.randomBytes(2).toString('hex');
		newIdsApart[4] = crypto.randomBytes(6).toString('hex');

		let newId = newIdsApart.join("-");

		return (newId);
	}

	handleCloneClick = async (event: MouseEvent, ticket: Ticket) => { // add handle click funcstion 

		//var nt =  // the new array i need   
		let ticket_id = this.createNewCryptoId();
		let ticket_title = ticket.title;
		let ticket_content = ticket.content;
		let ticket_userEmail = ticket.userEmail;
		let ticket_labels = ticket.labels;
		this.setState({
			tickets: await api.cloneTicket(ticket_id, ticket_title, ticket_content, ticket_userEmail, ticket_labels)
		});
	}


	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase())
				&& !(this.state.idsToHide).includes(t.id));   //dont show hide tickets;
		return (<ul className='tickets'>

			{filteredTickets.map((ticket) =>
				<li key={ticket.id} className='ticket'>
					<button className='hButton' id={ticket.id} onClick={this.handleHideClick}> Hide </button> {/* add a button need to edit */}
					<TicketWindow ticket={ticket} />
					<button className='cloneButton' id={ticket.id} onClick={(e) => this.handleCloneClick(e, ticket)} > Clone </button>

				</li>)}

		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {

		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}


	handleShowMoreClick = async (event: MouseEvent) => { // add handle click on link Restore funcstion 
		PageCounter = PageCounter + 1;
		console.log(PageCounter);
		let nextPage = api.getNewPage(PageCounter)
		console.log(nextPage);
		//this.state.tickets?.concat(nextPage);
		this.setState({
			tickets: await nextPage // set the list to empty = restore the hide action		
		});
	}



	render() {
		const { tickets } = this.state;

		return (<main>
			<h1>Tickets List</h1>

			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} />
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null}

			{this.state.idsToHide.length > 0 ? <div className='results'>(  {this.state.idsToHide.length} hidden ticket{this.state.idsToHide.length > 1 ? 's' : null}
			- <a onClick={this.handleLink}>restore </a>)</div> : null}



			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			<button className='showMoreButton' onClick={this.handleShowMoreClick} > show more </button>
		</main>)
	}
}

export default App;