import {BigNumber} from '@0xproject/utils'

export const generateBid = ({order, baseToken, quoteToken}) => {
  const makerToken = order.makerTokenAddress === baseToken.address ? baseToken : quoteToken
  const takerToken = order.takerTokenAddress === baseToken.address ? baseToken : quoteToken

  const decimalFields = [
    'expirationUnixTimestampSec',
    'makerFee',
    'makerTokenAmount',
    'salt',
    'takerFee',
    'takerTokenAmount'
  ]

  decimalFields.forEach(key => {
    order = {
      ...order,
      [key]: new BigNumber(order[key])
    }
  })

  const makerAmount = order.makerTokenAmount.dividedBy(
    Math.pow(10, makerToken.decimals)
  )
  const takerAmount = order.takerTokenAmount.dividedBy(
    Math.pow(10, takerToken.decimals)
  )

  let price
  if (order.takerTokenAddress === baseToken.address) {
    price = takerAmount.dividedBy(makerAmount)
  } else {
    price = makerAmount.dividedBy(takerAmount)
  }

  const bid = {
    order,
    price,
    maker: order.maker,
    makerToken,
    takerToken,
    makerAmount,
    takerAmount
  }

  return bid
}

export const getEthBalance = address => {
  return new Promise((resolve, reject) => {
    window.web3js.eth.getBalance(address, (err, balance) => {
      if (err) {
        reject(err)
        return
      }

      const eth = balance / Math.pow(10, 18)

      resolve(eth)
    })
  })
}

export const getTokenBalance = (walletAddr, tokenAddr) => {
  return new Promise((resolve, reject) => {
    const methodHex = window.web3js.sha3('balanceOf(address)').substr(0, '0x'.length + 8)
    const params = walletAddr.substr(2).padStart(32 * 2, '0')
    const data = methodHex + params

    window.web3js.eth.call({
      to: tokenAddr,
      data
    }, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      const wei = window.web3js.toBigNumber(result).toString()
      const tokenBalance = parseFloat(window.web3js.fromWei(wei))

      resolve(tokenBalance)
    })
  })
}
