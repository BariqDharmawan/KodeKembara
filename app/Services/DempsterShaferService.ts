import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import CareerAvailable from 'App/Models/CareerAvailable'
import CareerRecommendation from 'App/Models/CareerRecommendation'
import CareerSkillConfidence from 'App/Models/CareerSkillConfidence'
import Educational from 'App/Models/Educational'
import Profile from 'App/Models/Profile'
import SkillExperience from 'App/Models/SkillExperience'

export default class DempsterShaferService {
  public async calculateBelieve(userId: string) {
    const userProfile = await Profile.query().where('user_uuid', userId).firstOrFail()
    const userEducationalLevel = await Educational.query()
      .where('id', userProfile.educational_level_id)
      .firstOrFail()
    const userSkills = await SkillExperience.query().where('user_uuid', userId).preload('skillName')

    const beliefs = {}

    // Calculate belief for educational level
    beliefs[userEducationalLevel.level] = 1 // Placeholder, replace with actual calculation

    // Calculate beliefs for skills
    for (const userSkill of userSkills) {
      const skillConfidence = await CareerSkillConfidence.query()
        .where('skill_availables_id', userSkill.skill_availables_id)
        .first()

      if (skillConfidence) {
        const careers = await userSkill.query().preload('skillName').preload('careerSuggestion')

        for (const career of careers) {
          beliefs[career.title] = (beliefs[career.title] || 0) + skillConfidence.confidence_score
        }
      }
    }

    return beliefs
  }
}
