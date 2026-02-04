import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { cmaReportType } from '@/Schemas/cmaReportSchema';
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
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="trading">Trading</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </FieldGroup>
  )
}

export default Step3
