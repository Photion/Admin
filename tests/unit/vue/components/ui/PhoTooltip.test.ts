import { mount } from '@vue/test-utils';

import PhoTooltip from '~/src/vue/components/ui/PhoTooltip.vue';

const getComponent = <T, Y>(props: T, slots?: Y) => {
  return mount(PhoTooltip, {
    props: {
      name: 'pho-tooltip-comp',
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

  beforeEach(() => jest.useFakeTimers());

  it('Mounts', () => {
    const wrapper = getComponent({});
    expect(wrapper.element).toMatchSnapshot();
  });

  describe('On mouse enter', () => {
    positions.forEach((position) => {
      it(`Renders the text on '${position}'`, async () => {
        const wrapper = getComponent({ text: 'Some Tooltip Text', position });
        await wrapper.trigger('mouseenter');
        await jest.runOnlyPendingTimers();
        expect(wrapper.element).toMatchSnapshot();
      });
    });

    positions.forEach((position) => {
      it(`Renders the content slot on '${position}'`, async () => {
        const content = '<div>Tooltip with <strong>strong</strong> html content</div>';
        const wrapper = getComponent({}, { content, position });
        await wrapper.trigger('mouseenter');
        await jest.runOnlyPendingTimers();
        expect(wrapper.element).toMatchSnapshot();
      });
    });

    it('Sets the attributes when it is shown', async () => {
      const wrapper = getComponent({});
      await wrapper.trigger('mouseenter');
      await jest.runAllTimers();
      const attributes = wrapper.get('[cy]').attributes();

      expect(attributes).toMatchSnapshot();
    });

  });

  describe('On mouse leave', () => {
    it('Hides the tooltip', async () => {
      const wrapper = getComponent({ text: 'Some Tooltip Text' });
      await wrapper.trigger('mouseenter');
      await jest.runAllTimers();
      await wrapper.trigger('mouseleave');
      await jest.runAllTimers();
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  describe('On mouse click', () => {
    describe('With one click', () => {
      it('Shows the tooltip', async () => {
        const wrapper = getComponent({ text: 'Some Tooltip Text' });
        await wrapper.trigger('click');
        await jest.runAllTimers();
        expect(wrapper.element).toMatchSnapshot();
      });

      it('Overrides mouseenter', async () => {
        const wrapper = getComponent({ text: 'Some Tooltip Text' });
        await wrapper.trigger('mouseenter');
        await wrapper.trigger('click');
        await jest.runAllTimers();
        expect(wrapper.element).toMatchSnapshot();
      });
    });

    describe('With two clicks', () => {
      it('Hides the tooltip', async () => {
        const wrapper = getComponent({ text: 'Some Tooltip Text' });
        await wrapper.trigger('click');
        await jest.runAllTimers();
        await wrapper.trigger('click');
        await jest.runAllTimers();
        expect(wrapper.element).toMatchSnapshot();
      });
    });

  });

});
