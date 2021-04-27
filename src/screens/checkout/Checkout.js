import React, {Component} from 'react';
import './Checkout.css';
import Header from '../../common/header/Header';
import CustomerAddress from './CustomerAddress';

import Grid from '@material-ui/core/Grid';
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


const styles = muiBaseTheme => ({
  root: {
    width: "100%"
  },
  button: {
    marginTop: muiBaseTheme.spacing(),
    marginRight: muiBaseTheme.spacing()
  },
  actionsContainer: {
    marginBottom: muiBaseTheme.spacing(2)
  },
  resetContainer: {
    padding: muiBaseTheme.spacing(3)
  },
  connector: {
    display: "none"
  },
  step: {
    marginBottom: muiBaseTheme.spacing(5)
  },
  iconContainer: {
    transform: "scale(2)",
    marginRight: muiBaseTheme.spacing(5)
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
      activeStep : 0,
      dataAddress:[],           
            selected:0,
            dataPayments:[],
            paymentMethod:"",
            dataStates:[], 
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
            selAddress : ""
    };
  }

  searchRestaurantsByName = event => {
    this.setState({searchValue: event.target.value});
  }

  tabChangeHandler = (event, value) => {
    this.setState({value})
  };

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
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                      className={this.props.root}
                      >
                        <Grid container spacing={10}>
                          {
                            this.state.dataAddress.map((val, idx) => ( 
                              <Grid item xs={4} key={val.id}>
                                <CustomerAddress address={val} key={val.id + "_" + idx} changeAddress={this.addressChangeHandler}/>                                 
                              </Grid>                                       
                          ))            
                          }
                      </Grid>
                    </Grid>
                    </TabContainer>
                },
                {this.state.value === 1 && 
                    <TabContainer>
                        <div className="login">                            
                            <FormControl required className={this.props.formControl}>
                                <InputLabel htmlFor="FltBldNo">Flat/Build No.</InputLabel>
                                <Input 
                                    id="FlatBldNo"
                                    type="text"
                                    onChange={this.flatBldNoChangeHandler}  
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
              onChange={this.handleChange}
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
          <Grid Container spacing={3}>
            <Grid item xs={12} md={8}>
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
            </Grid>
            <Grid item xs={12} md={4}>

            </Grid>
          </Grid>
      </div>
    )
  }
}


export default withStyles(styles)(Checkout);