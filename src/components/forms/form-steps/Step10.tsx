import React, { useEffect } from 'react';
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { projectReportType } from '@/Schemas/projectReportSchema';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<projectReportType>;
}

const Step10 = ({ currentStep, form }: Props) => {

  // As soon as the user navigates to Step 10, it clear any validation errors related to businessDetails.
  useEffect(() => {
    if (currentStep === 9) {
      form.clearErrors("businessDetails");
    }
  }, [currentStep, form]);

  return (
    <FieldGroup className={`${currentStep === 9 ? "flex! flex-col gap-4" : "hidden!"}`}>
      <StepHeaderSection title="Business Details" description="Provide your business details to help us understand your business better and tailor our services to your needs" />
      <Controller
        name="businessDetails.businessName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="businessName">
              Name of Business Firm
            </FieldLabel>
            <Input
              {...field}
              id="businessName"
              aria-invalid={fieldState.invalid}
              placeholder="Enter name of your business firm"
              autoComplete="off"
              disabled={false}
            />
            <FieldDescription></FieldDescription>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name="businessDetails.legalConstitution"
        control={form.control}
        render={({ field, fieldState }) => {
          const options = [
            { label: " Proprietorship", value: "proprietorship" },
            { label: " Partnership", value: "partnership" },
            { label: "Private LTD", value: "privateltd" },
            { label: "LLP", value: "llp" },
            { label: "Others", value: "others" },
          ];

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="legalConstitution">
                Legal Constitution
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled={false}
              >
                <SelectTrigger
                  id="legalConstitution"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select legal constitution" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select legal constitution</SelectLabel>
                      {options.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <FieldDescription></FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          );
        }}
      />

      <Controller
        name="businessDetails.employementPotential"
        control={form.control}
        render={({ field, fieldState }) => {
          const options = [
            { label: " 0 to 2", value: "0to2" },
            { label: " 2 to 5", value: "2to5" },
            { label: " 5 to 10", value: "5to10" },
            { label: "10 Above", value: "10+" },
          ];

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="employmentPotential">
                Employment Potential
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled={false}
              >
                <SelectTrigger
                  id="employmentPotential"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select your employment potential" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        Select employment potential
                      </SelectLabel>
                      {options.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <FieldDescription></FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          );
        }}
      />

      <Controller
        name="businessDetails.businessStartDate"
        control={form.control}
        render={({ field, fieldState }) => {
          const options = [
            { label: "Not Started", value: "notStarted" },
            { label: "6 Months Ago", value: "6monthsAgo" },
            { label: "6-12 Months Ago", value: "6to12monthsAgo" },
            { label: "2-3 Years Ago", value: "2to3yearsAgo" },
          ];

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="whenDidYouStartTheBusiness">
                When did you start the business?
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled={false}
              >
                <SelectTrigger
                  id="whenDidYouStartTheBusiness"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select your business start status" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        Select business start status
                      </SelectLabel>
                      {options.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <FieldDescription></FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          );
        }}
      />
    </FieldGroup>
  )
}

export default Step10
