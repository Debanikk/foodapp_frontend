import React, {Component} from  'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Divider from '@material-ui/core/Divider';
import SummaryCardTempData from '../../common/SummaryCardTempData';


const SummaryCard = function(props) {
    const summary = props.summary;
    const index = props.index;
    const classes = props.classes;
    let data = JSON.parse(localStorage.getItem("orders"));
    let total = JSON.parse(localStorage.getItem("OrderDataTotal"));
    let restaurant_Name = JSON.parse(localStorage.getItem("restaurant_Name"));
    return(
        <Card className="summaryCardMain">        
            <CardHeader className="addressCardHeader" title="Summary" >
                <Typography variant="h4">

                </Typography>
            </CardHeader>
            <div style={{marginLeft:"3%",fontSize:"120%", color:"black"}}>{restaurant_Name}</div>
                <CardContent>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center">                     
                            {SummaryCardTempData.map((item, index) => 
                                <Grid container item xs={12} spacing={1} key={index}>
                                    <Grid item xs={1}>
                                        {item.type === 'VEG' ?  <FiberManualRecord style={{ color: "#008000" }}/> : <FiberManualRecord style={{ color: "#b20505" }}/>}
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="body2" color="textSecondary">
                                            {item.name}
                                        </Typography>                            
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body2" color="textSecondary">
                                            {item.qty}
                                        </Typography>                          
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body2" color="textSecondary">
                                            {item.price}
                                        </Typography> 
                                    </Grid>
                                </Grid>                                                
                            )} 
                            <Grid container item xs={12}>
                                <Grid item xs={12}>                    
                                    <Divider variant="middle" className={classes.divider}/>
                                </Grid>                                           
                            </Grid>
                            
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={1}></Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="subtitle1" color="textPrimary">
                                        Net Amount
                                        </Typography>
                                    </Grid>
                                <Grid item xs={3}></Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="subtitle1" color="textPrimary">                                                       
                                            {total}
                                        </Typography>
                                    </Grid>
                            </Grid>
                        </Grid>                
                </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" className={classes.orderButton} onClick={props.placeOrderHandler}>
                    Place Order
                </Button>
            </CardActions>
        </Card>
    )
}

export default SummaryCard;