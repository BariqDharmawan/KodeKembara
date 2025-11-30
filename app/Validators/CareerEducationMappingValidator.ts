import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TABLE_NAME from 'Contracts/constant'

export default class CareerEducationMappingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    career_available_id: schema.string({}, [
      rules.uuid(),
      rules.exists({ table: TABLE_NAME.career_available, column: 'id' }),
    ]),
    educational_id: schema.string({}, [
      rules.exists({ table: TABLE_NAME.educationals, column: 'id' }),
      rules.uuid(),
    ]),
    belief_weight: schema.number([rules.range(0, 1)]),
  })

  public messages: CustomMessages = {
    'career_available_id.required': 'Career ID is required',
    'career_available_id.uuid': 'Career ID must be a valid UUID',
    'career_available_id.exists': 'Career does not exist',

    'educational_id.required': 'Education ID is required',
    'educational_id.uuid': 'Education ID must be a valid UUID',
    'educational_id.exists': 'Education does not exist',

    'belief_weight.required': 'Belief weight is required',
    'belief_weight.number': 'Belief weight must be a number',
    'belief_weight.range': 'Belief weight must be between 0 and 1',
  }
}
