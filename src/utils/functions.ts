import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'IsUrlOrPath', async: false })
export class IsUrlOrPathConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    if (value.startsWith('/')) {
      return true;
    }
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'The value must be a valid URL or a relative path.';
  }
}


export function toTitleCase(str: string) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}