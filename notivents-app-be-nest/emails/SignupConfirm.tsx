import { Button, Container, Hr, Section, Tailwind, Text } from '@react-email/components'

interface SignupConfirmProps {
  link: string
}

export default function SignupConfirm({ link }: SignupConfirmProps) {
  return (
    <Tailwind>
      <Container className="bg-white px-6 py-8 font-sans text-black">
        <Section>
          <Text className="mb-3 text-2xl font-semibold leading-7 text-black">
            Confirm your email
          </Text>

          <Text className="text-base leading-6 text-black">Hi there,</Text>

          <Text className="mb-6 text-base leading-6 text-black">
            Thanks for signing up! Please confirm your email address to complete your registration.
            Just click the button below:
          </Text>

          <Button
            href={link}
            className="mb-2 rounded-md bg-black px-4 py-3 text-sm font-semibold text-white no-underline"
          >
            Confirm Email
          </Button>

          <Hr className="my-8 border-gray-200" />

          <Text className="text-xs text-gray-500">
            If you didn’t create an account, you can safely ignore this email.
          </Text>
        </Section>
      </Container>
    </Tailwind>
  )
}
