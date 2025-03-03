"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import logo from "../../assets/logo.png"
import success from "../../assets/success.png"
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import "./css/regform.css"

// Unique class name prefix for this component
const classPrefix = "regform-FJqRr6PJfC6KXRsHAaKp9U3OVmAlGc"

// Yup Validation Schema
const schema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, "Please enter a valid first name (letters only)")
    .required("First name is required")
    .max(50, "First name cannot exceed 50 characters"),

  goals: yup
    .array()
    .min(1, "Please select at least one goal")
    .max(2, "You can select up to two goals")
    .of(yup.string().required("Goal is required")),

  barriers: yup.array().min(1, "Please select at least one barrier").of(yup.string().required("Barrier is required")),

  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"], "Please select a valid gender")
    .required("Please select a gender"),

  age: yup
    .number()
    .required("Age is required")
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),

  country: yup
    .string()
    .required("Please select a country")
    .oneOf(
      ["Nepal", "India", "United States", "United Kingdom", "Canada", "Australia", "Other"],
      "Please select a valid country",
    ),

  heightFeet: yup
    .number()
    .required("Height (feet) is required")
    .min(1, "Height (feet) must be at least 1")
    .max(8, "Height (feet) cannot exceed 8"),

  heightInches: yup
    .number()
    .required("Height (inches) is required")
    .min(0, "Height (inches) must be at least 0")
    .max(11, "Height (inches) cannot exceed 11"),

  currentWeight: yup
    .number()
    .required("Current weight is required")
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight cannot exceed 500 kg"),

  goalWeight: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : Number(value)))
    .required("Goal weight is required")
    .min(20, "Minimum 20 kg")
    .max(500, "Maximum 500 kg")
    .test("goal-validation", " ", function (value) {
      const { currentWeight, goalType } = this.parent

      if (!goalType || !currentWeight) return true

      const current = Number(currentWeight)
      const goal = Number(value)

      const requirements = {
        weight_loss: goal < current,
        weight_gain: goal > current,
        muscle_gain: goal >= current,
        maintain: goal === current,
      }

      if (!requirements[goalType]) {
        return this.createError({
          message: `Goal weight must be ${
            {
              weight_loss: "less than current",
              weight_gain: "more than current",
              muscle_gain: "at least current",
              maintain: "equal to current",
            }[goalType]
          } weight`,
          path: "goalWeight",
        })
      }

      return true
    }),
  goalType: yup
    .string()
    .required("Goal type is required")
    .oneOf(["weight_loss", "weight_gain", "muscle_gain", "maintain"], "Invalid goal type"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
})

