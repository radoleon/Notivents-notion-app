import { Blockquote, Span } from '@chakra-ui/react'

export default function Testimonial() {
  return (
    <Blockquote.Root bg={'bg.subtle'} padding={8}>
      <Blockquote.Content>
        We're building this with real users, more testimonials coming soon.
      </Blockquote.Content>
      <Blockquote.Caption
        display={'flex'}
        width={'full'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Span fontWeight={'medium'}>— Notivents Team</Span>
        <Blockquote.Icon opacity={0.5} boxSize={10} rotate={'180deg'} />
      </Blockquote.Caption>
    </Blockquote.Root>
  )
}
