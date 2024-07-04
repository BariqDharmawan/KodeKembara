import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'email' }),
      rules.email(),
      rules.minLength(5),
    ]),
  })

  public messages: CustomMessages = {}
}
