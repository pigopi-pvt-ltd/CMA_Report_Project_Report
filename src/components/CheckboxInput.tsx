import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import { FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';


export type BusinessRequirementKey =
  | "machinery"
  | "land"
  | "building"
  | "computersAndAccessories"
  | "furnituresAndFixtures"
  | "vehicle"
  | "softwareWebsiteAndApp"
  | "liveStockFarmAnimals"
  | "otherFixedExpenses"
  | "consumablesStocks"
  | "rawMaterials"
  | "workingExpenses";

export type MonthlyExpenseKey =
  "salary" |
  "purchaseOfEquipments" |
  "freight" |
  "powerAndFuel" |
  "printingAndStationery" |
  "advertisement" |
  "miscellaneousExpenses" |
  "postageAndCourier" |
  "transportAndConveyance" |
  "staffWelfare" |
  "repairAndMaintenance" |
  "rent" |
  "electricityExpenses" |
  "purchaseOfRawMaterials" |
  "otherExpenses"



type MapConfig =
  | {
    map: "businessRequirements";
    name: BusinessRequirementKey;
  }
  | {
    map: "monthlyExpenses";
    name: MonthlyExpenseKey;
  };

type NumericCheckboxAmountRowProps = {
  label: string;
  form: UseFormReturn<any>;
} & MapConfig;


function CheckboxInput({
  label,
  name,
  map,
  form,
}: NumericCheckboxAmountRowProps) {
  return (
    <Controller
      name={
        map === "businessRequirements"
          ? (`businessRequirements.${name}` as const)
          : (`monthlyExpenses.${name}` as const)
      } control={form.control}
      render={({ field, fieldState }) => {
        // Simple fix: Treat empty string as inactive, any number (including 0) as active
        const isFieldActive = field.value !== undefined && field.value !== null && field.value !== "";
        const displayValue = isFieldActive ? field.value : "";
        
        return (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <Checkbox
              checked={isFieldActive}
              onCheckedChange={(checked) => {
                if (!checked) {
                  field.onChange(""); // Uncheck = empty string (inactive)
                } else {
                  field.onChange(0); // Check = zero to show input field and make it active
                }
              }}
            />

            <FieldContent>
              <FieldLabel>{label}</FieldLabel>

              {isFieldActive && (
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={displayValue}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
              )}

              {fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}

export default CheckboxInput
