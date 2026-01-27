import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { formSchema } from '../ProjectReportForm';
import { z } from 'zod';

type Props = {
 currentStep: number;
 form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const step8Schema = z.object({
 loanPeriodYears: z.string().min(1, "Loan Period is required"),
});

const Step8 = ({ currentStep, form }: Props) => {
 return (
  <FieldGroup className={`${currentStep === 7 ? "flex! flex-col gap-4" : "hidden"}`}>
   <Controller
    name="loanPeriodYears"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="loanPeriodYears">
       Loan Period (Years)
      </FieldLabel>
      <Input
       {...field}
       id="loanPeriodYears"
       aria-invalid={fieldState.invalid}
       placeholder="Enter loan duration(5-10 years)"
       autoComplete="off"
       disabled={false}
      />
      <FieldDescription>
       Choose between 5 to 10 years for loan repayment
      </FieldDescription>
      {fieldState.invalid && (
       <FieldError errors={[fieldState.error]} />
      )}
     </Field>
    )}
   />
  </FieldGroup>
 )
}

export default Step8