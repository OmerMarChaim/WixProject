import React, { useState, useEffect } from 'react';
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
	idsToHide: string[];
}


const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		idsToHide: []
	}


	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
		});
	}
	handleClick =(event: MouseEvent) => { // add handle click funcstion 
		event.preventDefault();
		var joined = this.state.idsToHide.concat((event.target as Element).className);
	this.setState({
		idsToHide: joined
	}); 
	}


	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase())&& !(this.state.idsToHide).includes(t.id));
		
		const splitLabels = tickets.map((tickets) => (<button>{tickets.labels}</button>));


		return (<ul className='tickets'>


			{filteredTickets.map((ticket) =>
				<li key={ticket.id} className='ticket'>
					
					<TicketWindow ticket={ticket} />
					<button className={ticket.id} id='button' onClick={this.handleClick}> {/* add a button need to edit */}
    hide
    </button>

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

	render() {
		const { tickets } = this.state;

		return (<main>
			<h1>Tickets List</h1>

			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} />
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results  there is {this.state.idsToHide.length} hide{this.state.idsToHide.length>1 ?'s': null}
			<a>restore </a></div> : null}

			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;