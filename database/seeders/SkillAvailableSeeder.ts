import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SkillAvailable from 'App/Models/SkillAvailable'
import crypto from 'node:crypto'
import { INITIAL_SKILL_AVAILABLE } from 'Config/constant'
export default class extends BaseSeeder {
  public async run() {
    await SkillAvailable.createMany(
      INITIAL_SKILL_AVAILABLE.map((eachSkill) => ({
        id: crypto.randomUUID(),
        name: eachSkill,
      }))
    )
  }
}