const MultiStepRegistration = () => {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  // Initialize react-hook-form
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // Validate on every change
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
  } = methods

  // Log form data and errors for debugging
  console.log("Form errors:", errors)
  console.log("Form values:", watch())

  // Navigate to the next step
  const nextStep = async () => {
    // Validate only the current step's fields
    const fieldsToValidate = getFieldsForStep(step)
    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 7))
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      console.log("Validation errors:", errors)
    }
  }

  // Navigate to the previous step
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: "smooth" })
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Submit all form data
  const onSubmit = async (data) => {
    console.log("Form data before submission:", data)
    setIsProcessing(true)

    try {
      // Remove confirmPassword from the data object
      const { confirmPassword, ...dataToSend } = data

      // Send data to the backend
      const response = await axios.post("http://localhost:5001/users/register", dataToSend, { withCredentials: true })

      console.log("Backend response:", response.data)

      if (response.status === 201) {
        setIsSuccess(true)
      }
    } catch (error) {
      console.error("Registration failed:", error)
      if (error.response?.data?.errors) {
        alert(`Registration failed`)
      } else {
        alert("Registration failed. Please try again.")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Redirect to dashboard after successful submission
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  // Show loading or success messages
  if (isProcessing) return <ProcessingPage classPrefix={classPrefix} logo={logo} />
  if (isSuccess) return <SuccessMessage classPrefix={classPrefix} success={success} />

  return (
    <FormProvider {...methods}>
      <div className={`${classPrefix}-form-page`}>
        <nav className={`${classPrefix}-navbar`}>
          <div className={`${classPrefix}-logo`} onClick={() => navigate("/homepage")}>
            <img src={logo || "/placeholder.svg"} alt="logo" className={`${classPrefix}-logo-image`} />
          </div>
        </nav>

        <div className={`${classPrefix}-form-container`}>
          <div className={`${classPrefix}-progress-container`}>
            <div className={`${classPrefix}-progress-bar`}>
              <div className={`${classPrefix}-progress`} style={{ width: `${(step / 7) * 100}%` }}></div>
            </div>
            <div className={`${classPrefix}-step-indicator`}>Step {step} of 7</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={`${classPrefix}-form-content`}>
            <div className={`${classPrefix}-step-content`}>
              {step === 1 && <FirstNameStep errors={errors} classPrefix={classPrefix} />}
              {step === 2 && <GoalStep errors={errors} classPrefix={classPrefix} />}
              {step === 3 && <BarrierStep errors={errors} classPrefix={classPrefix} />}
              {step === 4 && <CommentStep classPrefix={classPrefix} />}
              {step === 5 && <GenderStep errors={errors} classPrefix={classPrefix} />}
              {step === 6 && <HeightWeightStep errors={errors} classPrefix={classPrefix} />}
              {step === 7 && <AccountCreationStep errors={errors} classPrefix={classPrefix} />}
            </div>

            <div className={`${classPrefix}-button-group`}>
              {step > 1 && (
                <button type="button" className={`${classPrefix}-back-btn`} onClick={prevStep}>
                  <ChevronLeft size={16} />
                  BACK
                </button>
              )}
              {step < 7 ? (
                <button type="button" className={`${classPrefix}-next-btn`} onClick={nextStep}>
                  NEXT
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" className={`${classPrefix}-next-btn`} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "PROCEED"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  )
}

// Helper function to get fields for each step
const getFieldsForStep = (step) => {
  switch (step) {
    case 1:
      return ["firstName"]
    case 2:
      return ["goals", "goalType"]
    case 3:
      return ["barriers"]
    case 5:
      return ["gender", "birthYear", "birthMonth", "birthDay", "country"]
    case 6:
      return ["heightFeet", "heightInches", "currentWeight", "goalWeight", "goalType"]
    case 7:
      return ["email", "password", "confirmPassword"]
    default:
      return []
  }
}

const FirstNameStep = ({ errors, classPrefix }) => {
  const { register } = useFormContext()

  return (
    <div className={`${classPrefix}-step-wrapper`}>
      <h2 className={`${classPrefix}-step-title`}>What's your First Name?</h2>
      <input
        type="text"
        placeholder="First Name"
        className={`${classPrefix}-input-field`}
        {...register("firstName")}
        aria-label="First Name"
      />
      {errors.firstName && <p className={`${classPrefix}-error-message`}>{errors.firstName.message}</p>}
    </div>
  )
}

const GoalStep = ({ errors, classPrefix }) => {
  const { setValue, watch } = useFormContext()
  const goals = ["Lose Weight", "Gain Weight", "Gain Muscle", "Maintain Weight"]
  const selectedGoals = watch("goals", [])
  const goalType = watch("goalType")
  const firstName = watch("firstName")

  const handleGoalClick = (goal) => {
    let updatedGoals = [...selectedGoals]

    // If goal is already selected, remove it
    if (selectedGoals.includes(goal)) {
      updatedGoals = selectedGoals.filter((g) => g !== goal)
    } else {
      // Check for invalid combinations
      const incompatiblePairs = {
        "Lose Weight": ["Gain Weight", "Maintain Weight"],
        "Gain Weight": ["Lose Weight", "Maintain Weight"],
        "Maintain Weight": ["Lose Weight", "Gain Weight"],
      }

      // Remove any incompatible goals
      const incompatibleGoals = incompatiblePairs[goal] || []
      updatedGoals = selectedGoals.filter((g) => !incompatibleGoals.includes(g))

      // Add the new goal
      updatedGoals.push(goal)
    }

    // Limit to max 2 goals
    if (updatedGoals.length > 2) {
      updatedGoals = updatedGoals.slice(-2)
    }

    setValue("goals", updatedGoals)

    // Set primary goal type based on first selected goal
    if (updatedGoals.length > 0) {
      const primaryGoal = updatedGoals[0]
      const goalMap = {
        "Lose Weight": "weight_loss",
        "Gain Weight": "weight_gain",
        "Gain Muscle": "muscle_gain",
        "Maintain Weight": "maintain",
      }
      setValue("goalType", goalMap[primaryGoal])
    } else {
      setValue("goalType", "")
    }
  }

  return (
    <div className={`${classPrefix}-step-wrapper`}>
      <div className={`${classPrefix}-greeting`}>
        <h2 className={`${classPrefix}-step-title`}>Thanks {firstName || "there"}!</h2>
        <p className={`${classPrefix}-step-subtitle`}>Select up to 2 goals that align with your fitness journey</p>
      </div>
      <div className={`${classPrefix}-goal-options`}>
        {goals.map((goal) => (
          <button
            key={goal}
            type="button"
            className={`${classPrefix}-goal-btn ${selectedGoals.includes(goal) ? `${classPrefix}-active` : ""}`}
            onClick={() => handleGoalClick(goal)}
          >
            {goal}
          </button>
        ))}
      </div>

      {selectedGoals.length > 0 && (
        <div className={`${classPrefix}-selected-goals`}>
          <h3 className={`${classPrefix}-selected-goals-title`}>Your selected goals:</h3>
          <div className={`${classPrefix}-goals-chips`}>
            {selectedGoals.map((goal) => (
              <div key={goal} className={`${classPrefix}-goal-chip`}>
                {goal}
              </div>
            ))}
          </div>
        </div>
      )}

      {errors.goals && <p className={`${classPrefix}-error-message`}>{errors.goals.message}</p>}
    </div>
  )
}

const BarrierStep = ({ errors, classPrefix }) => {
  const { setValue, watch } = useFormContext()
  const [selectedBarriers, setSelectedBarriers] = useState([])
  const barriers = [
    "Lack of time",
    "Lack of training",
    "Social eating and events",
    "Difficult to make food choices",
    "Food Craving",
  ]
  const watchedBarriers = watch("barriers", [])

  const handleBarrierClick = (barrier) => {
    let updatedBarriers
    if (selectedBarriers.includes(barrier)) {
      updatedBarriers = selectedBarriers.filter((b) => b !== barrier)
    } else {
      updatedBarriers = [...selectedBarriers, barrier]
    }
    setSelectedBarriers(updatedBarriers)
    setValue("barriers", updatedBarriers)
  }

  return (
    <div className={`${classPrefix}-step-wrapper`}>
      <h2 className={`${classPrefix}-step-title`}>In the past, what have been your barriers to losing weight?</h2>
      <div className={`${classPrefix}-barrier-options`}>
        {barriers.map((barrier) => (
          <button
            key={barrier}
            type="button"
            className={`${classPrefix}-barrier-btn ${watchedBarriers.includes(barrier) ? `${classPrefix}-active` : ""}`}
            onClick={() => handleBarrierClick(barrier)}
          >
            {barrier}
          </button>
        ))}
      </div>
      {errors.barriers && <p className={`${classPrefix}-error-message`}>{errors.barriers.message}</p>}
    </div>
  )
}

const CommentStep = ({ classPrefix }) => {
  return (
    <div className={`${classPrefix}-step-wrapper ${classPrefix}-comment-step`}>
      <h2 className={`${classPrefix}-comment-heading`}>
        We get it. A busy lifestyle can easily get in the way of reaching your goals.
      </h2>
      <p className={`${classPrefix}-comment-description`}>
        Luckily, we know all about managing potential pitfalls along the way because we've helped millions of people
        reach their goals.
      </p>
      <div className={`${classPrefix}-comment-illustration`}>
        <img
          src="/placeholder.svg?height=200&width=300"
          alt="Fitness journey"
          className={`${classPrefix}-illustration-image`}
        />
      </div>
    </div>
  )
}

const GenderStep = ({ errors, classPrefix }) => {
  const { register } = useFormContext()

  return (
    <div className={`${classPrefix}-step-wrapper`}>
      <h2 className={`${classPrefix}-step-title`}>
        Please select which gender we should use to calculate your calorie needs.
      </h2>
      <div className={`${classPrefix}-gender-options`}>
        <label className={`${classPrefix}-radio-label`}>
          <input type="radio" value="Male" {...register("gender")} className={`${classPrefix}-radio-input`} />
          <span className={`${classPrefix}-radio-text`}>Male</span>
        </label>
        <label className={`${classPrefix}-radio-label`}>
          <input type="radio" value="Female" {...register("gender")} className={`${classPrefix}-radio-input`} />
          <span className={`${classPrefix}-radio-text`}>Female</span>
        </label>
      </div>
      {errors.gender && <p className={`${classPrefix}-error-message`}>{errors.gender.message}</p>}

      <h3 className={`${classPrefix}-section-title`}>How old are you?</h3>
      <input
        type="number"
        placeholder="Age"
        className={`${classPrefix}-input-field`}
        {...register("age")}
        aria-label="Age"
      />
      {errors.age && <p className={`${classPrefix}-error-message`}>{errors.age.message}</p>}

      <h3 className={`${classPrefix}-section-title`}>Where do you live?</h3>
      <select {...register("country")} aria-label="Country" className={`${classPrefix}-select-field`}>
        <option value="">Select a country</option>
        <option value="Nepal">Nepal</option>
        <option value="India">India</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Canada">Canada</option>
        <option value="Australia">Australia</option>
        <option value="Other">Other</option>
      </select>
      {errors.country && <p className={`${classPrefix}-error-message`}>{errors.country.message}</p>}
    </div>
  )
}

const HeightWeightStep = ({ errors, classPrefix }) => {
  const { register, watch } = useFormContext()
  const currentWeight = watch("currentWeight")
  const goalWeight = watch("goalWeight")
  const goalType = watch("goalType")

  const getStatus = () => {
    if (!currentWeight || !goalWeight || !goalType) return null

    const numCurrent = Number(currentWeight)
    const numGoal = Number(goalWeight)

    const isValid = {
      weight_loss: numGoal < numCurrent,
      weight_gain: numGoal > numCurrent,
      muscle_gain: numGoal >= numCurrent,
      maintain: numGoal === numCurrent,
    }[goalType]

    return isValid ? "valid" : "invalid"
  }

  return (
    <div className={`${classPrefix}-step-wrapper`}>
      <h2 className={`${classPrefix}-step-title`}>How tall are you?</h2>
      <div className={`${classPrefix}-input-group`}>
        <input
          type="number"
          placeholder="Feet (ft.)"
          className={`${classPrefix}-input-field`}
          {...register("heightFeet", { required: "Feet is required" })}
        />
        <input
          type="number"
          placeholder="Inches (in)"
          className={`${classPrefix}-input-field`}
          {...register("heightInches", { required: "Inches is required" })}
        />
      </div>
      {errors.heightFeet && <p className={`${classPrefix}-error-message`}>{errors.heightFeet.message}</p>}
      {errors.heightInches && <p className={`${classPrefix}-error-message`}>{errors.heightInches.message}</p>}

      <h2 className={`${classPrefix}-section-title`}>How much do you weigh?</h2>
      <input
        type="number"
        placeholder="Current weight (kg)"
        className={`${classPrefix}-input-field`}
        {...register("currentWeight", { required: "Weight is required" })}
      />
      {errors.currentWeight && <p className={`${classPrefix}-error-message`}>{errors.currentWeight.message}</p>}

      <h2 className={`${classPrefix}-section-title`}>What's your goal weight?</h2>
      <input
        type="number"
        placeholder="Goal weight (kg)"
        className={`${classPrefix}-input-field`}
        {...register("goalWeight", { required: "Goal weight is required" })}
      />

      {errors.goalWeight && (
        <p className={`${classPrefix}-error-message`}>{errors.goalWeight.message || "Invalid goal weight"}</p>
      )}

      {currentWeight && goalWeight && goalType && (
        <div className={`${classPrefix}-validation-status ${getStatus() ? `${classPrefix}-${getStatus()}` : ""}`}>
          {getStatus() === "valid" ? (
            <>
              <CheckCircle size={18} />
              <span>Valid for {goalType.replace("_", " ")}</span>
            </>
          ) : (
            <>
              <AlertCircle size={18} />
              <span>{errors.goalWeight?.message || "Goal weight doesn't match your goal type"}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Update the AccountCreationStep component to include password visibility toggle and password match indicator
const AccountCreationStep = ({ errors, classPrefix }) => {
  const { register, watch } = useFormContext()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const password = watch("password", "")
  const confirmPassword = watch("confirmPassword", "")
  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const passwordsMismatch = password && confirmPassword && password !== confirmPassword

  return (
    <div className={`${classPrefix}-step-wrapper`}>
      <h2 className={`${classPrefix}-step-title`}>Almost there! Create your account.</h2>
      <div className={`${classPrefix}-account-form`}>
        <input
          type="email"
          placeholder="Email address"
          className={`${classPrefix}-input-field`}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className={`${classPrefix}-error-message`}>{errors.email.message}</p>}

        <div className={`${classPrefix}-password-field-container`}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`${classPrefix}-input-field`}
            {...register("password", { required: "Password is required" })}
          />
          <button
            type="button"
            className={`${classPrefix}-password-toggle`}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className={`${classPrefix}-error-message`}>{errors.password.message}</p>}

        <div className={`${classPrefix}-password-field-container`}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`${classPrefix}-input-field`}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
          />
          <button
            type="button"
            className={`${classPrefix}-password-toggle`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <Eye size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className={`${classPrefix}-error-message`}>{errors.confirmPassword.message}</p>}

        {passwordsMatch && !errors.confirmPassword && (
          <div className={`${classPrefix}-password-match ${classPrefix}-match`}>
            <CheckCircle size={16} />
            <span>Passwords match!</span>
          </div>
        )}

        {passwordsMismatch && !errors.confirmPassword && (
          <div className={`${classPrefix}-password-match ${classPrefix}-mismatch`}>
            <AlertCircle size={16} />
            <span>Passwords do not match</span>
          </div>
        )}

        <p className={`${classPrefix}-password-requirements`}>
          Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
        </p>
      </div>
    </div>
  )
}

const ProcessingPage = ({ classPrefix, logo }) => {
  const [factIndex, setFactIndex] = useState(0)
  const facts = [
    "Bananas are berries, but strawberries aren't!",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prevIndex) => (prevIndex + 1) % facts.length)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`${classPrefix}-processing-page`}>
      <div className={`${classPrefix}-logo`}>
        <img src={logo || "/placeholder.svg"} alt="logo" className={`${classPrefix}-logo-image`} />
      </div>
      <div className={`${classPrefix}-processing-container`}>
        <h2 className={`${classPrefix}-processing-text`}>Processing Your Information</h2>
        <div className={`${classPrefix}-banana-loader`}>
          <div className={`${classPrefix}-banana`}></div>
        </div>
        <div className={`${classPrefix}-fun-fact-box`}>
          <p className={`${classPrefix}-fun-fact-title`}>🍌 Banana Fact!</p>
          <p className={`${classPrefix}-fun-fact-text`}>{facts[factIndex]}</p>
        </div>
      </div>
    </div>
  )
}

const SuccessMessage = ({ classPrefix, success }) => {
  return (
    <div className={`${classPrefix}-success-container`}>
      <div className={`${classPrefix}-success-card`}>
        <div className={`${classPrefix}-success-icon`}>
          <img src={success || "/placeholder.svg"} alt="Success" />
        </div>
        <h2 className={`${classPrefix}-success-heading`}>Account created successfully!</h2>
        <p className={`${classPrefix}-success-message`}>Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

export default MultiStepRegistration

