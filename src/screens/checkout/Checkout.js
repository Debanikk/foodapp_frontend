import React, {Component} from 'react';
import './Checkout.css';
import Header from '../../common/header/Header';
import CustomerAddress from './CustomerAddress';
import SummaryCard from './SummaryCard';

import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import {GridListTile} from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { FormControl, InputLabel, Input, Select, AppBar } from "@material-ui/core";
import { withStyles } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import * as Utils from '../../common/Utils';
import * as Constants from '../../common/Constants';




const styles = foodAppCheckoutBaseTheme => ({
  root: {
    width: "100%"
  },
  button: {
    marginTop: foodAppCheckoutBaseTheme.spacing(),
    marginRight: foodAppCheckoutBaseTheme.spacing()
  },
  actionsContainer: {
    marginBottom: foodAppCheckoutBaseTheme.spacing(2)
  },
  resetContainer: {
    padding: foodAppCheckoutBaseTheme.spacing(3)
  },
  connector: {
    display: "none"
  },
  step: {
    marginBottom: foodAppCheckoutBaseTheme.spacing(5)
  },
  iconContainer: {
    transform: "scale(2)",
    marginRight: foodAppCheckoutBaseTheme.spacing(5)
  },
  formControl:{
      width:"90%",
      minWidth:120
  },
  saveAddressButton:{
      display:"block",
      marginTop:30
  },
  summaryCard:{
    marginLeft:"-10px;"
  },
  divider:{
    marginTop:"10px",
    marginBottom:"10px",
    marginLeft:"auto"
  } 
});

const baseURL = "http://localhost:8080/api/";
//This needs to be replaced with sessionStorage
const access_token = "eyJraWQiOiJhMDBhZTJiNi03NmU0LTRhOTItYjU0Ny0yNjhhNzM4M2UwOGYiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJhYjU5OTNkMS04MmJjLTQxY2UtYjRkMS1jMmE1MGEyMTMwMGUiLCJpc3MiOiJodHRwczovL0Zvb2RPcmRlcmluZ0FwcC5pbyIsImV4cCI6MTYxOTkzMCwiaWF0IjoxNjE5OTAxfQ.B6xdGWQ-IGHKteUPKXI0Qe-16GWwffUuVkr5TeEj_OT95vALLcrPgw7A6aZN7MHr__lMMd-ZX51gOaUBqMQZhw"; //sessionStorage.getItem("access-token");
const req_header = {
  "Accept": "application/json;charset=UTF-8",
  "authorization": "Bearer " +  access_token,
  "Access-Control-Allow-Origin" : "*",
  "Content-Type": "application/json" 
}


function TabContainer(props) {
  return (
      <Typography component={'div'} variant={'body2'} style={{ padding: 8 * 3 }}>
          {props.children}
      </Typography>
  );
}

function getSteps() {
  return ["Delivery", "Payment"];
}

class Checkout extends Component{
  constructor(){
    super();
    this.state = {
      searchValue: "",
      value:0,
      activeStep : 0,
      paymentMethod:"",
      dataAddress:[], 
      dataPayments:[], 
      dataStates:[],         
      selected:0,
      flatBldNo : "",
      flatBldNoRequired : 'dispNone',
      locality:"",
      localityRequired : 'dispNone',
      city:"",
      cityRequired : 'dispNone',
      pincode:"",
      pincodeRequired : 'dispNone',
      saveAddressSuccess : false,
      saveAddressError : 'dispNone',
      saveAddressErrorMsg : '',
      checkOutAddressRequired : 'dispNone',
      selectedAddress : "",
      resDetails: null
    };
  }

  componentDidMount(){
    //this.getAddresses(baseURL, access_token);
    //this.getPaymentMethods();
    //States pending
    this.mounted = true;
  }

  componentWillMount(){
    try{
      this.setState({resDetails:JSON.parse(sessionStorage.getItem("restaurantDetails"))});
      this.getAddresses(baseURL, access_token);
      this.getPaymentMethods();
      this.getStates();
    } catch {
      this.mounted = false;
    }
  }

