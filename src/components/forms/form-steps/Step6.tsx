import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { formSchema } from '../ProjectReportForm';
import { z } from 'zod';
import { Checkbox } from '../../ui/checkbox';
import { FieldContent } from '../../ui/field';

type Props = {
 currentStep: number;
 form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const step6Schema = z.object({
 salaryWages: z.boolean(),
 purchaseOfEquipment: z.boolean(),
 freight: z.boolean(),
 powerFuel: z.boolean(),
 printingStationery: z.boolean(),
 advertisement: z.boolean(),
 miscellaneousExpenses: z.boolean(),
 postageCourier: z.boolean(),
 transportConveyance: z.boolean(),
 staffWelfare: z.boolean(),
 repairMaintenance: z.boolean(),
 rent: z.boolean(),
 electricityExpenses: z.boolean(),
 purchaseOfRawMaterials: z.boolean(),
 otherExpanses: z.boolean(),
});

const Step6 = ({ currentStep, form }: Props) => {
 return (
  <FieldGroup className={`${currentStep === 5 ? "flex! flex-col gap-4" : "hidden!"}`}>
   <Controller
    name="salaryWages"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="salaryWages"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="salaryWages">
        Salary & Wages
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="purchaseOfEquipment"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="purchaseOfEquipment"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="purchaseOfEquipment">
        Purchase of Equipment
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="freight"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="freight"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="freight">Freight</FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="powerFuel"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="powerFuel"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="powerFuel">Power & Fuel</FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="printingStationery"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="printingStationery"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="printingStationery">
        Printing & Stationery
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="advertisement"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="advertisement"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="advertisement">
        Advertisement
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="miscellaneousExpenses"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="miscellaneousExpenses"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="miscellaneousExpenses">
        Miscellaneous Expenses
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="postageCourier"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="postageCourier"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="postageCourier">
        Postage & Courier
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="transportConveyance"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="transportConveyance"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="transportConveyance">
        Transport & Conveyance
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="staffWelfare"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="staffWelfare"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="staffWelfare">
        Staff Welfare
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="repairMaintenance"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="repairMaintenance"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="repairMaintenance">
        Repair & Maintenance
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="rent"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="rent"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="rent">Rent</FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="electricityExpenses"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="electricityExpenses"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="electricityExpenses">
        Electricity Expenses
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="purchaseOfRawMaterials"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="purchaseOfRawMaterials"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="purchaseOfRawMaterials">
        Purchase of Raw Materials
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="otherExpanses"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="otherExpanses"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="otherExpanses">
        Other Expanses
       </FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />
  </FieldGroup>
 )
}

export default Step6