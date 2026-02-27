import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { cmaReportType } from '@/Schemas/cmaReportSchema';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<cmaReportType>;
}


const Step7 = ({ currentStep, form }: Props) => {
  return (
    <FieldGroup className={`${currentStep === 6 ? "flex! flex-col gap-4" : "hidden!"}`}>
      <StepHeaderSection title="Sales Revenue Details" description="Provide details about your sales revenue to help us understand your business performance and potential for growth" />
      <Controller
        name="revenueDetails.productName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="productName">
              Name of the Product/services
            </FieldLabel>
            <Input
              {...field}
              id="productName"
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
        name="revenueDetails.salesType"
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
        name="revenueDetails.salesRevenue"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="salesRevenue">
              Monthly Sales Revenue
            </FieldLabel>
            <Input
              id="salesRevenue"
              type="number"
              placeholder="Enter monthly sales revenue"
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
            />
            <FieldDescription></FieldDescription>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />


      <Controller
        
        name="revenueDetails.yearlyGrowthRate"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="yearlyGrowthRate">
              Yearly Growth Rate 
            </FieldLabel>
            <Input
              {...field}
              id="yearlyGrowthRate"
              type="number"
              // HTML level par minimum value set kar di hai
              min="5"
              placeholder="Enter yearly growth rate (Min 5%)"
              autoComplete="off"
              // Agar value undefined hai toh empty string dikhaye
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
            />
            <FieldDescription>Minimum 5% growth is expected.</FieldDescription>

            
          </Field>
        )}
      />




    </FieldGroup>
  )
}

export default Step7
