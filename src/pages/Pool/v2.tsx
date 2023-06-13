import { Trans } from '@lingui/macro'
import { Pair } from '@uniswap/v2-sdk'
import { darken } from 'polished'
import { L2_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import JSBI from 'jsbi'
import { useContext, useMemo } from 'react'
import { ChevronsRight } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'

import { ButtonOutlined, ButtonPrimary, ButtonSecondary, ButtonLight } from '../../components/Button'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { BIG_INT_ZERO } from '../../constants/misc'
import { useV2Pairs } from '../../hooks/useV2Pairs'
import { useActiveWeb3React } from '../../hooks/web3'
import { useStakingInfo } from '../../state/stake/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { ExternalLink, HideSmall, TYPE } from '../../theme'
import { useWalletModalToggle } from 'state/application/hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 950px;
  margin-top: 6rem;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, black 0%, #000000 100%);
  overflow: hidden;
  padding: 1rem;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  border:none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.primary6};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary6)};
    background-color: ${({ theme }) => darken(0.05, theme.primary6)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary6)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary6)};
    background-color: ${({ theme }) => darken(0.1, theme.primary6)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.primary1 : theme.bg2) : theme.bg2};
    color: ${({ altDisabledStyle, disabled, theme }) =>
      altDisabledStyle ? (disabled ? theme.white : theme.text2) : theme.text2};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  border-radius:5px;
  color: ${({ theme }) => theme.primary6};
  border: 1px solid ${({ theme }) => theme.primary6};
  &:hover {
    border-color: ${({ theme }) => darken(0.05, theme.primary6)};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Layer2Prompt = styled(EmptyProposals)`
  margin-top: 16px;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
    JSBI.greaterThan(pool.stakedAmount.quotient, BIG_INT_ZERO)
  )
  const stakingPairs = useV2Pairs(stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter((v2Pair) => {
    return (
      stakingPairs
        ?.map((stakingPair) => stakingPair[1])
        .filter((stakingPair) => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  const ON_L2 = chainId && L2_CHAIN_IDS.includes(chainId)

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={500} fontFamily='Inter' fontStyle={'normal'} fontSize='30px' lineHeight='36px'>
                  <Trans>Liquidity provider rewards</Trans>
                </TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize='24px' fontFamily='Inter' fontStyle={'normal'} lineHeight='36px' fontWeight={400}>
                  <Trans>
                    Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are
                    added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
                  </Trans>
                </TYPE.white>
              </RowBetween>
              {/* <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                target="_blank"
                href="https://uniswap.org/docs/v2/core-concepts/pools/"
              >
                <TYPE.white fontSize={14}>
                  <Trans>Read more about providing liquidity</Trans>
                </TYPE.white>
              </ExternalLink> */}
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>

        {ON_L2 && chainId != SupportedChainId.BASE_GOERLI ? (
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="md" style={{ width: '100%' }}>
              <Layer2Prompt>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Trans>V2 is not available on Layer 2. Switch to Layer 1 Ethereum.</Trans>
                </TYPE.body>
              </Layer2Prompt>
            </AutoColumn>
          </AutoColumn>
        ) : (
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="md" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                <HideSmall>
                  <TYPE.mediumHeader fontFamily='Inter' fontSize="30px" fontWeight="500" fontStyle='normal' style={{ marginTop: '0.5rem', marginLeft:'3rem' , justifySelf: 'flex-start' }}>
                    <Trans>Your liquidity</Trans>
                  </TYPE.mediumHeader>
                </HideSmall>
                <ButtonRow>
                  <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/add/ETH">
                    <Trans>Create a pair</Trans>
                  </ResponsiveButtonSecondary>
                  <ResponsiveButtonPrimary id="find-pool-button" as={Link} to="/pool/find" padding="6px 8px">
                    <Text fontWeight={500} fontSize={16}>
                      <Trans>Import Pool</Trans>
                    </Text>
                  </ResponsiveButtonPrimary>
                  <ResponsiveButtonPrimary id="join-pool-button" as={Link} to="/add/ETH" padding="6px 8px">
                    <Text fontWeight={500} fontSize={16}>
                      <Trans>Add Liquidity</Trans>
                    </Text>
                  </ResponsiveButtonPrimary>
                </ButtonRow>
              </TitleRow>

              {!account ? (
                <Card maxWidth="590px" padding='0 1rem' margin="2vw auto">
                  <ButtonLight textAlign="center" fontSize='1rem' onClick={toggleWalletModal}>
                    <Trans>Connect to a wallet to view your liquidity.</Trans>
                  </ButtonLight>
                </Card>
              ) : v2IsLoading ? (
                <EmptyProposals>
                  <TYPE.body color={theme.text3} textAlign="center">
                    <Dots>
                      <Trans>Loading</Trans>
                    </Dots>
                  </TYPE.body>
                </EmptyProposals>
              ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                <>
                  {/* <ButtonSecondary>
                    <RowBetween>
                      <Trans>
                        <ExternalLink href={'https://v2.info.uniswap.org/account/' + account}>
                          Account analytics and accrued fees
                        </ExternalLink>
                        <span> ↗ </span>
                      </Trans>
                    </RowBetween>
                  </ButtonSecondary> */}
                  {v2PairsWithoutStakedAmount.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                  {stakingPairs.map(
                    (stakingPair, i) =>
                      stakingPair[1] && ( // skip pairs that arent loaded
                        <FullPositionCard
                          key={stakingInfosWithBalance[i].stakingRewardAddress}
                          pair={stakingPair[1]}
                          stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                        />
                      )
                  )}
                  {/* <RowFixed justify="center" style={{ width: '100%' }}>
                    <ButtonOutlined
                      as={Link}
                      to="/migrate/v2"
                      id="import-pool-link"
                      style={{
                        padding: '8px 16px',
                        margin: '0 4px',
                        borderRadius: '12px',
                        width: 'fit-content',
                        fontSize: '14px',
                      }}
                    >
                      <ChevronsRight size={16} style={{ marginRight: '8px' }} />
                      <Trans>Migrate Liquidity to V3</Trans>
                    </ButtonOutlined>
                  </RowFixed> */}
                </>
              ) : (
                <EmptyProposals>
                  <TYPE.body color={theme.text3} textAlign="center">
                    <Trans>No liquidity found.</Trans>
                  </TYPE.body>
                </EmptyProposals>
              )}
            </AutoColumn>
          </AutoColumn>
        )}
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
