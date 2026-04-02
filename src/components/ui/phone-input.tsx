import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    value?: string | RPNInput.Value;
    onBlur?: () => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, onBlur, value, ...props }, ref) => {
      const defaultCountry = "IN";

      const adjustedValue = React.useMemo(() => {
        if (value && typeof value === 'string') {
          if (/^\d{10}$/.test(value)) return `+91${value}`;
          if (/^[6-9]\d{9}$/.test(value)) return `+91${value}`;
          if (/^91[6-9]\d{9}$/.test(value)) return `+${value}`;
        }
        if (!value) return '+91';
        return value;
      }, [value]);

      const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
        if (inputValue.startsWith('+91')) {
          const withoutPrefix = inputValue.substring(3);
          const digitsOnly = withoutPrefix.replace(/[\D]/g, '');
          if (digitsOnly.length > 10) {
            e.target.value = `+91${digitsOnly.substring(0, 10)}`;
          }
        } else if (!inputValue.startsWith('+91')) {
          const digitsOnly = inputValue.replace(/[\D]/g, '');
          if (digitsOnly.length <= 10) {
            e.target.value = `+91${digitsOnly}`;
          } else {
            e.target.value = `+91${digitsOnly.substring(0, 10)}`;
          }
        }
      }, []);

      return (
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 z-10 flex items-center gap-2 pointer-events-none shrink-0">
            <FlagComponent country="IN" countryName="India" />
            {/* <span className="text-sm font-medium text-foreground/80">+91</span> */}
            <div className="h-5 w-[1px] bg-border mx-0.5"></div>
          </div>

          <RPNInput.default
            ref={ref}
            className="w-full"
            countrySelectComponent={() => null} // Dropdown Hide kiya
            inputComponent={InputComponent}
            numberInputProps={{
              className: cn("!pl-[60px] w-full", className)
            }}
            smartCaret={false}
            defaultCountry="IN"
            countries={["IN"]}
            value={adjustedValue ?? undefined}
            onChange={(val) => {
              onChange?.(val ?? ("" as RPNInput.Value));
            }}
            onBlur={onBlur}
            onInput={handleInputChange}
            {...props}
          />
        </div>
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <Input
      className={className}
      {...props}
      ref={ref}
    />
  )
);
InputComponent.displayName = "InputComponent";

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country] || flags["IN"];
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName || "India"} />}
    </span>
  );
};

export { PhoneInput };