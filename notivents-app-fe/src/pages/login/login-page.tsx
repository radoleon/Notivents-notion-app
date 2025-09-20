import AlertBanner from '@/components/AlertBanner'
import type { PwdRequestDto } from '@/dtos/authentication/PwdRequestDto'
import { PasswordInput } from '@/generated/password-input'
import { login } from '@/services/authenticationService'
import { emailSchema, passwordSchema } from '@/validators/auth-schema'
import {
  Box,
  Button,
  Card,
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
import { isAuthError } from '@supabase/supabase-js'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { MdLockOutline, MdOutlineEmail } from 'react-icons/md'
import { Link as RouterLink, useNavigate } from 'react-router'

interface LoginForm {
  email: {
    value: string
    error?: string
  }
  password: {
    value: string
    error?: string
  }
}

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: { value: '' },
    password: { value: '' }
  })

  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false)
  const [responseError, setResponseError] = useState<string | null>(null)

  const { open, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const clearResponseError = () => {
    onClose()
    setTimeout(() => {
      setResponseError(null)
    }, 200)
  }

  const handleInputChange = (field: keyof LoginForm, value: string): void => {
    setLoginForm(previous => ({
      ...previous,
      [field]: { error: undefined, value }
    }))

    if (responseError) {
      clearResponseError()
    }
  }

  const handleErrorChange = (field: keyof LoginForm, error: string): void => {
    setLoginForm(previous => ({
      ...previous,
      [field]: { ...previous[field], error }
    }))
  }

  const transformFormData = (form: LoginForm): PwdRequestDto => {
    return {
      email: form.email.value.trim(),
      password: form.password.value
    }
  }

  const isFormFilled = (): boolean => {
    return Object.values(loginForm).every(field => field.value.trim().length)
  }

  const isFormValid = (): boolean => {
    return Object.values(loginForm).every(field => !field.error)
  }

  const validateLoginForm = (): boolean => {
    let success = true

    let result = emailSchema.safeParse(loginForm.email.value.trim())
    if (!result.success) {
      handleErrorChange('email', result.error.issues[0].message)
      success = false
    }

    result = passwordSchema.safeParse(loginForm.password.value)
    if (!result.success) {
      handleErrorChange('password', result.error.issues[0].message)
      success = false
    }

    return success
  }

  const handleSubmit = async (): Promise<void> => {
    if (validateLoginForm()) {
      setIsLocalLoading(true)

      try {
        const response = await login(transformFormData(loginForm))

        if (response.is_unconfirmed) {
          navigate('/confirm')
        }
      } catch (error) {
        if (isAxiosError(error) || isAuthError(error)) {
          setResponseError(error.message)
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
          <AlertBanner status="error" message={responseError!} clearCallback={clearResponseError} />
        </Box>
      </Presence>
      <Card.Root bgImage={`url('/bg_texture.svg')`} bgSize={'cover'}>
        <Card.Header>
          <Heading as="h1" size={'3xl'} textAlign={'center'}>
            Log In
          </Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={2}>
            <Field.Root invalid={!!loginForm.email.error}>
              <Field.Label>Email</Field.Label>
              <InputGroup bg={'bg'} startElement={<MdOutlineEmail />}>
                <Input
                  type="email"
                  value={loginForm.email.value}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="Email"
                  disabled={isLocalLoading}
                />
              </InputGroup>
              <Field.ErrorText>{loginForm.email.error}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!loginForm.password.error}>
              <Field.Label>Password</Field.Label>
              <InputGroup bg={'bg'} startElement={<MdLockOutline />}>
                <PasswordInput
                  type="password"
                  value={loginForm.password.value}
                  onChange={e => handleInputChange('password', e.target.value)}
                  placeholder="Password"
                  disabled={isLocalLoading}
                />
              </InputGroup>
              <Field.ErrorText>{loginForm.password.error}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Card.Body>
        <Card.Footer>
          <Button
            onClick={handleSubmit}
            disabled={!isFormFilled() || !isFormValid() || !!responseError}
            loading={isLocalLoading}
            mx={'auto'}
          >
            Log In
          </Button>
        </Card.Footer>
      </Card.Root>
      <Text mt={4} fontSize={'sm'}>
        Doesn't have an account yet?{' '}
        <RouterLink to="/signup">
          <Link as="span" variant="underline">
            Sign Up
          </Link>
        </RouterLink>
      </Text>
    </Box>
  )
}
