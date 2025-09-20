import type { ButtonProps, GroupProps, InputProps, StackProps } from '@chakra-ui/react'
import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  mergeRefs,
  useControllableState
} from '@chakra-ui/react'
import { forwardRef, useRef } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'

export interface PasswordVisibilityProps {
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
}

export interface PasswordInputProps extends InputProps, PasswordVisibilityProps {
  rootProps?: GroupProps
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const {
      rootProps,
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> },
      ...rest
    } = props

    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange
    })

    const inputRef = useRef<HTMLInputElement>(null)

    return (
      <InputGroup
        endElement={
          <VisibilityTrigger
            disabled={rest.disabled}
            onPointerDown={e => {
              if (rest.disabled) return
              if (e.button !== 0) return
              e.preventDefault()
              setVisible(!visible)
            }}
          >
            {visible ? visibilityIcon.off : visibilityIcon.on}
          </VisibilityTrigger>
        }
        {...rootProps}
      >
        <Input {...rest} ref={mergeRefs(ref, inputRef)} type={visible ? 'text' : 'password'} />
      </InputGroup>
    )
  }
)

const VisibilityTrigger = forwardRef<HTMLButtonElement, ButtonProps>(function VisibilityTrigger(
  props,
  ref
) {
  return (
    <IconButton
      tabIndex={-1}
      ref={ref}
      me="-2"
      aspectRatio="square"
      size="sm"
      variant="ghost"
      height="calc(100% - {spacing.2})"
      aria-label="Toggle password visibility"
      {...props}
    />
  )
})

interface PasswordStrengthMeterProps extends StackProps {
  max?: number
  value: number
}

export const PasswordStrengthMeter = forwardRef<HTMLDivElement, PasswordStrengthMeterProps>(
  function PasswordStrengthMeter(props, ref) {
    const { max = 4, value, ...rest } = props

    const percent = (value / max) * 100
    const { colorPalette } = getColorPalette(percent)

    return (
      <HStack width="full" ref={ref} {...rest}>
        {Array.from({ length: max }).map((_, index) => (
          <Box
            key={index}
            height="1"
            flex="1"
            rounded="sm"
            data-selected={index < value ? '' : undefined}
            layerStyle="fill.subtle"
            colorPalette="gray"
            _selected={{
              colorPalette,
              layerStyle: 'fill.solid'
            }}
          />
        ))}
      </HStack>
    )
  }
)

function getColorPalette(percent: number) {
  switch (true) {
    case percent < 33:
      return { colorPalette: 'red' }
    case percent < 66:
      return { colorPalette: 'orange' }
    default:
      return { colorPalette: 'green' }
  }
}
