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

export const step5Schema = z.object({
 machinery: z.boolean(),
 land: z.boolean(),
 building: z.boolean(),
 computersAccessories: z.boolean(),
 furnitureFixtures: z.boolean(),
 vehicle: z.boolean(),
 softwareWebsiteApp: z.boolean(),
 livestockFarmAnimalsEtc: z.boolean(),
 otherFixedExpenses: z.boolean(),
 consumablesStocks: z.boolean(),
 rawMaterials: z.boolean(),
 workingExpenses: z.boolean(),
});

const Step5 = ({ currentStep, form }: Props) => {
 return (
  <FieldGroup className={`${currentStep === 4 ? "flex! flex-col gap-4" : "hidden!"}`}>
   <Controller
    name="machinery"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="machinery"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="machinery">Machinery</FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="land"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="land"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="land">Land</FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="building"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="building"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="building">Building</FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="computersAccessories"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="computersAccessories"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="computersAccessories">
        Computers & Accessories
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
    name="furnitureFixtures"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="furnitureFixtures"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="furnitureFixtures">
        Furniture & Fixtures
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
    name="vehicle"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="vehicle"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="vehicle">Vehicle</FieldLabel>
       <FieldDescription></FieldDescription>
       {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
       )}
      </FieldContent>
     </Field>
    )}
   />

   <Controller
    name="softwareWebsiteApp"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="softwareWebsiteApp"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="softwareWebsiteApp">
        Software, Website & App
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
    name="livestockFarmAnimalsEtc"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="livestockFarmAnimalsEtc"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="livestockFarmAnimalsEtc">
        Livestock, Farm Animals, ETC
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
    name="otherFixedExpenses"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="otherFixedExpenses"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="otherFixedExpenses">
        Other Fixed Expenses
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
    name="consumablesStocks"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="consumablesStocks"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="consumablesStocks">
        Consumables/Stocks
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
    name="rawMaterials"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="rawMaterials"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="rawMaterials">
        Raw Materials
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
    name="workingExpenses"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field
      data-invalid={fieldState.invalid}
      orientation="horizontal"
     >
      <Checkbox
       id="workingExpenses"
       name={field.name}
       disabled={false}
       checked={field.value}
       onCheckedChange={field.onChange}
      />
      <FieldContent>
       <FieldLabel htmlFor="workingExpenses">
        Working Expenses
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

export default Step5