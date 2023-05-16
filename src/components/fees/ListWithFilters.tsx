import { useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { debounce } from 'lodash'

import HistoricalStakersDistributionList from '@/src/components/fees/HistoricalStakersDistributionList'
import ProtocolFeesList from '@/src/components/fees/ProtocolFeesList'
import { LabeledCheckbox } from '@/src/components/form/LabeledCheckbox'
import { SafeSuspense, genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLighter } from '@/src/components/pureStyledComponents/buttons/Button'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { DEBOUNCED_INPUT_TIME } from '@/src/constants/misc'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`

const Search = styled(BaseSearch)`
  width: 560px;
  max-width: 100%;
`

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`

const ActiveTabButtonCSS = css`
  &,
  &:hover {
    background-color: rgba(130, 128, 255, 0.08);
    border-color: ${({ theme: { colors } }) => colors.primary};
    color: ${({ theme: { colors } }) => colors.primary};
    cursor: default;
    pointer-events: none;
  }
`

const TabButton = styled(ButtonPrimaryLighter)<{ isActive?: boolean }>`
  height: 24px;
  padding: 0 10px;
  font-size: 0.7rem;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    font-size: 0.9rem;
    height: 36px;
    padding: 0 20px;
  }

  ${({ isActive }) => isActive && ActiveTabButtonCSS}
`

enum Tab {
  HistoricalStakersDistribution = 'Historical stakers distribution',
  ProtocolFees = 'Protocol fees',
}

export const ListWithFilters: React.FC = () => {
  const searchRef = useRef<HTMLInputElement>(null)
  const [hideSmallFees, setHideSmallFees] = useState<boolean>(true)
  const [searchString, setSearchString] = useState<string>()
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HistoricalStakersDistribution)

  const debouncedChangeHandler = useMemo(
    () => debounce(setSearchString, DEBOUNCED_INPUT_TIME),
    [setSearchString],
  )

  return (
    <>
      <HeaderWrapper>
        <TabsWrapper>
          <TabButton
            isActive={activeTab === Tab.HistoricalStakersDistribution}
            onClick={() => setActiveTab(Tab.HistoricalStakersDistribution)}
          >
            {Tab.HistoricalStakersDistribution}
          </TabButton>
          <TabButton
            isActive={activeTab === Tab.ProtocolFees}
            onClick={() => setActiveTab(Tab.ProtocolFees)}
          >
            {Tab.ProtocolFees}
          </TabButton>
        </TabsWrapper>
        {activeTab === Tab.ProtocolFees && (
          <RowWrapper>
            <Search
              onChange={(evt) => {
                debouncedChangeHandler(evt.target.value)
              }}
              placeholder={`Enter pool or deal name...`}
              ref={searchRef}
            />
            <LabeledCheckbox
              checked={hideSmallFees}
              label={`Hide small fee entries`}
              onClick={() => {
                setHideSmallFees((prev) => !prev)
              }}
            />
          </RowWrapper>
        )}
      </HeaderWrapper>
      {activeTab === Tab.HistoricalStakersDistribution && <HistoricalStakersDistributionList />}
      {activeTab === Tab.ProtocolFees && (
        <SafeSuspense>
          <ProtocolFeesList
            hideSmallFees={hideSmallFees}
            nameQuery={searchString && searchString !== '' ? searchString : undefined}
          />
        </SafeSuspense>
      )}
    </>
  )
}

export default genericSuspense(ListWithFilters)
