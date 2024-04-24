import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException()
    }

    const accessToken = this.jwt.sign({ sub: user.id })
    return { access_token: accessToken }
  }
}
