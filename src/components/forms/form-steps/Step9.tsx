import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { formSchema } from '../ProjectReportForm';
import { z } from 'zod';
import { EmailInput } from '../../ui/email-input';
import { PhoneInput } from '../../ui/phone-input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select';

type Props = {
 currentStep: number;
 form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const step9Schema = z.object({
 fullName: z.string().min(1, "Full Name is required"),
 emailAddress: z.string().email("Invalid email address"),
 mobileNumber: z.string().min(10, "Mobile Number must be at least 10 digits"),
 businessMobile: z.string().min(10, "Business Mobile must be at least 10 digits"),
 personalAddress: z.string().min(1, "Personal Address is required"),
 businessAddress: z.string().min(1, "Business Address is required"),
 gender: z.string().min(1, "Gender is required"),
 category: z.string().min(1, "Category is required"),
 educationQualification: z.string().min(1, "Education is required"),
 workExperience: z.string().min(1, "Work Experience is required"),
});

const Step9 = ({ currentStep, form }: Props) => {
 return (
  <FieldGroup className={`${currentStep === 8 ? "flex! flex-col gap-4" : "hidden!"}`}>
   <Controller
    name="fullName"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
      <Input
       {...field}
       id="fullName"
       aria-invalid={fieldState.invalid}
       placeholder="Enter your full name"
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
    name="emailAddress"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="emailAddress">Email Address</FieldLabel>
      <EmailInput
       {...field}
       id="emailAddress"
       aria-invalid={fieldState.invalid}
       placeholder="Enter your email"
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
    name="mobileNumber"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="mobileNumber">Mobile Number</FieldLabel>
      <PhoneInput
       {...field}
       id="mobileNumber"
       placeholder="Enter your mobile number"
       aria-invalid={fieldState.invalid}
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
    name="businessMobile"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="businessMobile">
       Business Mobile
      </FieldLabel>
      <PhoneInput
       {...field}
       id="businessMobile"
       placeholder="Enter your business mobile number"
       aria-invalid={fieldState.invalid}
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
    name="personalAddress"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="personalAddress">
       Personal Address
      </FieldLabel>
      <Input
       {...field}
       id="personalAddress"
       aria-invalid={fieldState.invalid}
       placeholder="Enter your complete address"
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
    name="businessAddress"
    control={form.control}
    render={({ field, fieldState }) => (
     <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="businessAddress">
       Business Address
      </FieldLabel>
      <Input
       {...field}
       id="businessAddress"
       aria-invalid={fieldState.invalid}
       placeholder="Enter your complete business address"
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
    name="gender"
    control={form.control}
    render={({ field, fieldState }) => {
     const options = [
      { label: "Male ", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
     ];

     return (
      <Field data-invalid={fieldState.invalid}>
       <FieldLabel htmlFor="gender">Gender</FieldLabel>
       <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
        disabled={false}
       >
        <SelectTrigger
         id="gender"
         aria-invalid={fieldState.invalid}
        >
         <SelectValue placeholder="Select your gender" />
         <SelectContent>
          <SelectGroup>
           <SelectLabel>Select your gender</SelectLabel>
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
    name="category"
    control={form.control}
    render={({ field, fieldState }) => {
     const options = [
      { label: "General", value: "general" },
      { label: "OBC", value: "obc" },
      { label: "SC", value: "sc" },
      { label: "ST", value: "st" },
     ];

     return (
      <Field data-invalid={fieldState.invalid}>
       <FieldLabel htmlFor="category">Category</FieldLabel>
       <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
        disabled={false}
       >
        <SelectTrigger
         id="category"
         aria-invalid={fieldState.invalid}
        >
         <SelectValue placeholder="Select your category" />
         <SelectContent>
          <SelectGroup>
           <SelectLabel>Select your category</SelectLabel>
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
    name="educationQualification"
    control={form.control}
    render={({ field, fieldState }) => {
     const options = [
      { label: " 8th Failed", value: "8thFailed" },
      { label: "8th Pass", value: "8thPass" },
      { label: "10th Pass", value: "10thPass" },
      { label: "12th Pass", value: "12thPass" },
      { label: "Graduate", value: "graduate" },
      { label: "Post Graduate", value: "postGraduate" },
      { label: "PHD", value: "phd" },
      { label: " Other", value: "Other" },
     ];

     return (
      <Field data-invalid={fieldState.invalid}>
       <FieldLabel htmlFor="educationQualification">
        Education Qualification
       </FieldLabel>
       <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
        disabled={false}
       >
        <SelectTrigger
         id="educationQualification"
         aria-invalid={fieldState.invalid}
        >
         <SelectValue placeholder="Select your educational qualification" />
         <SelectContent>
          <SelectGroup>
           <SelectLabel>
            Select your educational qualification
           </SelectLabel>
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
    name="workExperience"
    control={form.control}
    render={({ field, fieldState }) => {
     const options = [
      { label: " 0-2 Years", value: "02Years" },
      { label: "2-3 Years", value: "23Years" },
      { label: "3-5 Years", value: "35Years" },
      { label: "5+ Years", value: "5Years" },
     ];

     return (
      <Field data-invalid={fieldState.invalid}>
       <FieldLabel htmlFor="workExperience">
        Work Experience
       </FieldLabel>
       <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
        disabled={false}
       >
        <SelectTrigger
         id="workExperience"
         aria-invalid={fieldState.invalid}
        >
         <SelectValue placeholder="Select your work experience" />
         <SelectContent>
          <SelectGroup>
           <SelectLabel>Select work experience</SelectLabel>
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
  </FieldGroup>
 )
}

export default Step9