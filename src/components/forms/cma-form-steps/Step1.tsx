import { Controller, UseFormReturn } from "react-hook-form";
import { Field, FieldGroup, FieldLabel, FieldError } from "../../ui/field";
import { Input } from "../../ui/input";
import { cmaReportType } from "@/Schemas/cmaReportSchema";

type Props = {
  currentStep: number;
  form: UseFormReturn<cmaReportType>;
};

export default function Step1({ currentStep, form }: Props) {
  if (currentStep !== 0) return null;

  return (
    <FieldGroup>
      <Controller
        name="businessName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Business Name</FieldLabel>
            <Input {...field} placeholder="Enter business name" />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
