import { useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { debounce } from 'lodash'

import { DealType } from '@/graphql-schema'
import List from '@/src/components/fees/List'
import { LabeledCheckbox } from '@/src/components/form/LabeledCheckbox'
import { SafeSuspense, genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonCSS } from '@/src/components/pureStyledComponents/buttons/Button'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { DEBOUNCED_INPUT_TIME } from '@/src/constants/misc'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Search = styled(BaseSearch)`
  width: 560px;
  max-width: 100%;
`

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TabsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`

const ButtonOnCSS = css`
  background-color: ${({ theme }) => theme.buttonPrimary.backgroundColor};
  border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
  color: ${({ theme }) => theme.buttonPrimary.color};

  .fill {
    fill: ${({ theme }) => theme.buttonPrimary.borderColor};
  }
`
const TabButton = styled.div<{ active?: boolean }>`
  ${ButtonCSS}
  color: ${({ theme: { colors } }) => colors.textColor};
  padding: 0 10px;
  width: 110px;
  &:hover {
    ${ButtonOnCSS}
  }
  ${({ active }) => active && ButtonOnCSS}
`

enum Tab {
  Pools = 'pool',
  Deals = 'deal',
}

export const ListWithFilters: React.FC = () => {
  const searchRef = useRef<HTMLInputElement>(null)
  const [hideSmallFees, setHideSmallFees] = useState<boolean>(true)
  const [searchString, setSearchString] = useState<string>()
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Pools)

  const debouncedChangeHandler = useMemo(
    () => debounce(setSearchString, DEBOUNCED_INPUT_TIME),
    [setSearchString],
  )

  return (
    <>
      <HeaderWrapper>
        <Search
          onChange={(evt) => {
            debouncedChangeHandler(evt.target.value)
          }}
          placeholder={`Enter ${activeTab} name...`}
          ref={searchRef}
        />
        <RowWrapper>
          <TabsWrapper>
            <TabButton active={activeTab === Tab.Pools} onClick={() => setActiveTab(Tab.Pools)}>
              Pools
            </TabButton>
            <TabButton active={activeTab === Tab.Deals} onClick={() => setActiveTab(Tab.Deals)}>
              Deals
            </TabButton>
          </TabsWrapper>
          <LabeledCheckbox
            checked={hideSmallFees}
            label={`Hide small fee ${activeTab}s`}
            onClick={() => {
              setHideSmallFees((prev) => !prev)
            }}
          />
        </RowWrapper>
      </HeaderWrapper>
      <SafeSuspense>
        <List
          dealType={activeTab === Tab.Pools ? DealType.SponsorDeal : DealType.UpfrontDeal}
          hideSmallFees={hideSmallFees}
          nameQuery={searchString && searchString !== '' ? searchString : undefined}
        />
      </SafeSuspense>
    </>
  )
}

export default genericSuspense(ListWithFilters)
