import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  public async run() {
    await Promise.all([
      this.runSeeder(await import('../UserSeeder')),
      this.runSeeder(await import('../CareerAvailableSeeder')),
      this.runSeeder(await import('../EducationalSeeder')),
      this.runSeeder(await import('../SkillAvailableSeeder')),
    ])

    // await this.runSeeder(await import('../UserEducationSeeder'))
    // await this.runSeeder(await import('../SkillExperienceSeeder'))
    // await this.runSeeder(await import('../CareerEducationMappingSeeder'))
    // await this.runSeeder(await import('../CareerSkillMappingSeeder'))
  }
}
