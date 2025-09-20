import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Identity = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  return context.switchToHttp().getRequest().userId
})
