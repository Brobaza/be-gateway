export class DecimalToNumberTransformer {
  to(value: number) {
    return value ? value.toString() : 0;
  }

  from(value: string): number {
    return value ? parseFloat(value) : 0;
  }
}
