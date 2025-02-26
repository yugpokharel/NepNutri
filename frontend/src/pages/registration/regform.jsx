"use client"

import { useState, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import success from "../../assets/success.png";
import tips from "../../assets/tip.jpeg";
import "./css/regform.css";

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

  barriers: yup
    .array()
    .min(1, "Please select at least one barrier")
    .of(yup.string().required("Barrier is required")),

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
      "Please select a valid country"
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
    .transform(value => isNaN(value) ? undefined : Number(value))
    .required("Goal weight is required")
    .min(20, "Minimum 20 kg")
    .max(500, "Maximum 500 kg")
    .test("goal-validation", " ", function(value) {
      const { currentWeight, goalType } = this.parent;
      
      if (!goalType || !currentWeight) return true;
      
      const current = Number(currentWeight);
      const goal = Number(value);
      
      const requirements = {
        weight_loss: goal < current,
        weight_gain: goal > current,
        muscle_gain: goal >= current,
        maintain: goal === current
      };
      
      if (!requirements[goalType]) {
        return this.createError({
          message: `Goal weight must be ${{
            weight_loss: "less than current",
            weight_gain: "more than current",
            muscle_gain: "at least current",
            maintain: "equal to current"
          }[goalType]} weight`,
          path: "goalWeight"
        });
      }
      
      return true;
    }),
    goalType: yup
    .string()
    .required("Goal type is required")
    .oneOf(
      ["weight_loss", "weight_gain", "muscle_gain", "maintain"],
      "Invalid goal type"
    ),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const MultiStepRegistration = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Initialize react-hook-form
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // Validate on every change
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
  } = methods;

  // Log form data and errors for debugging
  console.log("Form errors:", errors);
  console.log("Form values:", watch());

  // Navigate to the next step
  const nextStep = async () => {
    // Validate only the current step's fields
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 7));
    } else {
      console.log("Validation errors:", errors);
    }
  };

  // Navigate to the previous step
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Submit all form data
  const onSubmit = async (data) => {
    console.log("Form data before submission:", data);
    setIsProcessing(true);
  
    try {
      // Log goalType and weight values for debugging
      console.log("Goal Type:", data.goalType);
      console.log("Current Weight:", data.currentWeight);
      console.log("Goal Weight:", data.goalWeight);
  
      // Send data to the backend
      const response = await axios.post(
        "http://localhost:5001/users/register",
        data,
        { withCredentials: true }
      );
  
      console.log("Backend response:", response.data);
  
      if (response.status === 201) {
        setIsSuccess(true);
        // navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response?.data?.errors) {
        alert(`Registration failed`);
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Redirect to dashboard after successful submission
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  // Show loading or success messages
  if (isProcessing) return <ProcessingPage />;
  if (isSuccess) return <SuccessMessage />;

  return (
    <FormProvider {...methods}>
      <div className="form-page">
        <nav className="navbar">
          <div className="logo" onClick={() => navigate("/homepage")}>
            <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
          </div>
        </nav>

        <div className="form-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(step / 7) * 100}%` }}></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form-content">
            {step === 1 && <FirstNameStep errors={errors} />}
            {step === 2 && <GoalStep errors={errors} />}
            {step === 3 && <BarrierStep errors={errors} />}
            {step === 4 && <CommentStep />}
            {step === 5 && <GenderStep errors={errors} />}
            {step === 6 && <HeightWeightStep errors={errors} />}
            {step === 7 && <AccountCreationStep errors={errors} />}

            <div className="button-group">
              {step > 1 && (
                <button type="button" className="back-btn" onClick={prevStep}>
                  BACK
                </button>
              )}
              {step < 7 ? (
                <button type="button" className="next-btn" onClick={nextStep}>
                  NEXT
                </button>
              ) : (
                <button type="submit" className="next-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "PROCEED"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

// Helper function to get fields for each step
const getFieldsForStep = (step) => {
  switch (step) {
    case 1:
      return ["firstName"];
    case 2: 
      return ["goals", "goalType"];
    case 3:
      return ["barriers"];
    case 5:
      return ["gender", "birthYear", "birthMonth", "birthDay", "country"];
    case 6:
      return ["heightFeet", "heightInches", "currentWeight", "goalWeight", "goalType"];
    case 7:
      return ["email", "password"];
    default:
      return [];
  }
};

const FirstNameStep = ({ errors }) => {
  const { register } = useFormContext();

  return (
    <>
      <h2>What's your First Name?</h2>
      <input
        type="text"
        placeholder="First Name"
        className="input-field"
        {...register("firstName")}
        aria-label="First Name"
      />
      {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
    </>
  );
};

const GoalStep = ({ errors }) => {
  const { setValue, watch } = useFormContext();
  const goals = ["Lose Weight", "Gain Weight", "Gain Muscle", "Maintain Weight"];
  const selectedGoals = watch("goals", []);
  const goalType = watch("goalType");

  const handleGoalClick = (goal) => {
    const updatedGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [goal]; // Only allow single goal selection
  
    setValue("goals", updatedGoals);
    
    // Map goal to goalType
    const goalMap = {
      "Lose Weight": "weight_loss",
      "Gain Weight": "weight_gain", 
      "Gain Muscle": "muscle_gain",
      "Maintain Weight": "maintain"
    };
    
    setValue("goalType", updatedGoals.length > 0 ? goalMap[updatedGoals[0]] : "");
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium">Thanks {watch("firstName")}!</h2>
        <p className="text-gray-600">Now pick your Goal</p>
      </div>
      <div className="space-y-3">
        {goals.map((goal) => (
          <button
            key={goal}
            type="button"
            className={`goal-btn ${selectedGoals.includes(goal) ? "active" : ""}`}
            onClick={() => handleGoalClick(goal)}
          >
            {goal}
          </button>
        ))}
        
      </div>
      {goalType && (
        <div className="goal-type-display">
          Selected goal type: {goalType.replace("_", " ")}
        </div>
           )}
      {errors.goals && <p className="error-message">{errors.goals.message}</p>}
    </div>
  );
};

const BarrierStep = ({ errors }) => {
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
    <>
      <h2>In the past, what have been your barriers to losing weight?</h2>
      <div className="barrier-options">
        {barriers.map((barrier) => (
          <button
            key={barrier}
            type="button"
            className={`barrier-btn ${watchedBarriers.includes(barrier) ? "active" : ""}`}
            onClick={() => handleBarrierClick(barrier)}
          >
            {barrier}
          </button>
        ))}
      </div>
      {errors.barriers && <p className="error-message">{errors.barriers.message}</p>}
    </>
  )
}

const CommentStep = () => {
  return (
    <>
      <h2 className="comment-heading">We get it. A busy lifestyle can easily get in the way of reaching your goals.</h2>
      <p className="comment-description">
        Luckily, we know all about managing potential pitfalls along the way because we've helped millions of people
        reach their goals.
      </p>
    </>
  )
}

const GenderStep = ({ errors }) => {
  const { register } = useFormContext();

  return (
    <>
      <h2>Please select which gender we should use to calculate your calorie needs.</h2>
      <div className="gender-options">
        <label>
          <input type="radio" value="Male" {...register("gender")} /> Male
        </label>
        <label>
          <input type="radio" value="Female" {...register("gender")} /> Female
        </label>
      </div>
      {errors.gender && <p className="error-message">{errors.gender.message}</p>}

      <h3>How old are you?</h3>
      <input
        type="number"
        placeholder="Age"
        {...register("age")}
        aria-label="Age"
      />
      {errors.age && <p className="error-message">{errors.age.message}</p>}

      <h3>Where do you live?</h3>
      <select {...register("country")} aria-label="Country">
        <option value="">Select a country</option>
        <option value="Nepal">Nepal</option>
        <option value="India">India</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Canada">Canada</option>
        <option value="Australia">Australia</option>
        <option value="Other">Other</option>
      </select>
      {errors.country && <p className="error-message">{errors.country.message}</p>}
    </>
  );
};
const HeightWeightStep = ({ errors }) => {
  const { register, watch } = useFormContext();
  const currentWeight = watch("currentWeight");
  const goalWeight = watch("goalWeight");
  const goalType = watch("goalType");

  const getStatus = () => {
    if (!currentWeight || !goalType) return null;
    
    const numCurrent = Number(currentWeight);
    const numGoal = Number(goalType);
    
    const isValid = {
      weight_loss: numGoal < numCurrent,
      weight_gain: numGoal > numCurrent,
      muscle_gain: numGoal >= numCurrent,
      maintain: numGoal === numCurrent
    }[goalType];

    return isValid ? "valid" : "invalid";
  };

  const getWeightMessage = () => {
    if (!currentWeight || !goalWeight) return null;
    
    const current = Number(currentWeight);
    const goal = Number(goalWeight);
    
    if (goalType === "weight loss" && goal >= current) {
      return "Goal must be lower than current weight for weight loss";
    }
    
    if (goalType === "weight gain" && goal <= current) {
      return "Goal must be higher than current weight for weight gain";
    }
    
    return null;
  };

  return (
    <>
      <h2>How tall are you?</h2>
      <div className="input-group">
        <input
          type="number"
          placeholder="Feet(ft.)"
          {...register("heightFeet", { required: "Feet is required" })}
        />
        <input
          type="number"
          placeholder="Inches(in)"
          {...register("heightInches", { required: "Inches is required" })}
        />
      </div>
      {errors.heightFeet && <p className="error-message">{errors.heightFeet.message}</p>}
      {errors.heightInches && <p className="error-message">{errors.heightInches.message}</p>}

      <h2>How much do you weigh?</h2>
      <input
        type="number"
        placeholder="Current weight (kg)"
        {...register("currentWeight", { required: "Weight is required" })}
      />
      {errors.currentWeight && <p className="error-message">{errors.currentWeight.message}</p>}

      <h2>What's your goal weight?</h2>
      <input
        type="number"
        placeholder="Goal weight (kg)"
        {...register("goalWeight", { required: "Goal weight is required" })}
      />

      {errors.goalWeight && (
        <p className="error-message">
          {errors.goalWeight.message || "Invalid goal weight"}
        </p>
      )}
       {currentWeight && goalType && (
        <div className={`validation-status ${getStatus()}`}>
          {getStatus() === "valid" ? (
            <><span>✓</span> Valid for {goalType.replace("_", " ")}</>
          ) : (
            <><span>⚠</span> {errors.goalWeight?.message}</>
          )}
        </div>
      )}
    </>
  );
};

const AccountCreationStep = ({ errors }) => {
  const { register } = useFormContext();

  return (
    <>
      <h2>Almost there! Create your account.</h2>
      <input
        type="email"
        placeholder="Email address"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <p className="error-message">{errors.email.message}</p>}
      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && <p className="error-message">{errors.password.message}</p>}
    </>
  );
};

const ProcessingPage = () => {
  return (
    <div className="processing-page">
      <div className="logo">
        <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
      </div>
      <div className="processing-container">
        <h2 className="processing-text">Processing Your Information!!!!</h2>
        <div className="loading-indicator"></div>
        <div className="info-box">
          <p className="info-title">💡 Did You Know?</p>
          <p className="info-text">
            "Regular exercise boosts your resting metabolism, meaning your body continues to burn calories even while
            you're at rest!"
          </p>
          <img src={tips || "/placeholder.svg"} alt="exercise tip" className="info-image" />
        </div>
      </div>
    </div>
  )
}

const SuccessMessage = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <img src={success || "/placeholder.svg"} alt="Success" />
        </div>
        <h2>Account created successfully!!!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

export default MultiStepRegistration

