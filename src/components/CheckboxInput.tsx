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
        const isChecked = typeof field.value === "number";

        return (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) => {
                if (!checked) {
                  field.onChange(undefined);
                } else {
                  field.onChange(0);
                }
              }}
            />

            <FieldContent>
              <FieldLabel>{label}</FieldLabel>

              {isChecked && (
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter amount"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(Number(e.target.value))
                  }
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
