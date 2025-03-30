// start of frontend/components/forms/wizards/Step3Form.tsx
import React from 'react';
import SpouseForm from '../SpouseForm';
import ChildrenForm from '../ChildernForm';

export const Step3Form = ({ formik }: any) => {
    return (
        <div className="space-y-8">
            <SpouseForm
                values={{
                    maritalStatus: formik.values.maritalStatus,
                    spouse: formik.values.spouse,
                    previousMarriages: formik.values.previousMarriages
                }}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
            />

            <ChildrenForm
                values={{
                    hasChildren: formik.values.hasChildren,
                    numberOfChildren: formik.values.numberOfChildren,
                    children: formik.values.children
                }}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
            />
        </div>
    );
};
// end of frontend/components/forms/wizards/Step3Form.tsx