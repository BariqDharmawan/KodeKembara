const EDUCATION_AVAILABLE = [
  'SMK Rekayasa Perangkat Lunak',
  'SMK Teknik Komputer Jaringan',
  'SMK Multimedia',
  'S1 Informatika',
  'S1 Sistem Informasi',
  'S1 Desain Komunikasi Visual',
]

const USER_DUMMY = {
  admin: ['admin@kodekembara.com'],
  customer: ['bariq@kodekembara.com', 'customer1@kodekembara.com', 'customer2@kodekembara.com'],
}

const INITIAL_SKILL_AVAILABLE = [
  'Golang',
  'NodeJS',
  'Java',
  'PHP',
  'Typescript',
  'Docker',
  'React',
  'Flutter',
  'Kotlin',
  'Swift',
  'Springboot',
  'Apache Kafka',
  'GraphQL',
  'Javascript',
  'HTML/CSS',
  'Python',
]

const INITIAL_CAREER_AVAILABLE = [
  'Mobile Engineer',
  'Backend Engineer',
  'Frontend (Web) Developer',
  'Devops Engineer',
  'Video Game Designer',
  'Data scientist',
  'Application security engineer',
  'Machine learning engineer',
]

const TOTAL_USER_DUMMY = 100

const TABLE_NAME = {
  career_available: 'career_availables',
  educationals: 'educationals',
  users: 'users',
  career_recommendations: 'career_recommendations',
  skill_experiences: 'skill_experiences',
  profiles: 'profiles',
  skill_availables: 'skill_availables',
  career_skill_requirements: 'career_skill_requirements',
  career_skill_confidences: 'career_skill_confidences',
  user_educational_takens: 'user_educational_takens',
  skill_confidences: 'skill_confidences',
  career_education_mappings: 'career_education_mappings',
}

export {
  TABLE_NAME,
  EDUCATION_AVAILABLE,
  USER_DUMMY,
  INITIAL_SKILL_AVAILABLE,
  INITIAL_CAREER_AVAILABLE,
  TOTAL_USER_DUMMY,
}
