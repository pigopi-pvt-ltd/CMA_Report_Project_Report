import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Checkbox } from '../../ui/checkbox';
import { projectReportType } from '@/Schemas/projectReportSchema';
import { FieldContent } from '../../ui/field';
import { Input } from '@/components/ui/input';
import CheckboxInput from '@/components/CheckboxInput';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<projectReportType>;
}


const Step5 = ({ currentStep, form }: Props) => {

  return (
    <FieldGroup className={`${currentStep === 4 ? "flex! flex-col gap-4" : "hidden!"}`}>
      
      <StepHeaderSection title="Business Requirements" description="Select the business requirements that are applicable to your project" />


      <CheckboxInput label="Machinery" name="machinery" map="businessRequirements" form={form} />
      <CheckboxInput label="Land" name="land" form={form} map="businessRequirements" />
      <CheckboxInput label="Building" name="building" form={form} map="businessRequirements" />
      <CheckboxInput label="Computers & Accessories" name="computersAndAccessories" form={form} map="businessRequirements" />
      <CheckboxInput label="Furniture & Fixtures" name="furnituresAndFixtures" form={form} map="businessRequirements" />
      <CheckboxInput label="Vehicle" name="vehicle" form={form} map="businessRequirements" />
      <CheckboxInput label="Software, Website & App" name="softwareWebsiteAndApp" form={form} map="businessRequirements" />
      <CheckboxInput label="Livestock / Farm Animals" name="liveStockFarmAnimals" form={form} map="businessRequirements" />
      <CheckboxInput label="Other Fixed Expenses" name="otherFixedExpenses" form={form} map="businessRequirements" />
      <CheckboxInput label="Consumables / Stocks" name="consumablesStocks" form={form} map="businessRequirements" />
      <CheckboxInput label="Raw Materials" name="rawMaterials" form={form} map="businessRequirements" />
      <CheckboxInput label="Working Expenses" name="workingExpenses" form={form} map="businessRequirements" />
      {/* <Controller */}
      {/*   name="businessRequirements.machinery" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="machinery" */}
      {/*         checked={!!field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       {machineryChecked && ( */}
      {/*         <Controller */}
      {/*           name="businessRequirements.machinery" */}
      {/*           control={form.control} */}
      {/*           rules={{ required: "Amount is required" }} */}
      {/*           render={({ field, fieldState }) => ( */}
      {/*             <> */}
      {/*               <Input */}
      {/*                 type="number" */}
      {/*                 placeholder="Enter amount" */}
      {/*                 {...field} */}
      {/*               /> */}
      {/*               {fieldState.error && ( */}
      {/*                 <FieldError errors={[fieldState.error]} /> */}
      {/*               )} */}
      {/*             </> */}
      {/*           )} */}
      {/*         /> */}
      {/*       )} */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="machinery">Machinery</FieldLabel> */}
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
      {/*   name="businessRequirements.land" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="land" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="land">Land</FieldLabel> */}
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
      {/*   name="businessRequirements.building" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="building" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="building">Building</FieldLabel> */}
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
      {/*   name="businessRequirements.computersAndAccessories" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="computersAccessories" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="computersAccessories"> */}
      {/*           Computers & Accessories */}
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
      {/*   name="businessRequirements.furnituresAndFixtures" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="furnitureFixtures" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="furnitureFixtures"> */}
      {/*           Furniture & Fixtures */}
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
      {/*   name="businessRequirements.vehicle" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="vehicle" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="vehicle">Vehicle</FieldLabel> */}
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
      {/*   name="businessRequirements.softwareWebsiteAndApp" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="softwareWebsiteApp" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="softwareWebsiteApp"> */}
      {/*           Software, Website & App */}
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
      {/*   name="businessRequirements.liveStockFarmAnimals" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="livestockFarmAnimalsEtc" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="livestockFarmAnimalsEtc"> */}
      {/*           Livestock, Farm Animals, ETC */}
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
      {/*   name="businessRequirements.otherFixedExpenses" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="otherFixedExpenses" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="otherFixedExpenses"> */}
      {/*           Other Fixed Expenses */}
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
      {/*   name="businessRequirements.consumablesStocks" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="consumablesStocks" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="consumablesStocks"> */}
      {/*           Consumables/Stocks */}
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
      {/*   name="businessRequirements.rawMaterials" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="rawMaterials" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="rawMaterials"> */}
      {/*           Raw Materials */}
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
      {/*   name="businessRequirements.workingExpenses" */}
      {/*   control={form.control} */}
      {/*   render={({ field, fieldState }) => ( */}
      {/*     <Field */}
      {/*       data-invalid={fieldState.invalid} */}
      {/*       orientation="horizontal" */}
      {/*     > */}
      {/*       <Checkbox */}
      {/*         id="workingExpenses" */}
      {/*         name={field.name} */}
      {/*         disabled={false} */}
      {/*         checked={field.value} */}
      {/*         onCheckedChange={field.onChange} */}
      {/*       /> */}
      {/*       <FieldContent> */}
      {/*         <FieldLabel htmlFor="workingExpenses"> */}
      {/*           Working Expenses */}
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

export default Step5
