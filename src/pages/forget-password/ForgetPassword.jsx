import { useState } from "react";
import MailConfirmation from "./MailConfirmation";
import ConfirmCode from "./ConfirmCode";
import ResetPassword from "./ResetPassword";
export default function ForgetPassword() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    <MailConfirmation setCurrentStep={setCurrentStep} />,
    <ConfirmCode setCurrentStep={setCurrentStep} />,
    <ResetPassword />,
  ];

  return <section className="forget-password">{steps[currentStep]}</section>;
}
