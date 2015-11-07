import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {reset} from 'redux-form';
import {Login} from '../index';
import {connect} from 'react-redux';
import {toggleVisibility, restoreLogin} from '../../actions/login';
import {toggleMenu} from '../../actions/nav';
import {HeaderNav, HeaderMenu} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const App = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		navData: PropTypes.object,
		path: PropTypes.string,
		children: PropTypes.object.isRequired,
		pushState: PropTypes.func,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch) {
			// This fires every single time the route changes.
			// I think this is because App.jsx technically re-renders. 
			// We should set some variable like 'attemptedRestoreLogin'
			// it seemed to be working, but because of the css server/client mismatch,
			// I think we lose the server-side login. Once we fix the css issue, attempt to fix this.
			return dispatch(restoreLogin());
		}
	},

	toggleLogin: function() {
		this.props.dispatch(toggleVisibility());
		this.props.dispatch(reset('loginForm'));
		this.props.dispatch(reset('loginFormRegister'));
	},

	menuToggle: function() {
		this.props.dispatch(toggleMenu());
	},

	render: function() {
		let pathname = 'notlanding';
		if (this.props.path === '/') {
			pathname = 'landing';
		}
		let headerTextColor = globalStyles.headerText;
		let headerTextColorHover = globalStyles.headerHover;
		if (this.props.path === '/') {
			headerTextColor = globalStyles.headerBackground;
			headerTextColorHover = 'black';
		}

		return (
			<div style={[
				styles.body,
				this.props.loginData.get('isVisible') && styles.noScroll,
				this.props.navData.get('menuOpen') && styles.noScroll
			]}>
				<div className="header-bar" style={[styles.headerBar, styles[pathname].headerBar]}>
					
					<Link to={`/`}><div key="headerLogo" style={[styles.headerText, styles.headerLogo, styles[pathname].headerText]}>PubPub</div></Link>
					
					<div style={[styles.headerNavContainer]} >
						<div style={styles.headerMenu}>
							<HeaderMenu 
								loginData={this.props.loginData} 
								navData={this.props.navData}
								color={headerTextColor}
								hoverColor={headerTextColorHover}
								loginToggle={this.toggleLogin}
								menuToggle={this.menuToggle}/>
						</div>

						<div style={styles.headerNav}>
							<HeaderNav 
								loginData={this.props.loginData} 
								navData={this.props.navData}
								color={headerTextColor}
								hoverColor={headerTextColorHover}
								loginToggle={this.toggleLogin}/>
						</div>

						{/* 
						<LoginHeader loginData={this.props.loginData} clickFunction={this.toggleLogin} color={headerTextColor} hoverColor={headerTextColorHover}/>

						<div style={styles.separator}></div>
						<div key="headerNewPub" style={[styles.headerText, styles.rightBorder, styles[pathname].headerText]}>New Pub</div>
						*/ }
					</div>

				</div>

				<Login />

				<div className="content" style={styles.content}>
					{this.props.children}
				</div>
	
			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login, 
		navData: state.nav,
		path: state.router.location.pathname
	};
})( Radium(App) );


styles = {
	notlanding: {},
	landing: {
		headerText: {
			color: globalStyles.headerBackground,
			':hover': {
				color: 'black'
			},
		},
		headerBar: {
			backgroundColor: globalStyles.headerText,
		},
	},
	logo: {
		// height: 30,
	},
	body: {
		width: '100vw',
		overflow: 'hidden',
		height: 'auto',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			// overflow: 'scroll',
		},
	},
	noScroll: {
		height: '100vh'
	},
	headerBar: {
		
		width: '100%',
		height: globalStyles.headerHeight,
		backgroundColor: globalStyles.headerBackground,
		margin: 0,
		zIndex: 5,
		position: 'fixed',

		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			// backgroundColor: 'red',
			height: globalStyles.headerHeightMobile,
		},
	},

	headerText: {
		
		lineHeight: globalStyles.headerHeight,
		color: globalStyles.headerText,
		textDecoration: 'none',
		':hover': {
			color: globalStyles.headerHover
		},
		fontFamily: globalStyles.headerFont,

		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			lineHeight: globalStyles.headerHeightMobile,
			fontSize: '1.5em',
		},
		
	},

	headerLogo: {
		// margin: '0 calc(50% - 105px) 0 0',
		padding: '0px 15px',
		fontSize: '1em',
		float: 'left',
		width: '75px',
		// backgroundColor: 'red',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			fontSize: '1.5em',
			margin: '0',
			padding: '0px 20px 0px 10px',
		},
		
	},

	headerNavContainer: {
		margin: 0,
		fontSize: '0.9em',
		color: '#ddd',
		// backgroundColor: 'orange',
		float: 'left',
		// width: '50%',
		width: 'calc(100% - 105px)',
		textAlign: 'right',
		// '@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
		// 	width: 'calc(100% - 105px)',
		// },
	},
	headerNav: {
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
	}, 
	headerMenu: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'block',
		},
	},
	rightBorder: {
		padding: '0px 10px',
		float: 'right',
		cursor: 'pointer',
	},
	separator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'right',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 36px)',
			margin: '18px 0px',
		},
	},

	content: {
		width: '100%',
		position: 'relative',
		marginTop: globalStyles.headerHeight,
		height: 'auto',
		// backgroundColor: 'red',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			marginTop: globalStyles.headerHeightMobile,
			
		},
	},

};
