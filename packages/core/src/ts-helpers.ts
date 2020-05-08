export type ObjectOrValue<ValueType> = {
  [key: string]: ValueType | ObjectOrValue<ValueType>;
};

