// start of frontend/components/forms/PersonWizard.tsx
'use client';
import React, { useEffect } from 'react';
import { Formik, FormikProps } from 'formik';
import Wizard from './wizard';
import { Step1Form } from './wizards/Step1Form';
import { Step2Form } from './wizards/Step2Form';
import { Step3Form } from './wizards/Step3Form';
import IconUser from '@/components/icon/icon-user';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconUsers from '@/components/icon/icon-users';
import { initialValues, getStepSchema } from '@/utils/validation';

interface PersonWizardProps {
    onSubmit: (values: any) => void;
    initialData?: any;
    onChange?: (values: any, initialValues: any) => void;
}

const PersonWizard: React.FC<PersonWizardProps> = ({
    onSubmit,
    initialData,
    onChange
}) => {
    const steps = [
        {
            title: 'Data Pribadi',
            icon: <IconUser className="h-6 w-6" />,
            component: Step1Form
        },
        {
            title: 'Info Tambahan',
            icon: <IconUserPlus className="h-6 w-6" />,
            component: Step2Form
        },
        {
            title: 'Hubungan',
            icon: <IconUsers className="h-6 w-6" />,
            component: Step3Form
        }
    ];

    return (
        <Formik
            initialValues={initialData || initialValues}
            onSubmit={onSubmit}
            validationSchema={getStepSchema(1)} // Start dengan step 1
        >
            {(formikProps: FormikProps<any>) => {
                useEffect(() => {
                    if (onChange) {
                        onChange(formikProps.values, formikProps.initialValues);
                    }
                }, [formikProps.values]);

                return (
                    <Wizard
                        steps={steps.map(({ title, icon }) => ({ title, icon }))}
                        onComplete={formikProps.handleSubmit}
                    >
                        {steps.map(({ component: StepComponent }, index) => (
                            <StepComponent 
                                key={index} 
                                formik={formikProps}
                            />
                        ))}
                    </Wizard>
                );
            }}
        </Formik>
    );
};

export default PersonWizard;
// end of frontend/components/forms/PersonWizard.tsx