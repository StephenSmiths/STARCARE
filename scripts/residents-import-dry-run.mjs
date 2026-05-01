import { readFileSync } from 'node:fs'

const readEnvFile = () => {
  try {
    const raw = readFileSync('.env', 'utf8')
    const env = {}
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx <= 0) continue
      const key = trimmed.slice(0, idx).trim()
      const val = trimmed.slice(idx + 1).trim()
      env[key] = val
    }
    return env
  } catch {
    return {}
  }
}

const fileEnv = readEnvFile()
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? fileEnv.VITE_SUPABASE_URL
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? fileEnv.VITE_SUPABASE_ANON_KEY
const ACCESS_TOKEN = process.env.STARCARE_ACCESS_TOKEN

if (!SUPABASE_URL || !ANON_KEY || !ACCESS_TOKEN) {
  console.error('缺少環境變數：STARCARE_ACCESS_TOKEN（以及 .env 內 VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY）')
  process.exit(1)
}

const rows = [
  {
    name: '測試院友A',
    bedNumber: 'E101',
    area: 'E區',
    gender: 'Female',
    age: 79,
    admissionDate: '2026-04-01',
    fundingType: 'GradeA_Subsidized',
    serviceType: 'Subsidized_Rehab',
    dementiaLevel: 'None',
    isSpecialCareCase: false,
    healthCondition: '步態訓練中',
    medicationRecord: '每日晚間服藥',
  },
  {
    name: '',
    bedNumber: 'E101',
    area: 'E區',
    gender: 'Unknown',
    age: 151,
    admissionDate: '',
    fundingType: 'BadType',
    serviceType: 'Subsidized_Rehab',
    dementiaLevel: 'None',
    isSpecialCareCase: false,
    healthCondition: '',
    medicationRecord: '',
  },
]

const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/residents-import-validate`
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: ANON_KEY,
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
  body: JSON.stringify({ rows }),
})

const body = await response.json().catch(() => ({}))
console.log(JSON.stringify({ status: response.status, result: body }, null, 2))
