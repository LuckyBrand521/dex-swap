import React from 'react'
import styled from 'styled-components'
// import { useFarmUser } from 'state/farms/hooks'
import { Text } from '@pancakeswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Token } from 'constants/types'
import { Currency } from '@uniswap/sdk-core'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import BigNumber from 'bignumber.js'

export interface FarmProps {
  label: string
  pid: number
  token: Currency
  quoteToken: Currency
}

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    padding-left: 32px;
    `};
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 24px;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    width: 40px;
    `}
`

const Farm: React.FunctionComponent<FarmProps> = ({ token, quoteToken, label, pid }) => {
//   const { stakedBalance } = useFarmUser(pid)
    const stakedBalance = BigNumber(9.163);
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = () => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {'Farming'}
        </Text>
      )
    }

    return null
  }

  return (
    <Container>
      <TokenWrapper>
        <DoubleCurrencyLogo currency0={token} currency1={quoteToken} size={40} margin={true} />
      </TokenWrapper>
      <div>
        {handleRenderFarming()}
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Farm