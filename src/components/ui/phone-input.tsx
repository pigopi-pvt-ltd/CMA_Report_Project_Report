import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
 Command,
 CommandEmpty,
 CommandGroup,
 CommandInput,
 CommandItem,
 CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
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
   // Set default country to India
   const defaultCountry = props.defaultCountry || "IN";
     
   // Ensure value starts with +91 if it's an Indian number and only has 10 digits
   const adjustedValue = React.useMemo(() => {
     if (value && typeof value === 'string') {
       // If it's just 10 digits, prepend +91
       if (/^\d{10}$/.test(value)) {
         return `+91${value}`;
       }
       // If it starts with 6-9 and has 10 digits, prepend +91
       if (/^[6-9]\d{9}$/.test(value)) {
         return `+91${value}`;
       }
       // If it starts with 91 and has 10 digits after, prepend +
       if (/^91[6-9]\d{9}$/.test(value)) {
         return `+${value}`;
       }
     }
     // If value is empty/undefined and default country is IN, return +91
     if (!value && defaultCountry === 'IN') {
       return '+91';
     }
     return value;
   }, [value]);
     
   // Limit input to 10 digits after country code for India
   const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
     let inputValue = e.target.value;
     // If it's an Indian number (+91), ensure only 10 digits after country code
     if (inputValue.startsWith('+91')) {
       const withoutPrefix = inputValue.substring(3); // Remove '+91'
       const digitsOnly = withoutPrefix.replace(/[\D]/g, ''); // Keep only digits
       if (digitsOnly.length > 10) {
         // Limit to 10 digits
         const limitedDigits = digitsOnly.substring(0, 10);
         e.target.value = `+91${limitedDigits}`;
       }
     } else if (!inputValue.startsWith('+91') && defaultCountry === 'IN') {
       // If user starts typing without +91 and default is India, ensure +91 prefix
       const digitsOnly = inputValue.replace(/[\D]/g, ''); // Keep only digits
       if (digitsOnly.length <= 10) {
         e.target.value = `+91${digitsOnly}`;
       } else {
         // If more than 10 digits, limit to 10
         const limitedDigits = digitsOnly.substring(0, 10);
         e.target.value = `+91${limitedDigits}`;
       }
     }
   }, [defaultCountry]);
     
   return (
    <RPNInput.default
     ref={ref}
     className={cn("flex", className)}
     flagComponent={FlagComponent}
     countrySelectComponent={CountrySelect}
     inputComponent={InputComponent}
     smartCaret={false}
     defaultCountry={defaultCountry}
     value={adjustedValue ?? undefined}
     onChange={(val) => {
      onChange?.(val ?? ("" as RPNInput.Value));
     }}
     onBlur={onBlur}
     onInput={handleInputChange}
     {...props}
    />
   );
  },
 );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
 HTMLInputElement,
 React.ComponentProps<"input">
>(({ className, onInput, ...props }, ref) => (
 <Input
  className={cn("rounded-e-lg rounded-s-none", className)}
  onInput={onInput}
  {...props}
  ref={ref}
 />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
 disabled?: boolean;
 value: RPNInput.Country;
 options: CountryEntry[];
 onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
 disabled,
 value: selectedCountry,
 options: countryList,
 onChange,
}: CountrySelectProps) => {
 const scrollAreaRef = React.useRef<HTMLDivElement>(null);
 const [searchValue, setSearchValue] = React.useState("");
 const [isOpen, setIsOpen] = React.useState(false);

 return (
  <Popover
   open={isOpen}
   modal
   onOpenChange={(open) => {
    setIsOpen(open);
    open && setSearchValue("");
   }}
  >
   <PopoverTrigger asChild>
    <Button
     type="button"
     variant="outline"
     className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"
     disabled={disabled}
    >
     <FlagComponent
      country={selectedCountry}
      countryName={selectedCountry}
     />
     <ChevronsUpDown
      className={cn(
       "-mr-2 size-4 opacity-50",
       disabled ? "hidden" : "opacity-100",
      )}
     />
    </Button>
   </PopoverTrigger>
   <PopoverContent className="w-[300px] p-0">
    <Command>
     <CommandInput
      value={searchValue}
      onValueChange={(value) => {
       setSearchValue(value);
       setTimeout(() => {
        if (scrollAreaRef.current) {
         const viewportElement = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]",
         );
         if (viewportElement) {
          viewportElement.scrollTop = 0;
         }
        }
       }, 0);
      }}
      placeholder="Search country..."
     />
     <CommandList>
      <ScrollArea ref={scrollAreaRef} className="h-72">
       <CommandEmpty>No country found.</CommandEmpty>
       <CommandGroup>
        {countryList.map(({ value, label }) =>
         value ? (
          <CountrySelectOption
           key={value}
           country={value}
           countryName={label}
           selectedCountry={selectedCountry}
           onChange={onChange}
           onSelectComplete={() => setIsOpen(false)}
          />
         ) : null,
        )}
       </CommandGroup>
      </ScrollArea>
     </CommandList>
    </Command>
   </PopoverContent>
  </Popover>
 );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
 selectedCountry: RPNInput.Country;
 onChange: (country: RPNInput.Country) => void;
 onSelectComplete: () => void;
}

const CountrySelectOption = ({
 country,
 countryName,
 selectedCountry,
 onChange,
 onSelectComplete,
}: CountrySelectOptionProps) => {
 const handleSelect = () => {
  onChange(country);
  onSelectComplete();
 };

 return (
  <CommandItem className="gap-2" onSelect={handleSelect}>
   <FlagComponent country={country} countryName={countryName} />
   <span className="flex-1 text-sm">{countryName}</span>
   <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
   <CheckIcon
    className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
   />
  </CommandItem>
 );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
 const Flag = flags[country];

 return (
  <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
   {Flag && <Flag title={countryName} />}
  </span>
 );
};

export { PhoneInput };