import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'isUrlOrPath', async: false })
export class IsUrlOrPathConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/; // Matches full URLs
    const pathPattern = /^\/[^\s]*$/; // Matches relative paths (starting with a "/")
    return urlPattern.test(value) || pathPattern.test(value);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'The value must be a valid URL or a relative path.';
  }
}

export function toTitleCase(str: string) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}