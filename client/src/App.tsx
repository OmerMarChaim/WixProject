import React, { FormEventHandler, FormEvent, DetailedHTMLProps, FormHTMLAttributes, cloneElement, useState, useEffect } from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { setSyntheticLeadingComments } from 'typescript';
import { count } from 'console';
import { Component, MouseEvent } from 'react';
import { TicketWindow } from './TicketWindow';
import { KeyObject } from 'crypto';


export type AppState = {
	tickets?: Ticket[],
	search: string,
	idsToHide: string[],
	ticketAfterClone: Ticket[]; // add an array to store the new tickets
	showModal: boolean,
}
let PageCounter = 1;
const api = createApiClient();
let filteredTickets: Ticket[];
filteredTickets = [];

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		idsToHide: [],
		ticketAfterClone: [],
		showModal: false
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

		newIdsApart[0] = crypto.randomBytes(4).toString('hex');
		newIdsApart[1] = crypto.randomBytes(2).toString('hex');
		newIdsApart[2] = crypto.randomBytes(2).toString('hex');
		newIdsApart[3] = crypto.randomBytes(2).toString('hex');
		newIdsApart[4] = crypto.randomBytes(6).toString('hex');
		let newId = newIdsApart.join("-");

		return (newId);
	}

	handleCloneClick = async (event: MouseEvent, ticket: Ticket) => { // add handle click funcstion 

		let ticket_id = this.createNewCryptoId();
		let ticket_title = ticket.title;
		let ticket_content = ticket.content;
		let ticket_userEmail = ticket.userEmail;
		let ticket_labels = ticket.labels;
		let newTicketWithClone = await api.newTicket(ticket_id, ticket_title, ticket_content, ticket_userEmail, ticket_labels);
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

	handladdTicketB = (event: MouseEvent) => {
		this.setState({
			showModal: true
		})
	}

	handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let new_ticket_id = this.createNewCryptoId();
		let new_ticket_title = (event.currentTarget.elements[0] as HTMLInputElement).value;
		let new_ticket_content = (event.currentTarget.elements[1] as HTMLInputElement).value;
		let new_ticket_userEmail = (event.currentTarget.elements[2] as HTMLInputElement).value;
		let labelsAsSrting = (event.currentTarget.elements[3] as HTMLInputElement).value;
		let new_ticket_labels = labelsAsSrting.split(" "); //convert the String type to String[] as need
		let newTicketWithClone = await api.newTicket(new_ticket_id, new_ticket_title, new_ticket_content, new_ticket_userEmail, new_ticket_labels);
		//cheack if cloned fanc succeeded 
		if (newTicketWithClone === this.state.tickets) {
			alert("There is a problem with with adding the tickets right now ")
		}
		else {
			alert("Your new ticket submited! You can see it in the top of this page 🤩 ")
			this.setState({
				tickets: newTicketWithClone
			});
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

				{tickets ? <div className='results'>Showing {tickets.length} results </div> : null}
				{this.state.idsToHide.length > 0 ? <div className='results' id='hideResult'>({this.state.idsToHide.length} hidden ticket{this.state.idsToHide.length > 1 ? 's' : null} -
			<a onClick={this.handleLink}> restore</a>)</div> : null}
				<div>
				</div>
			</div>
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			<div className='showButtens'>
				<button className='showMoreButton' onClick={this.handleShowMoreClick} > Show More </button>
				<button className='showMoreButton' onClick={this.handleShowLessClick} > Show Less </button>
			</div>
			<footer className='foot'>

				<form className='ticket' onSubmit={(event) => this.handleFormSubmit(event)}>
					<h2>Add Your Dream Ticket</h2>
					<p>
						<label htmlFor="title">Title : </label>
						<input type="text" id="title" required
							placeholder="Your Title" />
					</p>
					<p>						<label htmlFor="content" > Content : </label>
						<input id="content" required placeholder="Write something.." />
						<p></p></p>
					<p>						<label htmlFor="email">Email : </label>
						<input type="email" id="email" required
							placeholder="name@example.com" />
					</p>
					<p>	<label htmlFor="labels">Label : </label>
						<input id="label" placeholder="This part is'nt a must" />
					</p>					<button className='sybmitButton' type="submit" > Submit </button>
				</form >
			</footer>
		</main >)
	}
}


export default App;