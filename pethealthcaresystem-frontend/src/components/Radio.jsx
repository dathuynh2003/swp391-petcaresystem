import { useRadio ,Box,HStack,useRadioGroup} from '@chakra-ui/react'
import React from 'react'
import PropTypes from 'prop-types'
function Radio(props) {
    const { getInputProps, getRadioProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getRadioProps()
  
    return (
      <Box as='label'>
        <input {...input} />
        <Box
          {...checkbox}
          cursor='pointer'
          borderWidth='1px'
          borderRadius='md'
          boxShadow='md'
          _checked={{
            bg: 'teal.600',
            color: 'white',
            borderColor: 'teal.600',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          px={5}
          py={3}
        >
          {props.children}
        </Box>
      </Box>
    )
  }
  


function RadioCard(props) {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'framework',
        defaultValue: 'react',
        onChange: props.onChange,
    })

    const group = getRootProps()

  return (
    <HStack {...group}>
    {props.options.map((value) => {
      const radio = getRadioProps({ value })
      return (
        <Radio key={value} {...radio}>
          {value}
        </Radio>
      )
    })}
  </HStack>

  )
}

    RadioCard.propTypes = {
        options: PropTypes.array,//khai báo props, gợi ý
        onChange: PropTypes.func
        
    }

export default RadioCard

