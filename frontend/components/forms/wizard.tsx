// start of frontend/components/forms/Wizard.tsx
'use client';
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { getStepSchema, initialValues } from '@/utils/validation';

interface WizardProps {
    children: React.ReactNode[];
    steps: {
        title: string;
        icon: React.ReactElement;
    }[];
    onComplete: (values: any) => void;
}

const Wizard: React.FC<WizardProps> = ({ children, steps, onComplete }) => {
    const [activeStep, setActiveStep] = useState(1);
    const totalSteps = steps.length;
    
    const calculateProgress = () => {
        return (activeStep === 1 ? 15 : activeStep === 2 ? 48 : 81) + '%';
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={getStepSchema(activeStep)}
            onSubmit={(values) => {
                if (activeStep === totalSteps) {
                    onComplete(values);
                }
            }}
        >
            {({ isValid, submitForm, errors }) => (
                <Form className="space-y-5">
                    {/* Progress Bar & Steps */}
                    <div className="relative z-[1]">
                        <div
                            className="absolute top-[30px] -z-[1] m-auto h-1 bg-primary transition-[width] ltr:left-0 rtl:right-0"
                            style={{ width: calculateProgress() }}
                        />
                        <ul className="mb-5 grid grid-cols-3">
                            {steps.map((step, index) => {
                                const stepNumber = index + 1;
                                const isActive = activeStep === stepNumber;
                                const isDone = activeStep > stepNumber;
                                
                                return (
                                    <li key={step.title} className="mx-auto">
                                        <button
                                            type="button"
                                            className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] 
                                                ${isActive || isDone 
                                                    ? 'border-primary bg-primary text-white' 
                                                    : 'border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]'
                                                }`}
                                            onClick={() => {
                                                // Allow clicking on previous steps
                                                if (stepNumber < activeStep) {
                                                    setActiveStep(stepNumber);
                                                }
                                            }}
                                        >
                                            {step.icon}
                                        </button>
                                        <span className={`mt-2 block text-center ${isActive ? 'text-primary' : ''}`}>
                                            {step.title}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[300px]">
                        {children[activeStep - 1]}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-5">
                        <button
                            type="button"
                            className={`btn btn-primary ${activeStep === 1 ? 'invisible' : ''}`}
                            onClick={() => setActiveStep((prev) => prev - 1)}
                        >
                            Sebelumnya
                        </button>
                        
                        <button
                            type="button"
                            className="btn btn-primary ltr:ml-auto rtl:mr-auto"
                            onClick={async () => {
                                if (await isValid) {
                                    if (activeStep === totalSteps) {
                                        await submitForm();
                                    } else {
                                        setActiveStep((prev) => prev + 1);
                                    }
                                }
                            }}
                        >
                            {activeStep === totalSteps ? 'Selesai' : 'Selanjutnya'}
                        </button>
                    </div>

                    {/* Error Summary (optional) */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-4 rounded-lg border border-danger bg-danger/10 p-3 text-sm text-danger">
                            Mohon lengkapi data yang diperlukan
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
};

export default Wizard;
// end of frontend/components/forms/Wizard.tsx