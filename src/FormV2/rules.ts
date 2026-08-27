import type { RegisterOptions } from "react-hook-form";
import type {
  FormFieldVariant,
  FormRule,
  FormSectionDecl,
  FormValues,
} from "./types";

/**
 * Map `FormRule[]` sang `RegisterOptions` của react-hook-form.
 * Hàm thuần — test được không cần render (§11 bước 2).
 *
 * `variant` quyết định `min`/`max` là giá trị số hay độ dài chuỗi.
 */
export function toRhfRules(
  rules: FormRule[] | undefined,
  variant: FormFieldVariant,
  getValues: () => FormValues,
): RegisterOptions {
  if (!rules || rules.length === 0) return {};

  const isNumeric = variant === "number";
  const options: RegisterOptions = {};
  // Nhiều rule `validate` sẽ đè nhau nếu gán thẳng — RHF cho phép object nhiều hàm
  const validators: Record<string, (value: unknown) => true | string> = {};

  rules.forEach((rule, index) => {
    if (rule.required) {
      options.required = rule.message ?? "This field is required";
    }

    if (rule.min !== undefined) {
      const entry = { value: rule.min, message: rule.message ?? `Minimum ${rule.min}` };
      if (isNumeric) options.min = entry;
      else options.minLength = entry;
    }

    if (rule.max !== undefined) {
      const entry = { value: rule.max, message: rule.message ?? `Maximum ${rule.max}` };
      if (isNumeric) options.max = entry;
      else options.maxLength = entry;
    }

    if (rule.pattern) {
      options.pattern = { value: rule.pattern, message: rule.message ?? "Invalid format" };
    }

    if (rule.validate) {
      const fn = rule.validate;
      const message = rule.message;
      // Chữ ký khác nhau: mình trả `string | undefined`, RHF cần `true | string`
      validators[`rule${index}`] = (value) => fn(value, getValues()) ?? message ?? true;
    }
  });

  if (Object.keys(validators).length > 0) options.validate = validators;

  return options;
}

/**
 * Gộp `field.defaultValue` khai trong section với `defaultValues` truyền vào.
 * Giá trị truyền vào thắng — cùng cách `buildInitialFilterValues` đang làm.
 */
export function buildDefaultValues<T extends object>(
  sections: FormSectionDecl<T>[],
  defaultValues?: Partial<T>,
): FormValues {
  const initial: FormValues = {};

  for (const section of sections) {
    for (const field of section.fields) {
      initial[field.name] = field.defaultValue ?? "";
    }
  }

  return { ...initial, ...defaultValues };
}
