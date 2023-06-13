import { useState, useContext } from "react"
import { Trans } from '@lingui/macro'
import JSBI from 'jsbi'
import styled, {ThemeContext} from 'styled-components/macro'
import { RowType } from "@pancakeswap/uikit"

import { OutlineCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import PoolCard from '../../components/earn/PoolCard'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import Loader from '../../components/Loader'
import { RowBetween } from '../../components/Row'
import { BIG_INT_ZERO } from '../../constants/misc'
import { useActiveWeb3React } from '../../hooks/web3'
import { useUserFarmsViewMode } from 'state/user/hooks'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { ExternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import ViewToggle from 'components/Toggle/ViewToggle'
import Toggle from 'components/Toggle'
import Select, {OptionProps} from "components/Select/Select"
import SearchInput from "components/SearchInput"
import { ViewMode } from 'state/user/actions'
import FilterTabButton from './components/FilterTabButton'
import { Filter } from 'react-feather'
import { Check, ChevronDown, ChevronUp } from 'react-feather'
import { DesktopColumnSchema } from "./components/types"

const PageWrapper = styled(AutoColumn)`
  max-width: 950px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 1080px;
  width: 100%;
  padding 1rem;
`

const FarmSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;
  flex-direction: row;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  `};
`
const ViewControls = styled.div`
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall `
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
    `};
`

const LabelWrapper = styled.div`
  {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    width: auto;
    padding: 0;
  `};
`
export default function Staking() {
    const { chainId } = useActiveWeb3React()
    
    // staking info for connected account
    const stakingInfos = useStakingInfo()
    const [viewMode, setViewMode] = useUserFarmsViewMode()
    const [isLive, setLive] = useState(true);
    const [sortOption, setSortOption] = useState('hot')
    const [query, setQuery] = useState('');
    const theme = useContext(ThemeContext)
    const toggleFilter = () => {
      setLive(!isLive);
    }
  
    const stakingInfosWithBalance = stakingInfos?.filter((s) => JSBI.greaterThan(s.stakedAmount.quotient, BIG_INT_ZERO))
  
    // toggle copy if rewards are inactive
    const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

    const handleSortOptionChange = (option: OptionProps): void => {
        setSortOption(option.value)
    }

    const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }
    return (
        <PageWrapper gap="lg" justify="center">
            <TopSection gap="md">
                <DataCard>
                    <CardBGImage />
                    <CardNoise />
                    <CardSection>
                        <AutoColumn gap="md">
                            <RowBetween>
                                <TYPE.white fontWeight={500} fontFamily='Inter' fontStyle={'normal'} fontSize='30px' lineHeight='36px'>
                                    <Trans>Farms</Trans>
                                </TYPE.white>
                            </RowBetween>
                            <RowBetween>
                                <TYPE.white fontSize='24px' fontFamily='Inter' fontStyle={'normal'} lineHeight='36px' fontWeight={400}>
                                    <Trans>
                                    Stake LP tokens to earn.
                                    </Trans>
                                </TYPE.white>
                            </RowBetween>{' '}
                        </AutoColumn>
                    </CardSection>
                    <CardBGImage />
                    <CardNoise />
                </DataCard>
            </TopSection>

            <FarmSection>
                <ControlContainer>
                    <ViewControls>
                        <ViewToggle viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
                            <div>
                                <Text fontSize={14} fontWeight={400}>
                                    <Trans>FILTER BY</Trans>
                                </Text>
                                <Toggle isActive={isLive} toggle={toggleFilter} checked={<Trans>Live</Trans>} unchecked={<Trans>Finished</Trans>}/>
                            </div>
                    </ViewControls>
                    <FilterContainer>
                        <LabelWrapper>
                            <Text fontSize={14} fontWeight={400}><Trans>SORT BY</Trans></Text>
                            <Select
                                options={[
                                {
                                    label: 'Hot',
                                    value: 'hot',
                                },
                                {
                                    label: 'APR',
                                    value: 'apr',
                                },
                                {
                                    label: 'Multiplier',
                                    value: 'multiplier',
                                },
                                {
                                    label: 'Earned',
                                    value: 'earned',
                                },
                                {
                                    label: 'Liquidity',
                                    value: 'liquidity',
                                },
                                ]}
                                onChange={handleSortOptionChange}
                            />
                        </LabelWrapper>
                        <LabelWrapper style={{ marginLeft: 16, marginRight: 16 }}>
                            <Text fontSize={14} fontWeight={400}><Trans>SEARCH</Trans></Text>
                            <SearchInput onChange={handleChangeQuery} placeholder="Search Farms" />
                        </LabelWrapper>
                    </FilterContainer>
                </ControlContainer>
            </FarmSection>
      </PageWrapper>
    )
  }
  