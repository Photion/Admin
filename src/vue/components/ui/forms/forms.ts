
export const getFormProps = <T>(modelValueType: T) => {
  if (!modelValueType) {
    throw Error(`Invalid modelValue type: ${modelValueType}`);
  }

  return {
    label: {
      type: String,
      default: () => '',
    },
    modelValue: {
      type: modelValueType,
      required: true,
      default: () => NaN,
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  };
};
