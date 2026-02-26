import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import {cmaReportType } from '@/Schemas/cmaReportSchema';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<cmaReportType>;
}


const Step3 = ({ currentStep, form }: Props) => {
  return (
    <FieldGroup className={`${currentStep === 2 ? "flex! flex-col gap-4" : "hidden!"}`}>
      {/* Header */}
      <StepHeaderSection title="Select Your Industry" description="Choose the industry category that best fits your business" />

      {/* Industry Type(industryType) */}
      <Controller
        name="industryType"
        control={form.control}
        render={({ field, fieldState }) => {
          const options = [
            { label: "Manufacturing", value: "manufacturing" },
            { label: "Service", value: "service" },
            { label: "Trading", value: "trading" },
            { label: "Agriculture", value: "agriculture" },
          ];

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="industryType">
                Select Your Industry
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled={false}
              >
                <SelectTrigger
                  id="industryType"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Choose the industry category that best fits your business" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select an industry</SelectLabel>
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

export default Step3
