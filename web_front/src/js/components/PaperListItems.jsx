import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'
import IconClear from '@material-ui/icons/Clear'

import { withStyles } from '@material-ui/core/styles'
const styles = theme => ({
  paper: {
    //minWidth: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 1,
  },
  list: {
    //
  },
  icon: {
    'vertical-align': 'middle',
  },
})



class PaperListItems extends React.Component {

  constructor(args){
    super(args)
    
    this.state = {
      //searchText: this.props.listDataSelected ? this.props.listDataSelected : '',
      searchText: '',
    }
    
    this.handleInputSearchText    = this.handleInputSearchText.bind(this)
    this.handleClkSearchReset     = this.handleClkSearchReset.bind(this)

    this.handleClkListItemsGet    = this.handleClkListItemsGet.bind(this)
    this.handleClkItemSelected    = this.handleClkItemSelected.bind(this)
  }

 

  handleInputSearchText(event) {
    this.setState({ 'searchText': event.target.value })
  }
  handleClkSearchReset() {
    this.setState({ 'searchText': '' })
  }

  handleClkListItemsGet() {
    this.props.listGetAction(this.props.swgClient, this.props.token)
  }

  handleClkItemSelected(event) {
    // material-ui <ListItem> завернут в два DOM-элемента
    const valueFromElement = event.target.parentElement.parentElement.getAttribute('valueofelement')
    const labelFromElement = event.target.parentElement.parentElement.getAttribute('labelofelement')
    if (valueFromElement) {
      this.setState({ 'searchText': labelFromElement })
      this.props.itemSelectAction(this.props.swgClient, this.props.token, valueFromElement) 
    }
  }



  render() {
    console.log('PaperListItems render')

    const {
      classes,
      headerTxt,
      hideSearchElem,

      listData,
      listDataSelected,
      messageFromApi,
    } = this.props

    return (
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" onClick={this.handleClkListItemsGet}>
          {headerTxt}
        </Typography>
        <Typography variant="caption">
          {messageFromApi}
        </Typography>
        <Divider /><br/>

        { hideSearchElem
        ?
        <div />
        :
        <div>
        <Input
          placeholder="Найти..."
          value={this.state.searchText} onChange={this.handleInputSearchText}
        />
        <IconClear
          className={classes.icon}
          color='disabled'
          onClick={this.handleClkSearchReset}
        />
        </div>
        }

        <List className={classes.list}>
          {listData.map((row,i) => {
            let tmpVal = row.tt_number
            let tmpLabel = '['+row.company +'] ('+row.oper +') '+ row.desc.replace(/\n\r/g, '')
            let tmpSearch = this.state.searchText ? this.state.searchText : ''

            if ( tmpLabel && (tmpLabel.toLowerCase().indexOf(tmpSearch.toLowerCase())+1) ) return (
            <ListItem key={i} valueofelement={tmpVal} labelofelement={tmpLabel} selected={tmpVal === listDataSelected ? true : false} button dense onClick={this.handleClkItemSelected}>
              <ListItemText primary={tmpVal} secondary={tmpLabel} />
            </ListItem>
            )
          })}
        </List>
      </Paper>
    )
  }

}

export default withStyles(styles)(PaperListItems)