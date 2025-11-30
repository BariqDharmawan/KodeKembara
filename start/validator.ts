import { validator } from '@ioc:Adonis/Core/Validator'
import CareerEducationMapping from 'App/Models/CareerEducationMapping'
validator.rule('uniqueCareerEducation', async (value, [careerIdField], options) => {
  const careerAvailableId = options.root[careerIdField]

  const existingMapping = await CareerEducationMapping.query()
    .where('career_available_id', careerAvailableId)
    .where('educational_id', value)
    .first()

  if (existingMapping) {
    options.errorReporter.report(
      options.pointer,
      'uniqueCareerEducation',
      'This career-education mapping already exists',
      options.arrayExpressionPointer
    )
  }
})
