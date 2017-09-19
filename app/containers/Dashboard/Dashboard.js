import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DashboardSide from 'components/DashboardSide/DashboardSide';
import DashboardCollection from 'components/DashboardCollection/DashboardCollection';
import DashboardCollectionEdit from 'components/DashboardCollectionEdit/DashboardCollectionEdit';
import DashboardSite from 'components/DashboardSite/DashboardSite';
import { getCollectionData } from 'actions/collection';

require('./dashboard.scss');

const propTypes = {
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	collectionData: PropTypes.object.isRequired,
};

class Dashboard extends Component {
	componentWillMount() {
		this.dispatchGetCollectionData(this.props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.slug !== this.props.match.params.slug) {
			this.dispatchGetCollectionData(nextProps);
		}
	}

	dispatchGetCollectionData(props) {
		// Currently, this has to wait until appData has been fetched and loaded before
		// even sending off the request. If we find this is slow, we can try sending
		// the slug (available from url immediately) to the API, and use the origin
		// to do a Community query to identify which communityId we need to restrict
		// by. This is all because collection slugs are not unique.
		if (props.appData.data) {
			const collectionId = props.appData.data.collections.reduce((prev, curr)=> {
				if (curr.slug === '' && props.match.params.slug === undefined) { return curr.id; }
				if (curr.slug === props.match.params.slug) { return curr.id; }
				return prev;
			}, undefined);
			if (collectionId) {
				this.props.dispatch(getCollectionData(collectionId));
			}
		}
	}

	render() {
		const appData = this.props.appData.data || {};
		const collectionData = this.props.collectionData.data || {};
		const queryObject = queryString.parse(this.props.location.search);
		// const collectionData = {
		// 	title: 'Sensor Hardware',
		// 	slug: 'sensors',
		// 	description: 'An open collection dedicated to the free discussion of new topics relating to elephants and whales that create hardware.',
		// 	isPrivate: true,
		// 	isOpenSubmissions: true,
		// 	isPage: false,
		// 	pubs: [
		// 		{
		// 			id: 0,
		// 			title: 'Open Schematics',
		// 			slug: 'open-schematics',
		// 			lastModified: String(new Date()),
		// 			status: 'published',
		// 			numCollaborators: 12,
		// 			numSuggestions: 8,
		// 			numDiscussions: 4,
		// 		},
		// 		{
		// 			id: 1,
		// 			title: 'Regulatory Endeavors of Mammals',
		// 			slug: 'regulatory',
		// 			lastModified: String(new Date()),
		// 			status: 'unpublished',
		// 			numCollaborators: 7,
		// 			numSuggestions: 0,
		// 			numDiscussions: 13,
		// 		},
		// 		{
		// 			id: 2,
		// 			title: 'A Lesson in Pedagogy',
		// 			slug: 'pedagogy',
		// 			lastModified: String(new Date()),
		// 			status: 'submitted',
		// 			numCollaborators: 8,
		// 			numSuggestions: 24,
		// 			numDiscussions: 1,
		// 		},
		// 	],
		// };
		const pages = appData.collections.filter((item)=> {
			return item.isPage;
		});
		const collections = appData.collections.filter((item)=> {
			return !item.isPage;
		});

		const activeSlug = this.props.match.params.slug || '';
		const activeMode = this.props.match.params.mode || '';
		const activeItem = appData.collections.reduce((prev, curr)=> {
			if (activeSlug === curr.slug) { return curr; }
			return prev;
		}, {});

		// Don't let people name pages with slug team/activity/site.
		if (activeSlug === 'activity') { activeItem.title = 'Activity'; }
		if (activeSlug === 'team') { activeItem.title = 'Team'; }
		if (activeSlug === 'site') { activeItem.title = 'Site'; }

		return (
			<div className={'dashboard'}>

				<Helmet>
					<title>{activeItem.title} · Dashboard</title>
				</Helmet>

				<div className={'container'}>
					<div className={'row'}>
						<div className={'col-12'}>

							<div className={'side-panel'}>
								<DashboardSide pages={pages} collections={collections} activeSlug={activeSlug} />
							</div>

							<div className={'content-panel'}>
								{(() => {
									switch (activeSlug) {
									case 'activity':
										// Return activity component
										return (
											<div>
												<h1 className={'content-title'}>{activeItem.title}</h1>
												<div>activity</div>
											</div>
										);
									case 'team':
										// Return team component
										return (
											<div>
												<h1 className={'content-title'}>{activeItem.title}</h1>
												<div>team</div>
											</div>
										);
									case 'site':
										return <DashboardSite appData={appData} />;
									default:
										if (activeMode === 'edit') {
											return <DashboardCollectionEdit collectionData={collectionData} />;
										}
										return <DashboardCollection collectionData={collectionData} sortMode={queryObject.sort} isSortReverse={queryObject.direction === 'reverse'} />;
									}
								})()}
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = propTypes;
export default withRouter(connect(state => ({ 
	appData: state.app,
	collectionData: state.collection,
}))(Dashboard));