import {useState, useMemo} from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  margin-left: auto;
  padding: 11px 16px;
  border: 1px solid ${({ theme }) => theme.secondary1};
  border-radius: 16px;
  background: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    `};
`

const Container = styled.div<{ toggled: boolean }>``

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search' }) => {
  const [toggled, setToggled] = useState(false)
  const [searchText, setSearchText] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  return (
    <Container toggled={toggled}>
        <InputWrapper>
            <StyledInput
                value={searchText}
                onChange={onChange}
                placeholder={placeholder}
                onBlur={() => setToggled(false)}
            />
        </InputWrapper>
    </Container>
  )
}

export default SearchInput