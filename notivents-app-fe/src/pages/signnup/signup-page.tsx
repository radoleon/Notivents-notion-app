import AlertBanner from '@/components/AlertBanner'
import type { PwdRequestDto } from '@/dtos/authentication/PwdRequestDto'
import { PasswordInput, PasswordStrengthMeter } from '@/generated/password-input'
import { signup } from '@/services/authenticationService'
import { emailSchema, passwordSchema, usernameSchema } from '@/validators/auth-schema'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Field,
  Heading,
  Input,
  InputGroup,
  Link,
  Presence,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { MdLockOutline, MdOutlineEmail, MdPersonOutline } from 'react-icons/md'
import { Link as RouterLink, useNavigate } from 'react-router'

interface SignupForm {
  username: {
    value: string
    error?: string
  }
  email: {
    value: string
    error?: string
  }
  password: {
    value: string
    error?: string
  }
  repeatPassword: {
    value: string
    error?: string
  }
}

interface ResponseError {
  type: 'error' | 'otp'
  message?: string
}

export default function SignupPage() {
  const [signupForm, setSignupForm] = useState<SignupForm>({
    username: { value: '' },
    email: { value: '' },
    password: { value: '' },
    repeatPassword: { value: '' }
  })

  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false)
  const [responseError, setResponseError] = useState<ResponseError | null>(null)

  const { open, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const clearResponseError = () => {
    onClose()
    setTimeout(() => {
      setResponseError(null)
    }, 200)
  }

  const getPasswordStrength = (): number => {
    let password = signupForm.password.value
    let strength = 0

    if (password.length < 8) return 0

    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    return strength
  }

  const handleInputChange = (field: keyof SignupForm, value: string): void => {
    setSignupForm(previous => ({
      ...previous,
      [field]: { error: undefined, value }
    }))

    if (responseError) {
      clearResponseError()
    }
  }

  const handleErrorChange = (field: keyof SignupForm, error: string): void => {
    setSignupForm(previous => ({
      ...previous,
      [field]: { ...previous[field], error }
    }))
  }

  const transformFormData = (form: SignupForm): PwdRequestDto => {
    return {
      // username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value
    }
  }

  const isFormFilled = (): boolean => {
    return Object.values(signupForm).every(field => field.value.trim().length)
  }

  const isFormValid = (): boolean => {
    return Object.values(signupForm).every(field => !field.error)
  }

  const validateSignupForm = (): boolean => {
    let success = true

    let result = usernameSchema.safeParse(signupForm.username.value.trim())
    if (!result.success) {
      handleErrorChange('username', result.error.issues[0].message)
      success = false
    }

    result = emailSchema.safeParse(signupForm.email.value.trim())
    if (!result.success) {
      handleErrorChange('email', result.error.issues[0].message)
      success = false
    }

    result = passwordSchema.safeParse(signupForm.password.value)
    if (!result.success) {
      handleErrorChange('password', result.error.issues[0].message)
      success = false
    }

    let passwordsMatch = signupForm.password.value === signupForm.repeatPassword.value
    if (!passwordsMatch) {
      handleErrorChange('repeatPassword', 'Provided passwords do not match')
      success = false
    }

    return success
  }

  const handleSubmit = async (): Promise<void> => {
    if (validateSignupForm()) {
      setIsLocalLoading(true)

      try {
        const response = await signup(transformFormData(signupForm))

        if (response.is_user_otp) {
          setResponseError({ type: 'otp' })
          onOpen()
        } else {
          navigate('/confirm')
        }
      } catch (error) {
        if (isAxiosError(error)) {
          setResponseError({ type: 'error', message: error.message })
          onOpen()
        }
      } finally {
        setIsLocalLoading(false)
      }
    }
  }

  return (
    <Box paddingBlock={16} maxWidth={'md'} mx={'auto'}>
      <Presence
        present={open}
        animationName={{ _open: 'fade-in', _closed: 'fade-out' }}
        animationDuration="moderate"
      >
        <Box mb={4}>
          {responseError?.type === 'error' ? (
            <AlertBanner
              status="error"
              message={responseError.message!}
              clearCallback={clearResponseError}
            />
          ) : (
            <AlertBanner
              status="warning"
              message={
                'This account was previously created without a password. To proceed, please set a password now.'
              }
              buttonCallback={() => {}}
              buttonText={'Add Password'}
            />
          )}
        </Box>
      </Presence>
      <Card.Root bgImage={`url('/bg_texture.svg')`} bgSize={'cover'}>
        <Card.Header>
          <Heading as="h1" size={'3xl'} textAlign={'center'}>
            Sign Up
          </Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={2}>
            <Field.Root invalid={!!signupForm.username.error}>
              <Field.Label>Username</Field.Label>
              <InputGroup bg={'bg'} startElement={<MdPersonOutline />}>
                <Input
                  type="text"
                  value={signupForm.username.value}
                  onChange={e => handleInputChange('username', e.target.value)}
                  placeholder="Username"
                  disabled={isLocalLoading}
                />
              </InputGroup>
              <Field.ErrorText>{signupForm.username.error}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!signupForm.email.error}>
              <Field.Label>Email</Field.Label>
              <InputGroup bg={'bg'} startElement={<MdOutlineEmail />}>
                <Input
                  type="email"
                  value={signupForm.email.value}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="Email"
                  disabled={isLocalLoading}
                />
              </InputGroup>
              <Field.ErrorText>{signupForm.email.error}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!signupForm.password.error}>
              <Field.Label>Password</Field.Label>
              <InputGroup bg={'bg'} startElement={<MdLockOutline />}>
                <PasswordInput
                  type="password"
                  value={signupForm.password.value}
                  onChange={e => handleInputChange('password', e.target.value)}
                  placeholder="Password"
                  disabled={isLocalLoading}
                />
              </InputGroup>
              <Field.ErrorText>{signupForm.password.error}</Field.ErrorText>
            </Field.Root>
            {!signupForm.password.error && <PasswordStrengthMeter value={getPasswordStrength()} />}
            <Field.Root invalid={!!signupForm.repeatPassword.error}>
              <Field.Label>Repeat Password</Field.Label>
              <InputGroup bg={'bg'} startElement={<MdLockOutline />}>
                <PasswordInput
                  type="password"
                  value={signupForm.repeatPassword.value}
                  onChange={e => handleInputChange('repeatPassword', e.target.value)}
                  placeholder="Repeat Password"
                  disabled={isLocalLoading}
                />
              </InputGroup>
              <Field.ErrorText>{signupForm.repeatPassword.error}</Field.ErrorText>
            </Field.Root>
          </Stack>
          <Checkbox.Root variant={'subtle'} mt={6}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>
              <Text fontWeight={'normal'} fontSize={'sm'}>
                I agree with the{' '}
                <RouterLink to="/login">
                  <Link as="span" variant="underline">
                    Terms & Privacy Policy
                  </Link>
                </RouterLink>
              </Text>
            </Checkbox.Label>
          </Checkbox.Root>
        </Card.Body>
        <Card.Footer>
          <Button
            onClick={handleSubmit}
            disabled={!isFormFilled() || !isFormValid() || !!responseError}
            loading={isLocalLoading}
            mx={'auto'}
          >
            Sign Up
          </Button>
        </Card.Footer>
      </Card.Root>
      <Text mt={4} fontSize={'sm'}>
        Already have an account?{' '}
        <RouterLink to="/login">
          <Link as="span" variant="underline">
            Log In
          </Link>
        </RouterLink>
      </Text>
    </Box>
  )
}
