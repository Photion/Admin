import { mount } from '@vue/test-utils';

import PhoTooltip from '~/src/vue/components/ui/PhoTooltip.vue';

const getComponent = <T, Y>(props: T, slots?: Y) => {
  return mount(PhoTooltip, {
    props: {
      name: 'pho-button-comp',
      uuid: 'my-uuid',
      ...props,
    },
    slots: {
      default: 'Tooltip Trigger',
      ...slots,
    },
  });
};

describe('unit.vue.components.ui.PhoTooltip', () => {

  const positions = ['top', 'right', 'bottom', 'left'];

  it('Mounts', () => {
    const wrapper = getComponent({});
    expect(wrapper.element).toMatchSnapshot();
  });

  describe('On mouse enter', () => {
    it('Sets the attributes when it is shown', async () => {
      const wrapper = getComponent({});
      await wrapper.trigger('mouseenter');
      const attributes = wrapper.get('[cy]').attributes();

      expect(attributes).toMatchSnapshot();
    });

    positions.forEach((position) => {
      it(`Renders the text on '${position}'`, async () => {
        const wrapper = getComponent({ text: 'Some Tooltip Text', position });
        await wrapper.trigger('mouseenter');
        expect(wrapper.element).toMatchSnapshot();
      });
    });

    positions.forEach((position) => {
      it(`Renders the content slot on '${position}'`, async () => {
        const content = '<div>Tooltip with <strong>strong</strong> html content</div>';
        const wrapper = getComponent({}, { content, position });
        await wrapper.trigger('mouseenter');
        expect(wrapper.element).toMatchSnapshot();
      });
    });
  });

  describe('On mouse leave', () => {
    it('Hides the tooltip', async () => {
      const wrapper = getComponent({ text: 'Some Tooltip Text' });
      await wrapper.trigger('mouseenter');
      await wrapper.trigger('mouseleave');
      expect(wrapper.element).toMatchSnapshot();
    });
  });

});
