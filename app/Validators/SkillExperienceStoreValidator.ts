import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TABLE_NAME } from 'Config/constant'

export default class SkillExperienceStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    skill_availables_id: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({
        table: TABLE_NAME.skill_experiences,
        column: 'skill_availables_id',
        where: { user_uuid: this.ctx.auth.user!.id },
      }),
    ]),
    month_of_experience: schema.number([rules.unsigned(), rules.required()]),
  })

  public messages: CustomMessages = {
    'skill_availables_id.unique': `This skill already exists in your profile`,
  }
}
