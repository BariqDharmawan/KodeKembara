import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TABLE_NAME } from 'Config/constant'

export default class CareerAvailableValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.unique({ table: TABLE_NAME.career_available, column: 'title' }),
    ]),
    desc: schema.string({ trim: true }, [rules.minLength(10)]),
  })

  public messages: CustomMessages = {
    'title.unique': `"${this.ctx.request.input('title')}" career already available`,
    'desc.minLength': 'Description must be at least 10 characters',
  }
}
