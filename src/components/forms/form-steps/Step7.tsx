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

export const step7Schema = z.object({ nameOfTheProductServices: z.string().min(1, "Name of the Product/services is required").max(255, "Name of the Product/services must be at most 255 characters"), salesType: z.string().min(1, "Sales Type is required").refine((val) => ["monthly", "unit"].includes(val), "Invalid sales type"), monthlySalesRevenue: z.string().min(1, "Monthly Sales/Revenue is required"), });

const Step7 = ({ currentStep, form }: Props) => {
 return (
  <FieldGroup className={`${currentStep === 6 ? "flex! flex-col gap-4" : "hidden!"}`}>
   <Controller
    name="nameOfTheProductServices"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="nameOfTheProductServices">
       Name of the Product/services
      </FieldLabel>
      <Input
       {...field}
       id="nameOfTheProductServices"
       aria-invalid={fieldState.invalid}
       placeholder="Enter name of the product/services"
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
    name="salesType"
    control={form.control}
    render={({ field, fieldState }) => {
     const options = [
      {
       label: "Sales based on monthly basis",
       value: "monthly",
      },
      {
       label: "Sales based on unit basis",
       value: "unit",
      },
     ];

     return (
      <Field data-invalid={fieldState.invalid}>
       <FieldLabel htmlFor="salesType">Sales Type</FieldLabel>
       <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
        disabled={false}
       >
        <SelectTrigger
         id="salesType"
         aria-invalid={fieldState.invalid}
        >
         <SelectValue placeholder="Select sales type" />
         <SelectContent>
          <SelectGroup>
           <SelectLabel>Select a sales type</SelectLabel>
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
    name="monthlySalesRevenue"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="monthlySalesRevenue">
       Monthly Sales Revenue
      </FieldLabel>
      <Input
       {...field}
       id="monthlySalesRevenue"
       aria-invalid={fieldState.invalid}
       placeholder="Enter monthly sales revenue"
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
  </FieldGroup>
 )
}

export default Step7