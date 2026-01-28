import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { formSchema } from '../ProjectReportForm';
import { z } from 'zod';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select';

type Props = {
 currentStep: number;
 form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const step10Schema = z.object({
 nameOfBusinessFirm: z.string().min(1, "Name of Business Firm is required"),
 legalConstitution: z.string().min(1, "Legal Constitution is required"),
 employmentPotential: z.string().min(1, "Employment Potential is required"),
 whenDidYouStartTheBusiness: z.string().min(1, "This field is required"),
});

const Step10 = ({ currentStep, form }: Props) => {
 return (
  <FieldGroup className={`${currentStep === 9 ? "flex! flex-col gap-4" : "hidden!"}`}>
   <Controller
    name="nameOfBusinessFirm"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="nameOfBusinessFirm">
       Name of Business Firm
      </FieldLabel>
      <Input
       {...field}
       id="nameOfBusinessFirm"
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
    name="legalConstitution"
    control={form.control}
    render={({ field, fieldState }) => {
     const options = [
      { label: " Proprietorship", value: "Proprietorship" },
      { label: " Partnership", value: "Partnership" },
      { label: "Private LTD", value: "privateLtd" },
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
    name="employmentPotential"
    control={form.control}
    render={({ field, fieldState }) => {
     const options = [
      { label: " 0 to 2", value: "0To2" },
      { label: " 2 to 5", value: "2To5" },
      { label: " 5 to 10", value: "5To10" },
      { label: "10 Above", value: "10Above" },
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
    name="whenDidYouStartTheBusiness"
    control={form.control}
    render={({ field, fieldState }) => {
     const options = [
      { label: "Not Started", value: "notStarted" },
      { label: "6 Months Ago", value: "6MonthsAgo" },
      { label: "6-12 Months Ago", value: "612MonthsAgo" },
      { label: "2-3 Years Ago", value: "23YearsAgo" },
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