import { mount } from '@vue/test-utils';

import PhoButton from '~/src/vue/components/ui/PhoButton.vue';

const getComponent = <T>(props: T) => {
  return mount(PhoButton, {
    props: {
      name: 'pho-button-comp',
      uuid: 'my-uuid',
      ...props,
    },
  });
};

describe('unit.vue.components.ui.PhoButton', () => {

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
    const wrapper = getComponent({ label: 'Magic Button' });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('Renders the icon', async () => {
    const wrapper = getComponent({ icon: 'times' });
    expect(wrapper.element).toMatchSnapshot();
  });

});
