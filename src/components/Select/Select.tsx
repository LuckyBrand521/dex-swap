import React, { useState, useRef, useEffect, useContext } from 'react'
import styled, { css, ThemeContext } from 'styled-components'
import { ArrowDropDownIcon, Text } from '@pancakeswap/uikit'

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  border: 1px solid ${({ theme }) => theme.secondary1};
  border-radius: 16px;
  background: ${({ theme }) => theme.bg1};
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.bg1};
  z-index: 1;
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 168px;
    `};
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width}px;
  position: relative;
  background: ${({ theme }) => theme.bg1};
  border-radius: 16px;
  height: 40px;
  min-width: 136px;
  user-select: none;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    min-width: 168px;
  `};

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid ${({ theme }) => theme.secondary1};
        border-radius: 16px 16px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid ${({ theme }) => theme.secondary1};
        border-top-width: 0;
        border-radius: 0 0 16px 16px;
        box-shadow: ${({ theme }) => theme.shadow1};
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: 1;
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.secondary1};
  }
`

export interface SelectProps {
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
}

export interface OptionProps {
  label: string
  value: any
}

const Select = ({ options, onChange }: SelectProps) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const theme = useContext(ThemeContext)

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)

    if (onChange) {
      onChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    // setContainerSize({
    //   width: dropdownRef.current.offsetWidth, // Consider border
    //   height: dropdownRef.current?.offsetHeight?? 0,
    // })

    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

    return (
        <DropDownContainer isOpen={isOpen} ref={containerRef} {...containerSize}>
        
            <DropDownHeader onClick={toggling}>
                <Text>{options[selectedOptionIndex].label}</Text>
            </DropDownHeader>
            <ArrowDropDownIcon color={theme.primary1} onClick={toggling} />
            <DropDownListContainer>
                <DropDownList ref={dropdownRef}>
                {options.map((option, index) =>
                    index !== selectedOptionIndex ? (
                    <ListItem onClick={onOptionClicked(index)} key={option.label}>
                        <Text>{option.label}</Text>
                    </ListItem>
                    ) : null,
                )}
                </DropDownList>
            </DropDownListContainer>
        </DropDownContainer>
    )
}

export default Select