import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Cart from './Cart.js';
import Grid from '@material-ui/core/Grid';

class ItemList extends Component {
   
    constructor(){
        super();
        this.state={
            addedItem : []
        }
        
    }

test = (val)=>{
    this.state.addedItem.push(val);  
    //this.setState(this.state);
    //this.addItem();
}
addItem = ()=>{
    this.props.addItem.bind(this.state.addedItem);
}
sendData=(val)=>{    
    this.test(val);
    return (this.props.addItem.bind(this,this.state.addedItem));
}

   
    render() {     
        const items=this.props.items;
        const id = this.props.id;
        return (
            <div>
                {items.map((val,index) =>
                <ListItem key={id+index} >
                <Grid container spacing={1}>
                <Grid item xs={1}>
                   {
                          
                    val.item_type === "VEG" ?
                    <ListItemAvatar style={{ color: "#008000" }}>

                        <FiberManualRecord />

                    </ListItemAvatar>:
                     <ListItemAvatar style={{ color: "#b20505" }}>

                     <FiberManualRecord />

                    </ListItemAvatar>
                     
                   }
                   </Grid>
                   <Grid item xs={7}>
                    <ListItemText>
                        {val.item_name}
                        
                    </ListItemText>
                    </Grid>
                    <Grid item xs={1}> 
                    <ListItemText>
                         {val.price}
                    </ListItemText>
                    </Grid>
                    <Grid item xs={1}>
                    <ListItemSecondaryAction>
                        <IconButton key={id+index} edge="end" onClick={this.props.addItem.bind(this,val,id+index)}>
                            +
                        </IconButton>
                    </ListItemSecondaryAction>
                    </Grid>
                    </Grid>
                </ListItem>
                )}
            
            </div>
        )
    }
}
export default ItemList;