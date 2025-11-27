'use client'
import RegistrationForm from "@/components/RegistrationForm"
import Welcome from "@/components/Welcome"
import { useState } from "react"


function Register() {
  const [step, setStep] = useState(1)
  return (
    <div>
      {step === 1 && <Welcome nextStep={setStep} />}
      {step === 2 && <RegistrationForm prevStep={setStep} />}
    </div>
  )
}

export default Register
