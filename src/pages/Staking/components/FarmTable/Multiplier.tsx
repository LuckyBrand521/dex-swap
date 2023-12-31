import React from 'react'
import styled from 'styled-components'
import { HelpIcon, Skeleton, useTooltip } from '@pancakeswap/uikit'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.text1};
  width: 36px;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaWidth.upToLarge `
    text-align: left;
    margin-right: 0;
    `};
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />
  const tooltipContent = (
    <>
      {'The multiplier represents the amount of SCC rewards each farm gets.'}
      <br />
      <br />
      {'For example, if a 1x farm was getting 1 SCC per block, a 40x farm would be getting 40 SCC per block.'}
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Multiplier