import { mount } from '@vue/test-utils';

import PhoTextField from '~/src/vue/components/ui/forms/PhoTextField.vue';

const getComponent = <T>(props: T) => {
  return mount(PhoTextField, {
    props: {
      name: 'pho-text-field-comp',
      uuid: '65441ec3-a9fa-4e8c-b1e5-79d7d001e634',
      modelValue: 'abc',
      ...props,
    },
  });
};

describe('unit.vue.components.ui.forms.PhoTextField', () => {

  it('Mounts', () => {
    const wrapper = getComponent({});
    expect(wrapper.element).toMatchSnapshot();
  });

  it('Sets the attributes', () => {
    const wrapper = getComponent({});
    const attributes = wrapper.get('[cy]').attributes();

    expect(attributes).toMatchSnapshot();
  });

  it('Renders the label', async () => {
    const wrapper = getComponent({ label: 'The Best Fruit is...', modelValue: 'Blueberry' });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('Renders a disabled field', () => {
    const wrapper = getComponent({ disabled: true });
    expect(wrapper.element).toMatchSnapshot();
  });

  ['text', 'password', 'number', 'date'].forEach((type) => {
    it(`Renders a '${type}' field`, () => {
      const wrapper = getComponent({ type });
      expect(wrapper.element).toMatchSnapshot();
    });

  });

});
