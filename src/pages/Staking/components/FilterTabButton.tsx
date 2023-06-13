import React from 'react'
import styled from 'styled-components'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'

const FilterTabButton = () => {
  const { url } = useRouteMatch()
  const location = useLocation()

  let activeIndex
  switch (location.pathname) {
    case '/staking':
      activeIndex = 0
      break
    case '/staking/history':
      activeIndex = 1
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
            <ButtonMenuItem as={Link} to={`${url}`}>
                Live
            </ButtonMenuItem>
            <ButtonMenuItem id="finished-farms-button" as={Link} to={`${url}/history`}>
                Finished
            </ButtonMenuItem>
        </ButtonMenu>
    </Wrapper>
  )
}

export default FilterTabButton

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall `
    margin-left: 16px;
    `};
`
