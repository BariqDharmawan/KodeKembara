import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    educational_level_id: schema.array().members(schema.string({ trim: true })),
    age: schema.number([rules.unsigned(), rules.range(19, 75)]),
    current_job: schema.string.optional([rules.minLength(3)]),
  })

  public messages: CustomMessages = {
    'educational_level_id.unique': `You already have education with ID ${this.ctx.request.input('educational_level_id')}`,
  }
}
