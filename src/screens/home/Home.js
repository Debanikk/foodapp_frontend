import React, { Component } from 'react';
import Header from '../../common/header/Header';
 import * as Common from '../../common/common';
 import { withStyles } from "@material-ui/core/styles";
 
import './Home.css';

 
const styles = {
    resCard: { width: "90%", cursor: "pointer" }
};


class Home extends Component {

//Logout action from drop down menu on profile icon
loginredirect = () => {
    sessionStorage.clear();
    this.props.history.push({
        pathname: "/"
    });
    window.location.reload();
}

// Get all restuarants data
getAllImageData = () => {
    const requestUrl = this.props.baseUrl + "restaurant";
    const that = this;
    Common.callAPI(
        requestUrl,
        null,
        null,
        'GET',
        null,
        responseText => {
            that.setState(
                {
                    imageData: JSON.parse(responseText).restaurants
                }
            );
        },
        () => { }
    );
};



// Restaurant search by name
searchRestaurantsByName = event => {
    const searchValue = event.target.value;
    const requestUrl = this.props.baseUrl + "restaurant/name/" + searchValue;
    const that = this;
    if (searchValue!== undefined || searchValue!==null) {
        Common.callAPI(
            requestUrl,
            null,
            null,
            'GET',
            null,
            responseText => {
                that.setState(
                    {
                        imageData: JSON.parse(responseText).restaurants
                    }
                );
            },
            () => { }
        );
    } else {
        this.getAllImageData();
    }
};




    render() {
        
        return (
            <div>
               <Header  logoutHandler={this.loginredirect} baseUrl={this.props.baseUrl} 
                        searchRestaurantsByName={this.searchRestaurantsByName} 
                        showSearch={true} history={this.props.history} />
                Home page
            </div>
        )
    }
}

export default withStyles(styles)(Home);