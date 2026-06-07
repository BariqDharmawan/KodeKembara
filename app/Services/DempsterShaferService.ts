import CareerSkillMapping from 'App/Models/CareerSkillMapping'
import CareerEducationMapping from 'App/Models/CareerEducationMapping'
import SkillExperience from 'App/Models/SkillExperience'
import UserEducationalTaken from 'App/Models/UserEducationalTaken'
import User from 'App/Models/User'
import CareerAvailable from 'App/Models/CareerAvailable'
import { MAX_BELIEF_WEIGHT } from 'Config/constant'

type MassFunction = {
  singletons: Map<string, number>
  theta: number
}

type RecommendationResult = {
  career: {
    id: string
    title: string
  }
  belief: number
  plausibility: number
  supporting_evidence: {
    skills: string[]
    education: string[]
    current_job?: string
  }
}

type Evidence = {
  careerId: string
  weight: number
}

const CURRENT_JOB_WEIGHT = 0.9
const CONFLICT_EPSILON = 1e-9
const MIN_PLAUSIBILITY = 0.001

export default class DempsterShaferService {
  public async calculateCandidates(userId: User['id']): Promise<RecommendationResult[]> {
    const userSkills = await SkillExperience.query().where('user_uuid', userId).preload('skillName')

    const userEducations = await UserEducationalTaken.query()
      .where('user_uuid', userId)
      .preload('educational')

    const userProfile = await User.query().where('id', userId).preload('profile').first()
    const currentJob = userProfile?.profile?.current_job

    const skillIds = userSkills.map((s) => s.skill_availables_id)
    const eduIds = userEducations.map((e) => e.educational_uuid)

    const skillMappings = skillIds.length
      ? await CareerSkillMapping.query()
          .whereIn('skill_available_id', skillIds)
          .preload('careerAvailable')
          .preload('skillAvailable')
      : []

    const eduMappings = eduIds.length
      ? await CareerEducationMapping.query()
          .whereIn('educational_id', eduIds)
          .preload('careerAvailable')
          .preload('educational')
      : []

    const evidences: Evidence[] = []
    const careerTitles = new Map<string, string>()
    const supporting = new Map<
      string,
      { skills: Set<string>; education: Set<string>; current_job?: string }
    >()

    const ensureSupporting = (careerId: string) => {
      if (!supporting.has(careerId)) {
        supporting.set(careerId, { skills: new Set(), education: new Set() })
      }
      return supporting.get(careerId)!
    }

    for (const mapping of skillMappings) {
      const careerId = mapping.career_available_id
      careerTitles.set(careerId, mapping.careerAvailable.title)
      evidences.push({ careerId, weight: this.clampWeight(mapping.belief_weight) })
      ensureSupporting(careerId).skills.add(mapping.skillAvailable.name)
    }

    for (const mapping of eduMappings) {
      const careerId = mapping.career_available_id
      careerTitles.set(careerId, mapping.careerAvailable.title)
      evidences.push({ careerId, weight: this.clampWeight(mapping.belief_weight) })
      ensureSupporting(careerId).education.add(mapping.educational.level)
    }

    if (currentJob) {
      const matchingCareer = await CareerAvailable.query()
        .whereRaw('LOWER(title) = ?', [currentJob.toLowerCase()])
        .first()

      if (matchingCareer) {
        const careerId = matchingCareer.id
        careerTitles.set(careerId, matchingCareer.title)
        evidences.push({ careerId, weight: this.clampWeight(CURRENT_JOB_WEIGHT) })
        ensureSupporting(careerId).current_job = currentJob
      }
    }

    if (evidences.length === 0) {
      return []
    }

    let fused: MassFunction = { singletons: new Map(), theta: 1 }

    for (const evidence of evidences) {
      const evidenceMass: MassFunction = {
        singletons: new Map([[evidence.careerId, evidence.weight]]),
        theta: 1 - evidence.weight,
      }
      fused = this.combine(fused, evidenceMass)
    }

    const results: RecommendationResult[] = []

    for (const [careerId, massCareer] of fused.singletons.entries()) {
      const belief = massCareer
      const plausibility = massCareer + fused.theta

      const evidence = supporting.get(careerId)
      if (plausibility <= MIN_PLAUSIBILITY || !evidence || evidence.skills.size === 0) {
        continue
      }

      results.push({
        career: {
          id: careerId,
          title: careerTitles.get(careerId) || 'Unknown Career',
        },
        belief: Number(belief.toFixed(4)),
        plausibility: Number(plausibility.toFixed(4)),
        supporting_evidence: {
          skills: Array.from(evidence.skills),
          education: Array.from(evidence.education),
          current_job: evidence.current_job,
        },
      })
    }

    return results.sort((a, b) => b.belief - a.belief || b.plausibility - a.plausibility)
  }

  private clampWeight(weight: number): number {
    if (!Number.isFinite(weight)) return 0
    return Math.max(0, Math.min(MAX_BELIEF_WEIGHT, weight))
  }

  private combine(m1: MassFunction, m2: MassFunction): MassFunction {
    const combined = new Map<string, number>()
    let conflict = 0

    const addMass = (careerId: string, val: number) => {
      combined.set(careerId, (combined.get(careerId) || 0) + val)
    }

    // Singleton x Singleton
    for (const [k1, v1] of m1.singletons) {
      for (const [k2, v2] of m2.singletons) {
        const val = v1 * v2
        if (k1 === k2) {
          addMass(k1, val)
        } else {
          conflict += val
        }
      }
    }

    for (const [k1, v1] of m1.singletons) {
      addMass(k1, v1 * m2.theta)
    }

    for (const [k2, v2] of m2.singletons) {
      addMass(k2, m1.theta * v2)
    }

    let theta = m1.theta * m2.theta

    if (conflict >= 1 - CONFLICT_EPSILON) {
      console.warn(`Dempster-Shafer: near-total conflict (K=${conflict}); keeping previous mass`)
      return m1
    }

    const norm = 1 / (1 - conflict)
    for (const [k, v] of combined) {
      combined.set(k, v * norm)
    }
    theta *= norm

    return { singletons: combined, theta }
  }
}
