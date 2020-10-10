import { mount } from '@vue/test-utils';

import PhoBoolean from '~/src/vue/components/ui/forms/PhoBoolean.vue';

const getComponent = <T>(props: T) => {
  return mount(PhoBoolean, {
    props: {
      name: 'pho-boolean-comp',
      uuid: '65441ec3-a9fa-4e8c-b1e5-79d7d001e634',
      modelValue: false,
      ...props,
    },
  });
};

describe('unit.vue.components.ui.forms.PhoBoolean', () => {

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
    const wrapper = getComponent({ label: 'Magic Switch' });
    expect(wrapper.element).toMatchSnapshot();
  });

});
