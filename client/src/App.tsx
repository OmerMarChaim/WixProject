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
		this.setState({
			idsToHide: joined
		});
	}
	handleLink = (event: MouseEvent) => { // add handle click on link Restore funcstion 
		this.setState({
			idsToHide: [] // set the list to empty = restore the hide action		
		});
	}

	handleCloneClick = (event: MouseEvent) => { // add handle click funcstion 
		var newTicketId = (event.target as Element).id;
		 var nt = api.cloneTicket(newTicketId); // the new array i need      //take it down for tedt in 2b
		console.log(nt);    //test it work													//take it down for tedt in 2b
		this.setState({
			//tickets: api.cloneTicket(newTicketId)
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
					<button className='cloneButton' id={ticket.id} onClick={this.handleCloneClick} > Clone </button>
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


	handleShowMoreClick = (event: MouseEvent) => { // add handle click on link Restore funcstion 
		PageCounter = PageCounter + 1;
		console.log(PageCounter);
		let nextPage = api.getNewPage(PageCounter)
		console.log(nextPage);
		this.setState({
			//	tickets.concat(nextPage) // set the list to empty = restore the hide action		
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