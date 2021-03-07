import React, { cloneElement, useState, useEffect } from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { setSyntheticLeadingComments } from 'typescript';
import { count } from 'console';

import { Component, MouseEvent } from 'react';
import { TicketWindow } from './TicketWindow';
import { KeyObject } from 'crypto';
import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { throws } from 'assert';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	idsToHide: string[],
	ticketAfterClone: Ticket[]; // add an array to store the new tickets
}
let PageCounter = 1;
const api = createApiClient();
let filteredTickets: Ticket[];
filteredTickets = [];

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

		//every id is Uniqe
		this.setState({
			idsToHide: this.state.idsToHide.concat((event.target as Element).id)
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
		let newTicketWithClone = await api.cloneTicket(ticket_id, ticket_title, ticket_content, ticket_userEmail, ticket_labels);
		//cheack if cloned fanc succeeded 
		if (newTicketWithClone === this.state.tickets) {
			alert("There is a problem with clone ")
		}
		else {
			alert("The ticket you have chosen has been Cloned 🥳 ")
			this.setState({
				tickets: newTicketWithClone
			});
		}
	}


	renderTickets = (tickets: Ticket[]) => {

		filteredTickets = tickets
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
		let moreTickets = await api.getNewPage(PageCounter);
		//check if there if the client ask for overFlow
		if (moreTickets.length != (this.state.tickets ? this.state.tickets.length : 0)) {
			this.setState({
				tickets: moreTickets // set the list to empty = restore the hide action	
			});
		}
		else {
			PageCounter = PageCounter - 1;
			alert('Unable to show more tickets  💁🏻‍♂️ ')

		}
	}


	handleShowLessClick = async (event: MouseEvent) => { // add handle click on link Restore funcstion 
		//check we dont ask for page less them zero
		if (PageCounter - 1 > 0) {
			PageCounter = PageCounter - 1;

			this.setState({
				tickets: await api.getNewPage(PageCounter) // set the list to empty = restore the hide action		
			});
		}
		else {
			alert('Unable to show less tickets  💁🏻‍♂️ ')
		}
	}



	render() {
		let { tickets } = this.state;
		tickets = this.state.tickets;
		return (<main>
			<div className='nevBar' >
				<h1>Tickets List</h1>

				<header>
					<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} />
				</header>
				<button className='showMoreButton' onClick={this.handleShowMoreClick} > Show More </button>

				{tickets ? <div className='results'>Showing {tickets.length} results </div> : null}
				{this.state.idsToHide.length > 0 ? <div className='results' id='hideResult'>({this.state.idsToHide.length} hidden ticket{this.state.idsToHide.length > 1 ? 's' : null} -
			<a onClick={this.handleLink}> restore</a>)</div> : null}
				<div>

				</div>
			</div>
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}



			<footer className='bottemOfThePage' id="bottemOfThePage ">
				<button className='showMoreButton' onClick={this.handleShowMoreClick} > Show More </button>
				<button className='showMoreButton' onClick={this.handleShowLessClick} > Show Less </button>
			</footer>
		</main>)
	}
}

export default App;