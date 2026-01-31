import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Checkbox } from '../../ui/checkbox';
import { FieldContent } from '../../ui/field';
import { projectReportType } from '@/Schemas/projectReportSchema';
import CheckboxInput from '@/components/CheckboxInput';

type Props = {
  currentStep: number;
  form: UseFormReturn<projectReportType>;
}


const Step6 = ({ currentStep, form }: Props) => {
  return (
    <FieldGroup className={`${currentStep === 5 ? "flex! flex-col gap-4" : "hidden!"}`}>
      <CheckboxInput
        label="Salary & Wages"
        map="monthlyExpenses"
        name="salary"
        form={form}
      />

      <CheckboxInput
        label="Purchase of Equipment"
        map="monthlyExpenses"
        name="purchaseOfEquipments"
        form={form}
      />

      <CheckboxInput
        label="Freight"
        map="monthlyExpenses"
        name="freight"
        form={form}
      />

      <CheckboxInput
        label="Power & Fuel"
        map="monthlyExpenses"
        name="powerAndFuel"
        form={form}
      />

      <CheckboxInput
        label="Printing & Stationery"
        map="monthlyExpenses"
        name="printingAndStationery"
        form={form}
      />

      <CheckboxInput
        label="Advertisement"
        map="monthlyExpenses"
        name="advertisement"
        form={form}
      />

      <CheckboxInput
        label="Miscellaneous Expenses"
        map="monthlyExpenses"
        name="miscellaneousExpenses"
        form={form}
      />

      <CheckboxInput
        label="Postage & Courier"
        map="monthlyExpenses"
        name="postageAndCourier"
        form={form}
      />

      <CheckboxInput
        label="Transport & Conveyance"
        map="monthlyExpenses"
        name="transportAndConveyance"
        form={form}
      />

      <CheckboxInput
        label="Staff Welfare"
        map="monthlyExpenses"
        name="staffWelfare"
        form={form}
      />

      <CheckboxInput
        label="Repair & Maintenance"
        map="monthlyExpenses"
        name="repairAndMaintenance"
        form={form}
      />

      <CheckboxInput
        label="Rent"
        map="monthlyExpenses"
        name="rent"
        form={form}
      />

      <CheckboxInput
        label="Electricity Expenses"
        map="monthlyExpenses"
        name="electricityExpenses"
        form={form}
      />

      <CheckboxInput
        label="Purchase of Raw Materials"
        map="monthlyExpenses"
        name="purchaseOfRawMaterials"
        form={form}
      />

      <CheckboxInput
        label="Other Expenses"
        map="monthlyExpenses"
        name="otherExpenses"
        form={form}
      />
      {/* <Controller */}
      {/*   name="salaryWages" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="salaryWages" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="salaryWages"> */}
      {/*           Salary & Wages */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="purchaseOfEquipment" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="purchaseOfEquipment" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="purchaseOfEquipment"> */}
      {/*           Purchase of Equipment */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="freight" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="freight" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="freight">Freight</FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="powerFuel" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="powerFuel" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="powerFuel">Power & Fuel</FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="printingStationery" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="printingStationery" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="printingStationery"> */}
      {/*           Printing & Stationery */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="advertisement" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="advertisement" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="advertisement"> */}
      {/*           Advertisement */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="miscellaneousExpenses" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="miscellaneousExpenses" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="miscellaneousExpenses"> */}
      {/*           Miscellaneous Expenses */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="postageCourier" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="postageCourier" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="postageCourier"> */}
      {/*           Postage & Courier */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="transportConveyance" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="transportConveyance" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="transportConveyance"> */}
      {/*           Transport & Conveyance */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="staffWelfare" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="staffWelfare" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="staffWelfare"> */}
      {/*           Staff Welfare */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="repairMaintenance" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="repairMaintenance" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="repairMaintenance"> */}
      {/*           Repair & Maintenance */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="rent" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="rent" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="rent">Rent</FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="electricityExpenses" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="electricityExpenses" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="electricityExpenses"> */}
      {/*           Electricity Expenses */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="purchaseOfRawMaterials" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="purchaseOfRawMaterials" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="purchaseOfRawMaterials"> */}
      {/*           Purchase of Raw Materials */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
      {/**/}
      {/* <Controller */}
      {/*   name="otherExpanses" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="otherExpanses" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="otherExpanses"> */}
      {/*           Other Expanses */}
      {/*         </FieldLabel> */}
      {/*         <FieldDescription></FieldDescription> */}
      {/*         {fieldState.invalid && ( */}
      {/*           <FieldError errors={[fieldState.error]} /> */}
      {/*         )} */}
      {/*       </FieldContent> */}
      {/*     </Field> */}
      {/*   )} */}
      {/* /> */}
    </FieldGroup>
  )
}

export default Step6
