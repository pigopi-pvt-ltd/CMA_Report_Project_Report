import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '../../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../../ui/input';
import { cmaReportType } from '@/Schemas/cmaReportSchema';
import { z } from 'zod';
import { EmailInput } from '../../ui/email-input';
import { PhoneInput } from '../../ui/phone-input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select';
import StepHeaderSection from '../sections/StepHeaderSection';

type Props = {
  currentStep: number;
  form: UseFormReturn<cmaReportType>;
}


const Step9 = ({ currentStep, form }: Props) => {
  return (
    <FieldGroup className={`${currentStep === 8 ? "flex! flex-col gap-4" : "hidden!"}`}>
      <StepHeaderSection title="Personal Details" description="Provide your personal details to help us understand you better and tailor our services to your needs" />
      <Controller
        name="personalDetails.fullName"
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
        name="personalDetails.email"
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
        name="personalDetails.mobile"
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
        name="personalDetails.businessMobile"
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
        name="personalDetails.personalAddress"
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
        name="personalDetails.businessAddress"
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
        name="personalDetails.gender"
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
        name="personalDetails.category"
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
        name="personalDetails.educationQualification"
        control={form.control}
        render={({ field, fieldState }) => {
          const options = [
            { label: " 8th Failed", value: "8fail" },
            { label: "8th Pass", value: "8pass" },
            { label: "10th Pass", value: "10pass" },
            { label: "12th Pass", value: "12pass" },
            { label: "Graduate", value: "graduate" },
            { label: "Post Graduate", value: "postGraduate" },
            { label: "PHD", value: "phd" },
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
        name="personalDetails.workExperience"
        control={form.control}
        render={({ field, fieldState }) => {
          const options = [
            { label: " 0-2 Years", value: "0to2" },
            { label: "2-3 Years", value: "2to3" },
            { label: "3-5 Years", value: "3to5" },
            { label: "5+ Years", value: "5+" },
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
