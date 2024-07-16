import CareerAvailable from 'App/Models/CareerAvailable'
import Educational from 'App/Models/Educational'
import SkillAvailable from 'App/Models/SkillAvailable'

class DempsterShaferService {
  public async calculate(skills: any[], education: any[]) {
    // Ambil semua karir yang tersedia
    const careers = await CareerAvailable.all()

    // Inisialisasi hasil rekomendasi
    const recommendations: any[] = []

    // Iterasi melalui setiap karir untuk menghitung kepercayaan
    for (const career of careers) {
      let belief = 0.0
      let plausibility = 1.0

      // Hitung kepercayaan berdasarkan skill dan pengalaman
      for (const skill of skills) {
        const skillModel = await SkillAvailable.find(skill.id)
        if (skillModel) {
          const skillRelevance = this.getSkillRelevanceForCareer(skillModel, career)
          belief += skillRelevance * (skill.month_of_experience / 12)
        }
      }

      // Hitung kepercayaan berdasarkan pendidikan
      for (const edu of education) {
        const educationRelevance = this.getEducationRelevanceForCareer(edu, career)
        belief += educationRelevance
      }

      plausibility -= belief

      recommendations.push({
        career: career.title,
        belief,
        plausibility,
      })
    }

    // Sortir rekomendasi berdasarkan kepercayaan tertinggi
    recommendations.sort((a, b) => b.belief - a.belief)

    return recommendations
  }

  private getSkillRelevanceForCareer(skill: SkillAvailable, career: CareerAvailable): number {
    // Implementasikan logika untuk mendapatkan relevansi skill terhadap karir
    // Contoh: cek apakah skill cocok dengan karir
    return Math.random() // Contoh: gunakan nilai acak untuk demo
  }

  private getEducationRelevanceForCareer(education: Educational, career: CareerAvailable): number {
    // Implementasikan logika untuk mendapatkan relevansi pendidikan terhadap karir
    // Contoh: cek apakah tingkat pendidikan cocok dengan persyaratan karir
    return Math.random() // Contoh: gunakan nilai acak untuk demo
  }
}

export default new DempsterShaferService()
