import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TABLE_NAME } from 'Config/constant'

export default class CareerSkillMappingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    career_available_id: schema.string({}, [
      rules.uuid(),
      rules.exists({ table: TABLE_NAME.career_available, column: 'id' }),
    ]),
    skill_available_id: schema.string({}, [
      rules.uuid(),
      rules.exists({ table: TABLE_NAME.skill_availables, column: 'id' }),
    ]),
    belief_weight: schema.number([rules.range(0, 1)]),
    min_experience_months: schema.number([rules.unsigned()]),
  })

  public messages: CustomMessages = {
    'career_available_id.required': 'Career ID is required',
    'career_available_id.uuid': 'Career ID must be a valid UUID',
    'career_available_id.exists': `Career with ID '${this.ctx.request.input('career_available_id')}' does not exist`,

    'skill_available_id.required': 'Skill ID is required',
    'skill_available_id.uuid': 'Skill ID must be a valid UUID',
    'skill_available_id.exists': `Skill with ID '${this.ctx.request.input('skill_available_id')}' does not exist`,

    'belief_weight.required': 'Belief weight is required',
    'belief_weight.number': 'Belief weight must be a number',
    'belief_weight.range': 'Belief weight must be between 0 and 1',

    'min_experience_months.required': 'Minimum experience months is required',
    'min_experience_months.number': 'Minimum experience months must be a number',
    'min_experience_months.unsigned': 'Minimum experience months must be a positive number',
  }
}
