import { loanTypeEnum } from '@/Schemas/projectReportSchema';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../../ui/field';
import { projectReportType } from '@/Schemas/projectReportSchema';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<projectReportType>;
}

export const step4Schema = z.object({
  loanType: loanTypeEnum,
  otherLoanType: z.string().optional(),
  termLoanPercentage: z.union([
    z.number().min(0, "Percentage cannot be negative").max(100, "Percentage cannot exceed 100%"),
    z.string()
  ]).optional(),
  workingCapitalPercentage: z.union([
    z.number().min(0, "Percentage cannot be negative").max(100, "Percentage cannot exceed 100%"),
    z.string()
  ]).optional(),
  interestRateTermLoan: z.union([
    z.number().min(0, "Interest rate cannot be negative").max(100, "Interest rate cannot exceed 100%"),
    z.string()
  ]).optional(),
  interestRateCashCredit: z.union([
    z.number().min(0, "Interest rate cannot be negative").max(100, "Interest rate cannot exceed 100%"),
    z.string()
  ]).optional(),
}).superRefine((data, ctx) => {
  if (data.loanType === "others" && (!data.otherLoanType || data.otherLoanType.trim() === "")) {
    ctx.addIssue({
      code: "custom",
      message: "Please specify your other loan type",
      path: ["otherLoanType"],
    });
  }
});

// Optional: Export the type for use in your UI
export type LoanType = z.infer<typeof step4Schema>["loanType"];

const Step4 = ({ currentStep, form }: Props) => {
  // Watch the fields
  const loanType = form.watch("loanType");
  const termLoanPercentage = form.watch("termLoanPercentage" as any);
  const workingCapitalPercentage = form.watch("workingCapitalPercentage" as any);

  if (currentStep !== 3) return null;

  const tlNum = termLoanPercentage !== undefined && termLoanPercentage !== "" && !isNaN(Number(termLoanPercentage))
    ? Number(termLoanPercentage)
    : 54;
  const wcNum = workingCapitalPercentage !== undefined && workingCapitalPercentage !== "" && !isNaN(Number(workingCapitalPercentage))
    ? Number(workingCapitalPercentage)
    : 36;
  const promoterContribution = Math.max(0, 100 - tlNum - wcNum);
  const totalLoanShare = tlNum + wcNum;

  return (
    <FieldGroup className="flex! flex-col gap-6">
      {/* Header */}
      <StepHeaderSection
        title="Loan Type & Financing Breakdown"
        description="Select the loan type and specify the funding breakdown for Term Loan and Working Capital Loan"
      />

      {/* Loan Type(loanType) */}
      <Controller
        name="loanType"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="loanType">Loan Type</FieldLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger id="loanType">
                <SelectValue placeholder="Select a loan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mudra">Mudra</SelectItem>
                <SelectItem value="pmegp">PMEGP</SelectItem>
                <SelectItem value="msme">MSME Loan</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Term Loan Percentage */}
      <Controller
        name={"termLoanPercentage" as any}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="termLoanPercentage">
              Term Loan Percentage (%)
            </FieldLabel>
            <Input
              id="termLoanPercentage"
              type="number"
              min="0"
              max="100"
              placeholder="Enter Term Loan % (e.g. 54)"
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            <FieldDescription>
              Percentage of total project cost funded as Term Loan (Default: 54%)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Working Capital Loan Percentage */}
      <Controller
        name={"workingCapitalPercentage" as any}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="workingCapitalPercentage">
              Working Capital Loan Percentage (%)
            </FieldLabel>
            <Input
              id="workingCapitalPercentage"
              type="number"
              min="0"
              max="100"
              placeholder="Enter Working Capital % (e.g. 36)"
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            <FieldDescription>
              Percentage of total project cost funded as Working Capital Loan (Default: 36%)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Interest Rates (Term Loan & Working Capital) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Term Loan Interest Rate */}
        <Controller
          name={"interestRateTermLoan" as any}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="interestRateTermLoan">
                Term Loan Interest Rate (% p.a.)
              </FieldLabel>
              <Input
                id="interestRateTermLoan"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="11.1"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
              <FieldDescription>
                Annual interest rate for Term Loan (Default: 11.1%)
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Working Capital Loan Interest Rate */}
        <Controller
          name={"interestRateCashCredit" as any}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="interestRateCashCredit">
                Cash Credit / WC Interest Rate (% p.a.)
              </FieldLabel>
              <Input
                id="interestRateCashCredit"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="11.1"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
              <FieldDescription>
                Annual interest rate for Cash Credit (Default: 11.1%)
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* Breakdown Summary Box */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2 text-sm">
        <p className="font-semibold text-foreground">Project Funding Distribution Preview:</p>
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-background rounded-lg p-2.5 border border-border/40">
            <p className="text-xs text-muted-foreground font-medium">Term Loan</p>
            <p className="text-base font-bold text-primary mt-0.5">{tlNum}%</p>
          </div>
          <div className="bg-background rounded-lg p-2.5 border border-border/40">
            <p className="text-xs text-muted-foreground font-medium">Working Capital</p>
            <p className="text-base font-bold text-primary mt-0.5">{wcNum}%</p>
          </div>
          <div className="bg-background rounded-lg p-2.5 border border-border/40">
            <p className="text-xs text-muted-foreground font-medium">Promoter's Contribution</p>
            <p className={`text-base font-bold mt-0.5 ${totalLoanShare > 100 ? "text-destructive" : "text-emerald-600"}`}>
              {promoterContribution}%
            </p>
          </div>
        </div>
        {totalLoanShare > 100 ? (
          <p className="text-xs text-destructive font-medium mt-1">
            Warning: Combined loan percentage ({totalLoanShare}%) exceeds 100%. Please adjust the values.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            The remaining {promoterContribution}% of project cost will be considered as Promoter's Contribution (own funds).
          </p>
        )}
      </div>
    </FieldGroup>
  );
};

export default Step4;
