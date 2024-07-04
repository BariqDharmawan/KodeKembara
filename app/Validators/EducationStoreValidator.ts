import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Educational from 'App/Models/Educational'

export default class EducationStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    level: schema.string({ trim: true }, [
      rules.minLength(Educational.MIN_CHAR),
      rules.maxLength(Educational.MAX_CHAR),
      rules.alphaNum({
        allow: ['space', 'dash'],
      }),
      rules.unique({ table: 'educationals', column: 'level' }),
    ]),
  })

  public messages: CustomMessages = {
    'level.alphaNum': `Please input valid education level`,
    'level.maxLength': `Education level should have maximum ${Educational.MIN_CHAR} character'`,
    'level.minLength': `Education level should have minimum ${Educational.MAX_CHAR} character'`,
    'level.unique': `You already have education ${this.ctx.request.input('level')}`,
  }
}