  getStates(){
    const url = baseURL + 'states'
    const that = this;
    
    //API call function invoked from Utils.js
    Utils.makeApiCall(
      url, 
      null,
      null,
      Constants.ApiRequestTypeEnum.GET,
      null,
      responseText => {
        that.setState({
          dataStates : JSON.parse(responseText).states
        })
      }
    )
    }

  placeOrderHandler = () => {      
    let dataItem = [];      
    if(this.state.selectedAddress === ""){
      this.setState({saveOrderResponse : "Please select Address"})        
      this.openMessageHandler();   
      return;                        
    }else if(this.state.paymentMethod === ""){
      this.setState({saveOrderResponse : "Please select payment method"})        
      this.openMessageHandler();                   
      return;
    }
    
    let orders = JSON.parse(localStorage.getItem("orders"));            
    let dataCheckout = JSON.stringify({                    
        "address_id": this.state.selectedAddress,
        "bill": localStorage.getItem("OrderDataTotal"),
        "coupon_id": "",
        "discount": 0,
        "item_quantities": 
          orders.map(item => (
            {
            "item_id":  item.id,
            "price" : item.price,
            "quantity" : item.qty
            }))
        ,
        "payment_id": this.state.paymentMethod,
        "restaurant_id": sessionStorage.getItem("selRestaurant")        
    })       
    let that = this;
    let xhrCheckout = new XMLHttpRequest();
    xhrCheckout.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {              
            let checkoutResponse = JSON.parse(this.response);              
              that.setState({saveOrderResponse : checkoutResponse.message});
              that.openMessageHandler();                              
        }
    })

    xhrCheckout.open("POST", this.props.baseUrl + "order");
    xhrCheckout.setRequestHeader("Authorization", "Bearer " + access_token);
    xhrCheckout.setRequestHeader("Content-Type", "application/json");
    xhrCheckout.setRequestHeader("Cache-Control", "no-cache");
    xhrCheckout.setRequestHeader("Access-Control-Allow-Origin", "*");  
    xhrCheckout.send(dataCheckout);
  }

  getAddresses(baseURL, access_token){      
    let data = null   
    let xhrAddresses = new XMLHttpRequest();
    let that = this;
    xhrAddresses.addEventListener("readystatechange", function () {  
        if (this.readyState === 4) {                                      
              let address = JSON.parse(xhrAddresses.response); 
              that.setState({dataAddress: address["addresses"]});
        }
    })
    xhrAddresses.open("GET", baseURL + "address/customer");
    xhrAddresses.setRequestHeader("Authorization", "Bearer " + access_token); 
    xhrAddresses.setRequestHeader("Content-Type", "application/json");
    xhrAddresses.setRequestHeader("Cache-Control", "no-cache");
    xhrAddresses.setRequestHeader("Access-Control-Allow-Origin", "*");  
    xhrAddresses.send(data);
  }

  getPaymentMethods(){
    const url = baseURL + 'payment'
    const that = this;
  
    Utils.makeApiCall(
      url, 
      null,
      null,
      Constants.ApiRequestTypeEnum.GET,
      req_header,
      responseText => {
        that.setState({
          dataPayments : JSON.parse(responseText).paymentMethods
        })
        }
      )
  }

  openMessageHandler = () => {
    this.setState({snackBarOpen:true})  
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({snackBarOpen:false})
  }

  handlePaymentMethodChange = (event) => {
    this.setState({paymentMethod:event.target.value})
    sessionStorage.setItem("paymentMethod", event.target.value);
  }

  searchRestaurantsByName = event => {
    this.setState({searchValue: event.target.value});
  }

  tabChangeHandler = (event, value) => {
    this.setState({value})
  };

  flatBuildingNoChangeHandler = (e) => {
    this.setState({ flatBldNo: e.target.value })    
  }
  localityChangeHandler = (e) => {
    this.setState({locality : e.target.value })
  }
  cityChangeHandler = (e) => { 
    this.setState({city : e.target.value })
  }
  pinCodeChangeHandler = (e) => {
    this.setState({pincode : e.target.value })
  }
  addressClickHandler = () =>    
  {
    this.state.flatBldNo === "" ? this.setState({ flatBldNoRequired: "dispBlock" }) : this.setState({ flatBldNoRequired: "dispNone" });      
    this.state.locality === "" ? this.setState({ localityRequired: "dispBlock" }) : this.setState({ localityRequired: "dispNone"});
    this.state.city === "" ? this.setState({ cityRequired: "dispBlock" }) : this.setState({ cityRequired: "dispNone" });
    this.state.pincode === "" ? this.setState({ pincodeRequired: "dispBlock" }) : this.setState({ pincodeRequired: "dispNone" });
    this.state.selected === 0 ? this.setState({ stateRequired: "dispBlock" }) : this.setState({ stateRequired: "dispNone" });
    
    if(this.state.flatBldNo === "" || this.state.locality === "" || this.state.city === "" || this.state.pincode === ""  || this.state.selected === ""){return}
    
    let dataAddress = JSON.stringify({            
        "city": this.state.city,
        "flat_building_name": this.state.flatBldNo,
        "locality": this.state.locality,
        "pincode": this.state.pincode,
        "state_uuid": this.state.selected       
    })
    let that = this;
    let xhrSaveAddress = new XMLHttpRequest();
    xhrSaveAddress.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {              
            let saveAddressResponse = JSON.parse(this.response);
            if(saveAddressResponse.code === 'SAR-002' || saveAddressResponse.code === 'SAR-002'){
              that.setState({saveAddressError : "dispBlock"});
              that.setState({"saveAddressErrorMsg":saveAddressResponse.message});            
            }else{
              that.setState({ saveAddressSuccess: true });                
            }
        }
    })

    xhrSaveAddress.open("POST", this.props.baseUrl + "address");
    xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
    xhrSaveAddress.setRequestHeader("Cache-Control", "no-cache");
    xhrSaveAddress.setRequestHeader("Access-Control-Allow-Origin", "*");  
    xhrSaveAddress.send(dataAddress);  
  }
  addressChangeHandler = () => {
      this.setState({selectedAddress: sessionStorage.getItem("selected")});
  }



  getStepContent= (step) => {       
      
    switch (step) {
      case 0:
        return (
            <div>
                <AppBar position={"static"}>
                <Tabs className={this.props.tabs} value={this.state.value} onChange={this.tabChangeHandler}>
                    <Tab label="Existing Address" />
                    <Tab label="New Address" />
                </Tabs>
                </AppBar>
                {this.state.value === 0 && 
                    <TabContainer>
                      {this.state.dataAddress.length===0?
                        <Grid
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                          className={this.props.root}
                        >
                          <Grid container spacing={5}>
                            <GridList cellHeight={"auto"} className="gridListMain">
                              <GridListTile style={{width:"100%",marginTop:"4%"}} >
                                  <span style={{fontSize:"20px"}}>There are no saved addresses! You can save an address using the "New Address" tab or using your "Profile" Menu</span>
                              </GridListTile>
                            </GridList>  
                          </Grid>
                        </Grid>
                        
                        :
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                      className={this.props.root}
                      >
                        <Grid container spacing={10}>
                          <GridList cellHeight={"auto"} className="gridListMain">
                            {
                              this.state.dataAddress.map((val, idx) => ( 
                                <Grid item xs={4} key={val.id}>
                                  <CustomerAddress address={val} key={val.id + "_" + idx} changeAddress={this.addressChangeHandler}/>                                 
                                </Grid>                                       
                            ))            
                            }
                          </GridList>
                      </Grid>
                    </Grid>}
                    </TabContainer>
                },
                {this.state.value === 1 && 
                    <TabContainer>
                        <div className="newAddress">                            
                            <FormControl required className={this.props.formControl}>
                                <InputLabel htmlFor="FltBldNo">Flat/Build No.</InputLabel>
                                <Input 
                                    id="FlatBldNo"
                                    type="text"
                                    onChange={this.flatBuildingNoChangeHandler}  
                                />
                                <FormHelperText className={this.state.flatBldNoRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br/><br />
                            <FormControl required className={this.props.formControl}>
                                <InputLabel htmlFor="Locality">Locality</InputLabel>
                                <Input 
                                    id="Locality"
                                    type="text"
                                    onChange={this.localityChangeHandler}  
                                />
                                <FormHelperText className={this.state.localityRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl required className={this.props.formControl}>
                                <InputLabel htmlFor="city">City</InputLabel>
                                <Input 
                                    id="City"
                                    type="text"
                                    onChange={this.cityChangeHandler}  
                                />
                                <FormHelperText className={this.state.cityRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br/><br/>                                
                            <FormControl required className={this.props.formControl}>
                                <InputLabel htmlFor="State" shrink>State</InputLabel>
                                <Select 
                                    value={this.state.selected}
                                    onChange={this.onStateChange}                                        
                                    input={<Input name="state" id="state" />} 
                                    style={{width:'200px'}} 
                                    placeholder="Select State"                                      
                                    >
                                        <MenuItem selected value="0">
                                            Select State
                                        </MenuItem>                                   
                                        {this.state.dataStates.map((state,i) => (                                                
                                        <MenuItem key={"state_" + state.id + "_" + i} value={state.id}>
                                            {state.state_name}
                                        </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText className={this.state.stateRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl required className={this.props.formControl}>
                                <InputLabel htmlFor="Pincode">Pin Code</InputLabel>
                                <Input 
                                    id="Pincode"
                                    type="text"
                                    onChange={this.pinCodeChangeHandler}  
                                />
                                <FormHelperText className={this.state.pincodeRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl className={this.props.formControl}>
                              <Typography variant="subtitle1" color="error" className={this.state.saveAddressError} align="left">{this.state.saveAddressErrorMsg}</Typography>                                                              
                            </FormControl>}<br /><br />
                            <Button variant="contained" fullWidth={true} color="primary" onClick={this.addressClickHandler} className={this.props.formControl}>
                              SAVE ADDRESS
                            </Button>                                                        
                        </div>
                    </TabContainer>
                }
            </div>
          );
      case 1:
        return (
          <div>
           <FormControl component="fieldset" className={this.props.formControl}>
           <FormLabel component="legend">Select Mode of Payment</FormLabel>
           <RadioGroup
              aria-label="Payment Method"
              name="payment"
              className={this.props.group}
              value={this.state.paymentMethod}
              onChange={this.handlePaymentMethodChange}
            >
          {this.state.dataPayments.map((val, index) => (                
            <FormControlLabel value={val.id} control={<Radio />} label={val.payment_name} key={index}/>                
          ))}
          </RadioGroup>
          </FormControl>
          </div>
        )
      default:
        return "Unknown step";
    }
}

  handleNext = () => {
    this.setState(state => ({
      activeStep: this.state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: this.state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  render(){
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    return(
      <div>
        <Header showSearch = {false} searchRestaurantsByName = {this.searchRestaurantsByName}/>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <div className={classes.root}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map(label => {
                      return (
                        <Step key={label} className={classes.step}>
                          <StepLabel classes={{iconContainer: classes.iconContainer}}>
                            <Typography component={'div'} variant={"h5"}>
                              {label}
                            </Typography>
                          </StepLabel>
                          <StepContent>
                            <Typography component={'div'}>{this.getStepContent(activeStep)}</Typography>
                            <div>
                                <div>
                                <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                                    Back
                                </Button>
                                <Button variant="contained" color="primary" onClick={this.handleNext} className={classes.button}>
                                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                                </Button>
                                </div>
                            </div>               
                          </StepContent>
                        </Step>
                      );
                    })}
                  </Stepper> 
                </div>
            </Grid>
            <Grid item xs={8} md={3}>
              <SummaryCard className={classes.summaryCard} placeOrderHandler = {this.placeOrderHandler}
                key="test"
                index="1"
                classes={classes} />
            </Grid>
          </Grid>
          <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={this.state.snackBarOpen}
                  autoHideDuration={6000}
                  onClose={this.handleClose}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<span id="message-id">{this.state.saveOrderResponse}</span>}
                  action={[              
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.handleClose}
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}>

                </Snackbar>
      </div>
    )
  }
}


export default withStyles(styles)(Checkout);