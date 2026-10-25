import { computed, useId } from '@usevibejs/ui';
import { controlIds, controlProps, fieldErrorItems } from '@usevibejs/form';

export interface FormControlField {
  readonly name: string;
  readonly invalid: boolean;
  readonly messages: readonly string[];
}

/** Ids, input attributes and FieldError items for one VibeForm field. */
export function useFormControl(
  field: FormControlField,
  options?: { readonly required?: boolean; readonly described?: boolean },
) {
  const ids = controlIds(useId() || 'field');
  const inputProps = computed(() => controlProps(field, ids, options));
  const errors = computed(() => fieldErrorItems(field.messages));
  return { ids, inputProps, errors };
}
