import type { Component } from '@usevibejs/ui';
import { mount } from '@usevibejs/ui/testing';
import { describe, expect, it } from 'vitest';
import Checkbox from '../site/src/components/ui/Checkbox.vibe';
import FieldError from '../site/src/components/ui/FieldError.vibe';
import NativeSelect from '../site/src/components/ui/NativeSelect.vibe';
import Progress from '../site/src/components/ui/Progress.vibe';
import Slider from '../site/src/components/ui/Slider.vibe';
import Switch from '../site/src/components/ui/Switch.vibe';
import Toggle from '../site/src/components/ui/Toggle.vibe';
import Choices from './Choices.vibe';

describe('Checkbox', () => {
  it('is a native checkbox with a boolean model and states for styling', async () => {
    const wrapper = mount(Checkbox, { props: { id: 'terms', name: 'terms', required: true } });
    const input = wrapper.get('input');
    expect(input.attributes()).toMatchObject({
      type: 'checkbox',
      id: 'terms',
      'data-state': 'unchecked',
    });
    expect(input.element.required).toBe(true);
    input.element.checked = true;
    await input.trigger('change');
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    await wrapper.setProps({ modelValue: true });
    expect(input.attributes('data-state')).toBe('checked');
  });
  it('keeps the indeterminate property while the prop is set', async () => {
    const wrapper = mount(Checkbox, { props: { indeterminate: true } });
    const input = wrapper.get('input');
    expect(input.element.indeterminate).toBe(true);
    expect(input.attributes('data-state')).toBe('indeterminate');
    await wrapper.setProps({ indeterminate: false });
    expect(input.element.indeterminate).toBe(false);
  });
});

describe('Switch', () => {
  it('is a checkbox with the switch role and a boolean model', async () => {
    const wrapper = mount(Switch, { props: { size: 'sm' } });
    const input = wrapper.get('input');
    expect(input.attributes()).toMatchObject({
      role: 'switch',
      'data-size': 'sm',
      'data-state': 'unchecked',
    });
    await input.setValue(true);
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });
});

describe('RadioGroup, Avatar and InputGroup', () => {
  it('groups native radios under one name and updates the model', async () => {
    const wrapper = mount(Choices);
    const radios = wrapper.findAll('input[type="radio"]');
    const names = new Set(radios.map((radio) => radio.attributes('name')));
    expect(names.size).toBe(1);
    expect(radios[0].element.checked).toBe(true);
    expect(radios[2].element.disabled).toBe(true);
    await radios[1].trigger('change');
    expect(wrapper.get('output').text()).toBe('yearly');
    expect(radios[1].attributes('data-state')).toBe('checked');
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-label')).toBe('Plan');
  });
  it('shows the fallback until the image loads and again when it fails', async () => {
    const wrapper = mount(Choices, { props: { src: 'https://example.com/ada.png' } });
    expect(wrapper.find('[data-slot="avatar-fallback"]').exists()).toBe(true);
    await wrapper.get('img').trigger('load');
    expect(wrapper.find('[data-slot="avatar-fallback"]').exists()).toBe(false);
    expect(wrapper.get('img').isVisible()).toBe(true);
    await wrapper.setProps({ src: 'https://example.com/missing.png' });
    await wrapper.get('img').trigger('error');
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.get('[data-slot="avatar-fallback"]').text()).toBe('AL');
  });
  it('focuses the control from an addon, except from its buttons', async () => {
    const wrapper = mount(Choices, { attachTo: document.body });
    const input = wrapper.get('[data-slot="input-group-control"]');
    await wrapper.get('.icon').trigger('click');
    expect(document.activeElement).toBe(input.element);
    (document.activeElement as HTMLElement).blur();
    await wrapper.get('button').trigger('click');
    expect(document.activeElement).not.toBe(input.element);
    await input.setValue('vibe');
    expect(input.element.value).toBe('vibe');
    wrapper.unmount();
  });
});

describe('Slider', () => {
  it('renders a native range per value and keeps thumbs from crossing', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: [20, 60], labels: ['Minimum', 'Maximum'] },
    });
    const thumbs = wrapper.findAll('input[type="range"]');
    expect(thumbs.map((thumb) => thumb.attributes('aria-label'))).toEqual(['Minimum', 'Maximum']);
    expect(wrapper.get('[data-slot="slider-range"]').attributes('style')).toContain('left: 20%');
    await thumbs[0].setValue('80');
    expect(wrapper.emitted('update:modelValue')).toEqual([[[60, 60]]]);
    expect(thumbs[0].element.value).toBe('60');
  });
});

describe('Toggle, NativeSelect, Progress and FieldError', () => {
  it('toggles its pressed state', async () => {
    const wrapper = mount(Toggle, { props: { 'aria-label': 'Bold' } });
    expect(wrapper.attributes()).toMatchObject({
      type: 'button',
      'aria-pressed': 'false',
      'data-state': 'off',
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('update:pressed')).toEqual([[true]]);
  });
  it('binds the select value and puts attributes on the select', async () => {
    const wrapper = mount(NativeSelect, {
      props: { modelValue: 'b', 'aria-label': 'Letter', class: 'w-40' },
      slots: { default: () => ['a', 'b'].map((value) => new Option(value.toUpperCase(), value)) },
    });
    const select = wrapper.get('select');
    expect(select.element.value).toBe('b');
    expect(select.attributes('aria-label')).toBe('Letter');
    expect(select.classes()).toContain('w-40');
    await select.setValue('a');
    expect(wrapper.emitted('update:modelValue')).toEqual([['a']]);
  });
  it('reports progress and an indeterminate state', async () => {
    const wrapper = mount(Progress, { props: { value: 25 } });
    expect(wrapper.attributes()).toMatchObject({
      role: 'progressbar',
      'aria-valuenow': '25',
      'data-state': 'loading',
    });
    expect(wrapper.get('[data-slot="progress-indicator"]').attributes('style')).toContain(
      'translateX(-75%)',
    );
    await wrapper.setProps({ value: null });
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined();
    expect(wrapper.attributes('data-state')).toBe('indeterminate');
  });
  it('lists unique error messages and renders nothing without errors', async () => {
    const wrapper = mount(FieldError, {
      props: { errors: [{ message: 'Required' }, undefined, { message: 'Required' }] },
    });
    expect(wrapper.text()).toBe('Required');
    await wrapper.setProps({ errors: [{ message: 'Too short' }, { message: 'No spaces' }] });
    expect(wrapper.findAll('li').map((item) => item.text())).toEqual(['Too short', 'No spaces']);
    await wrapper.setProps({ errors: [] });
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});

describe('every component', () => {
  const components = import.meta.glob<{ default: Component }>('../site/src/components/ui/*.vibe', {
    eager: true,
  });
  // These parts read the state of their parent or render only with content; they are covered above.
  const nested = ['AvatarImage', 'AvatarFallback', 'RadioGroupItem', 'FieldError'];
  const standalone = Object.entries(components).filter(
    ([path]) => !nested.some((name) => path.endsWith(`/${name}.vibe`)),
  );

  it.each(standalone)('%s renders a slotted element and merges classes', (_, module) => {
    const wrapper = mount(module.default, { props: { class: 'custom-class' } });
    // SVG roots such as Spinner cannot carry data-slot in vibe.js's SVG attribute types.
    expect(wrapper.find('[data-slot], svg').exists()).toBe(true);
    expect(wrapper.find('.custom-class').exists()).toBe(true);
  });
});
