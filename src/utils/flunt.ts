export class Flunt {
    constructor(public errors: string[] = []) { }

    isRequired(value: any, message: string): void {
        if (value == null || value.length === 0) {
            this.errors.push(message);
        }
    }

    hasMinLen(value: string, min: number, message: string): void {
        if (!value || value.length < min) {
            this.errors.push(message);
        }
    }

    hasMaxLen(value: string, max: number, message: string): void {
        if (!value || value.length > max) {
            this.errors.push(message);
        }
    }

    isFixedLen(value: string, len: number, message: string): void {
        if (value == null || value.length !== len) {
            this.errors.push(message);
        }
    }

    isEmail(value: string, message: string): void {
        const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(value)) {
            this.errors.push(message);
        }
    }

    isNotNull(value: any, message: string): void {
        if (value == null) {
            this.errors.push(message);
        }
    }

    isGreaterThan(valuea: number, valueb: number, message: string): void {
        if (valuea <= valueb) {
            this.errors.push(message);
        }
    }

    clear(): void {
        this.errors = [];
    }

    isValid(): boolean {
        return this.errors.length === 0;
    }
}
