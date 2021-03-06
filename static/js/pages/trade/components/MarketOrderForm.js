import React from 'react'
import jss from 'react-jss'
import TextField from '@material-ui/core/TextField'
import SmartButton from 'material-ui-smart-button'
import OrderModeRadio from './OrderModeRadio'
import {makeMarketOrder} from 'modules/index'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const connector = connect(
  state => ({
    marketplaceToken: state.marketplaceToken,
    currentToken: state.currentToken
  }),
  dispatch => bindActionCreators({makeMarketOrder}, dispatch)
)

const decorate = jss({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 'none'
  },
  button: {
    marginTop: 30
  }
})

class MarketOrderForm extends React.Component {
  state = {
    mode: 'buy',
    amount: 1
  }

  handleModeChange = mode => {
    this.setState({
      mode
    })
  }

  handleAmountChange = e => {
    this.setState({
      amount: e.target.value
    })
  }

  handlePlaceOrder = async () => {
    const {mode, amount} = this.state

    try {
      await this.props.makeMarketOrder({
        type: mode,
        amount
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  render () {
    const {classes, marketplaceToken, currentToken} = this.props
    const {amount, mode} = this.state

    const symbol = mode === 'buy' ? marketplaceToken.symbol : currentToken.symbol

    return (
      <div className={classes.root}>
        <OrderModeRadio
          mode={mode}
          onChange={this.handleModeChange}
        />

        <TextField
          type='number'
          label={`Amount (${symbol})`}
          value={amount}
          onChange={this.handleAmountChange}
        />

        <SmartButton
          variant='raised'
          color='secondary'
          className={classes.button}
          onClick={this.handlePlaceOrder}
        >Place order</SmartButton>
      </div>
    )
  }
}

export default connector(decorate(MarketOrderForm))



// WEBPACK FOOTER //
// ./src/pages/trade/components/MarketOrderForm.js
