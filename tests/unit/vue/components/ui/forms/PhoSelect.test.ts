import { mount } from '@vue/test-utils';

import { SelectOption } from '~/src/utils';
import PhoSelect from '~/src/vue/components/ui/forms/PhoSelect.vue';

interface ComponentProps {
  [key: string]: unknown;
  name?: string;
  modelValue?: string | string[];
  multiple?: boolean;
  options?: SelectOption[];
}

const getComponent = (props: ComponentProps = {}) => {
  return mount(PhoSelect, { props: {
    name: 'pho-select-comp',
    modelValue: 2,
    multiple: false,
    options: [
      { value: 1, text: 'First' },
      { value: 2, text: 'Second' },
      { value: 44, text: 'Fortyforth' },
    ],
    ...props,
  } });
};

describe('unit.vue.components.ui.forms.PhoSelect', () => {

  it('Mounts', () => {
    const wrapper = getComponent();
    expect(wrapper.element).toMatchSnapshot();
  });

  it('Displays the options menu', async () => {
    const wrapper = getComponent();
    await wrapper.get('[cy="field:pho-select-comp:trigger"]').trigger('click');

    expect(wrapper.element).toMatchSnapshot();
  });

  it('Selects a new option, changes its value', async () => {
    const wrapper = getComponent();
    await wrapper.get('[cy="field:pho-select-comp:trigger"]').trigger('click');
    await wrapper.get('[cy="field:pho-select-comp:option:44"]').trigger('click');

    const emitted = wrapper.emitted();

    expect(emitted).toMatchSnapshot();
  });

  it('Selects multiple', async () => {
    const wrapper = getComponent({ multiple: true, modelValue: [] });
    await wrapper.get('[cy="field:pho-select-comp:trigger"]').trigger('click');
    await wrapper.get('[cy="field:pho-select-comp:option:44"]').trigger('click');
    expect(wrapper.emitted()).toMatchSnapshot();

    // Since we don't have a parent component
    // the modelValue won't be updated by itself
    await wrapper.setProps({ modelValue: [44] });
    await wrapper.get('[cy="field:pho-select-comp:option:1"]').trigger('click');
    expect(wrapper.emitted()).toMatchSnapshot();
  });

  describe('Stores the current value in a hidden input', () => {
    const test = (wrapper: ReturnType<typeof getComponent>) => {
      expect((wrapper.get('[cy="field:pho-select-comp"]').element as HTMLInputElement).value).toMatchSnapshot();
    };

    it('Single', async () => {
      const wrapper = getComponent();
      test(wrapper);

      await wrapper.setProps({ modelValue: 44 });
      test(wrapper);
    });

    it('Multiple', async () => {
      const wrapper = getComponent({ multiple: true, modelValue: ['2'] });
      test(wrapper);

      await wrapper.setProps({ modelValue: ['2', '44'] });
      test(wrapper);
    });

  });


});
